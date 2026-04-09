using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autofix.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceOrderCustomerApprovalNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "customer_approval_notification_read_at",
                table: "service_orders",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "customer_approved_at",
                table: "service_orders",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "customer_approval_notification_read_at",
                table: "service_orders");

            migrationBuilder.DropColumn(
                name: "customer_approved_at",
                table: "service_orders");
        }
    }
}
