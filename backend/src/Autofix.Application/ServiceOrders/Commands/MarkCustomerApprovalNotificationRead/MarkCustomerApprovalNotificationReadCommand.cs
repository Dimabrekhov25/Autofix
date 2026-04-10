using Autofix.Application.ServiceOrders.Dtos;
using MediatR;

namespace Autofix.Application.ServiceOrders.Commands.MarkCustomerApprovalNotificationRead;

public sealed record MarkCustomerApprovalNotificationReadCommand(Guid ServiceOrderId)
    : IRequest<ServiceOrderApprovalNotificationDto?>;
