using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autofix.Infrastructure.Migrations
{
    public partial class RefactorBookingApprovalFlow : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_bookings_booking_time_slot_id",
                table: "bookings");

            migrationBuilder.Sql("""
                UPDATE bookings
                SET status = CASE
                    WHEN status = 3 THEN 5
                    WHEN status = 2 THEN 1
                    ELSE status
                END;
                """);

            migrationBuilder.Sql("""
                UPDATE service_orders
                SET status = CASE
                    WHEN status = 1 THEN 1
                    WHEN status = 2 THEN 1
                    WHEN status = 3 THEN 2
                    WHEN status = 4 THEN 3
                    WHEN status = 5 THEN 4
                    WHEN status = 6 THEN 4
                    ELSE status
                END;
                """);

            migrationBuilder.CreateIndex(
                name: "ix_bookings_booking_time_slot_id",
                table: "bookings",
                column: "booking_time_slot_id",
                unique: true,
                filter: "\"booking_time_slot_id\" IS NOT NULL AND \"is_deleted\" = false AND \"status\" <> 5");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_bookings_booking_time_slot_id",
                table: "bookings");

            migrationBuilder.Sql("""
                UPDATE bookings
                SET status = CASE
                    WHEN status = 5 THEN 3
                    WHEN status IN (2, 3, 4, 6) THEN 2
                    ELSE status
                END;
                """);

            migrationBuilder.Sql("""
                UPDATE service_orders
                SET status = CASE
                    WHEN status = 1 THEN 1
                    WHEN status = 2 THEN 3
                    WHEN status = 3 THEN 4
                    WHEN status = 4 THEN 6
                    WHEN status IN (5, 6) THEN 3
                    ELSE status
                END;
                """);

            migrationBuilder.CreateIndex(
                name: "ix_bookings_booking_time_slot_id",
                table: "bookings",
                column: "booking_time_slot_id",
                unique: true,
                filter: "\"booking_time_slot_id\" IS NOT NULL AND \"is_deleted\" = false AND \"status\" <> 3");
        }
    }
}
