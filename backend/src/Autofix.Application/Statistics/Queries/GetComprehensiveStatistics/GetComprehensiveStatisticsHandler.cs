using MediatR;
using Autofix.Application.Statistics.Dtos;
using Autofix.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Autofix.Domain.Enum;

namespace Autofix.Application.Statistics.Queries.GetComprehensiveStatistics;

public sealed record GetComprehensiveStatisticsQuery : IRequest<ComprehensiveStatisticsDto>;

public sealed class GetComprehensiveStatisticsHandler(ApplicationDbContext dbContext)
    : IRequestHandler<GetComprehensiveStatisticsQuery, ComprehensiveStatisticsDto>
{
    public async Task<ComprehensiveStatisticsDto> Handle(GetComprehensiveStatisticsQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        
        // Fetch data in parallel
        var revenueTask = GetRevenueStatistics(cancellationToken);
        var ordersTask = GetOrderStatistics(cancellationToken);
        var servicesTask = GetServiceStatistics(cancellationToken);
        var inventoryTask = GetInventoryStatistics(cancellationToken);
        var customersTask = GetCustomerStatistics(cancellationToken);
        var employeesTask = GetEmployeeStatistics(cancellationToken);

        await Task.WhenAll(revenueTask, ordersTask, servicesTask, inventoryTask, customersTask, employeesTask);

        return new ComprehensiveStatisticsDto(
            GeneratedAt: now,
            Revenue: revenueTask.Result,
            Orders: ordersTask.Result,
            Services: servicesTask.Result,
            Inventory: inventoryTask.Result,
            Customers: customersTask.Result,
            Employees: employeesTask.Result
        );
    }

    private async Task<RevenueStatisticsDto> GetRevenueStatistics(CancellationToken cancellationToken)
    {
        var invoices = await dbContext.Invoices
            .Where(i => !i.IsDeleted && i.Status == 3) // Completed status
            .ToListAsync(cancellationToken);

        var totalRevenue = invoices.Sum(i => i.TotalAmount);
        var completedOrders = invoices.Count;
        var averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

        // Calculate labor and parts costs
        var workItems = await dbContext.ServiceWorkItems
            .Where(w => !w.IsDeleted)
            .ToListAsync(cancellationToken);
        var partItems = await dbContext.ServicePartItems
            .Where(p => !p.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalLaborCost = workItems.Sum(w => w.LaborHours * w.HourlyRate);
        var totalPartsCost = partItems.Sum(p => p.Quantity * p.UnitPrice);

        // Calculate trend (this month vs last month)
        var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var lastMonth = firstDayOfMonth.AddMonths(-1);
        
        var thisMonthRevenue = invoices
            .Where(i => i.CreatedAt >= firstDayOfMonth)
            .Sum(i => i.TotalAmount);
        
        var lastMonthRevenue = invoices
            .Where(i => i.CreatedAt >= lastMonth && i.CreatedAt < firstDayOfMonth)
            .Sum(i => i.TotalAmount);

        var revenueTrend = lastMonthRevenue > 0 
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : 0;

        return new RevenueStatisticsDto(
            TotalRevenue: totalRevenue,
            TotalLaborCost: totalLaborCost,
            TotalPartsCost: totalPartsCost,
            AverageOrderValue: averageOrderValue,
            CompletedOrders: completedOrders,
            RevenueTrend: revenueTrend
        );
    }

    private async Task<OrderStatisticsDto> GetOrderStatistics(CancellationToken cancellationToken)
    {
        var bookings = await dbContext.Bookings
            .Where(b => !b.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalOrders = bookings.Count;
        var pendingOrders = bookings.Count(b => b.Status == BookingStatus.Pending);
        var approvedOrders = bookings.Count(b => b.Status == BookingStatus.Approved);
        var inProgressOrders = bookings.Count(b => b.Status == BookingStatus.InProgress);
        var completedOrders = bookings.Count(b => b.Status == BookingStatus.Completed);
        var cancelledOrders = bookings.Count(b => b.Status == BookingStatus.Cancelled);

        var completedBookings = bookings.Where(b => b.Status == BookingStatus.Completed).ToList();
        var averageProcessingTime = completedBookings.Count > 0
            ? completedBookings.Average(b => (b.EndAt - b.CreatedAt).TotalHours)
            : 0;

        var completionRate = totalOrders > 0 ? (decimal)completedOrders / totalOrders * 100 : 0;

        return new OrderStatisticsDto(
            TotalOrders: totalOrders,
            PendingOrders: pendingOrders,
            ApprovedOrders: approvedOrders,
            InProgressOrders: inProgressOrders,
            CompletedOrders: completedOrders,
            CancelledOrders: cancelledOrders,
            AverageProcessingTimeHours: (decimal)averageProcessingTime,
            CompletionRate: completionRate
        );
    }

    private async Task<ServiceStatisticsDto> GetServiceStatistics(CancellationToken cancellationToken)
    {
        var totalServices = await dbContext.ServiceCatalogItems
            .CountAsync(s => !s.IsDeleted && s.IsActive, cancellationToken);

        var serviceUsage = await dbContext.BookingServiceItems
            .Where(b => !b.IsDeleted)
            .GroupBy(b => new { b.ServiceCatalogItemId, b.Name })
            .Select(g => new
            {
                ServiceId = g.Key.ServiceCatalogItemId,
                ServiceName = g.Key.Name,
                Count = g.Count(),
                TotalRevenue = g.Sum(x => x.BasePrice),
            })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToListAsync(cancellationToken);

        var topServices = serviceUsage.Select(s => new ServiceStatisticItemDto(
            ServiceId: s.ServiceId,
            ServiceName: s.ServiceName,
            TimesRequested: s.Count,
            TotalRevenue: s.TotalRevenue,
            AveragePrice: s.Count > 0 ? s.TotalRevenue / s.Count : 0
        )).ToList();

        var totalRequested = serviceUsage.Sum(s => s.Count);

        return new ServiceStatisticsDto(
            TotalUniqueServices: totalServices,
            ServicesRequested: totalRequested,
            TopServices: topServices
        );
    }

    private async Task<InventoryStatisticsDto> GetInventoryStatistics(CancellationToken cancellationToken)
    {
        var inventoryItems = await dbContext.InventoryItems
            .Include(i => i.Part)
            .Where(i => !i.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalItems = inventoryItems.Count;
        var itemsInStock = inventoryItems.Count(i => i.QuantityOnHand > 0);
        var itemsBelowMin = inventoryItems.Count(i => i.QuantityOnHand < i.MinLevel);
        var totalValue = inventoryItems.Sum(i => i.QuantityOnHand * i.Part.UnitPrice);

        var lowStockItems = inventoryItems
            .Where(i => i.QuantityOnHand < i.MinLevel)
            .OrderBy(i => i.QuantityOnHand)
            .Take(10)
            .Select(i => new InventoryStatisticItemDto(
                PartId: i.PartId,
                PartName: i.Part.Name,
                QuantityOnHand: i.QuantityOnHand,
                ReservedQuantity: i.ReservedQuantity,
                MinLevel: i.MinLevel,
                IsBelowMinimum: i.QuantityOnHand < i.MinLevel
            ))
            .ToList();

        return new InventoryStatisticsDto(
            TotalParts: totalItems,
            PartsInStock: itemsInStock,
            PartsBelowMinimum: itemsBelowMin,
            TotalInventoryValue: totalValue,
            LowStockParts: lowStockItems
        );
    }

    private async Task<CustomerStatisticsDto> GetCustomerStatistics(CancellationToken cancellationToken)
    {
        var customers = await dbContext.Customers
            .Where(c => !c.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalCustomers = customers.Count;
        
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1);
        var newCustomersThisMonth = customers.Count(c => c.CreatedAt >= monthStart);

        var bookings = await dbContext.Bookings
            .Where(b => !b.IsDeleted)
            .ToListAsync(cancellationToken);

        var activeCustomers = bookings.Select(b => b.CustomerId).Distinct().Count();
        var totalBookings = bookings.Count;
        var completedBookings = bookings.Where(b => b.Status == BookingStatus.Completed).ToList();
        var averageBookingValue = completedBookings.Any() 
            ? completedBookings.Average(b => b.TotalEstimate)
            : 0;

        var retentionRate = totalCustomers > 0 
            ? (decimal)activeCustomers / totalCustomers * 100 
            : 0;

        var averageLifetimeValue = totalCustomers > 0 
            ? bookings.Sum(b => b.TotalEstimate) / totalCustomers 
            : 0;

        return new CustomerStatisticsDto(
            TotalCustomers: totalCustomers,
            ActiveCustomers: activeCustomers,
            NewCustomersThisMonth: newCustomersThisMonth,
            CustomerRetentionRate: retentionRate,
            AverageCustomerLifetimeValue: averageLifetimeValue,
            TotalBookings: totalBookings,
            AverageBookingValue: (decimal)averageBookingValue
        );
    }

    private async Task<EmployeeStatisticsDto> GetEmployeeStatistics(CancellationToken cancellationToken)
    {
        var employees = await dbContext.Employees
            .Where(e => !e.IsDeleted)
            .ToListAsync(cancellationToken);

        var totalEmployees = employees.Count;
        var activeEmployees = employees.Count(e => e.IsActive);

        var serviceOrders = await dbContext.ServiceOrders
            .Where(so => !so.IsDeleted && so.Status == ServiceOrderStatus.Completed)
            .Include(so => so.WorkItems)
            .ToListAsync(cancellationToken);

        var totalCompleted = serviceOrders.Count;
        var totalLaborHours = serviceOrders.SelectMany(so => so.WorkItems)
            .Sum(w => w.LaborHours);

        var employeeStats = new Dictionary<Guid, (int JobsCompleted, decimal LaborHours)>();
        
        foreach (var order in serviceOrders)
        {
            if (order.MechanicId.HasValue)
            {
                var hours = order.WorkItems.Sum(w => w.LaborHours);
                if (!employeeStats.ContainsKey(order.MechanicId.Value))
                {
                    employeeStats[order.MechanicId.Value] = (0, 0);
                }
                var current = employeeStats[order.MechanicId.Value];
                employeeStats[order.MechanicId.Value] = (current.JobsCompleted + 1, current.LaborHours + hours);
            }
        }

        var topPerformers = employeeStats
            .Join(employees, kvp => kvp.Key, e => e.Id, (kvp, e) => new
            {
                Employee = e,
                Stats = kvp.Value
            })
            .OrderByDescending(x => x.Stats.JobsCompleted)
            .Take(5)
            .Select(x => new EmployeeStatisticItemDto(
                EmployeeId: x.Employee.Id,
                EmployeeName: x.Employee.FullName,
                CompletedJobs: x.Stats.JobsCompleted,
                TotalLaborHours: x.Stats.LaborHours,
                AverageJobsPerDay: x.Stats.JobsCompleted > 0 
                    ? (decimal)x.Stats.JobsCompleted / ((DateTime.UtcNow - x.Employee.CreatedAt).Days + 1)
                    : 0,
                AverageJobValue: x.Stats.JobsCompleted > 0 
                    ? serviceOrders.Where(so => so.MechanicId == x.Employee.Id).Sum(so => so.EstimatedTotalCost) / x.Stats.JobsCompleted
                    : 0
            ))
            .ToList();

        var avgJobsPerEmployee = totalEmployees > 0 ? (decimal)totalCompleted / totalEmployees : 0;

        return new EmployeeStatisticsDto(
            TotalEmployees: totalEmployees,
            ActiveEmployees: activeEmployees,
            TotalJobsCompleted: totalCompleted,
            AverageJobsPerEmployee: avgJobsPerEmployee,
            TotalTeamLaborHours: totalLaborHours,
            TopPerformers: topPerformers
        );
    }
}
