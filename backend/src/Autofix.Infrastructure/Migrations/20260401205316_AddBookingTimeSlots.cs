using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autofix.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingTimeSlots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "booking_time_slot_id",
                table: "bookings",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "booking_time_slots",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    start_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    label = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_booking_time_slots", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_bookings_booking_time_slot_id",
                table: "bookings",
                column: "booking_time_slot_id",
                unique: true,
                filter: "\"booking_time_slot_id\" IS NOT NULL AND \"is_deleted\" = false AND \"status\" <> 3");

            migrationBuilder.CreateIndex(
                name: "ix_booking_time_slots_start_at",
                table: "booking_time_slots",
                column: "start_at",
                unique: true,
                filter: "\"is_deleted\" = false");

            migrationBuilder.AddForeignKey(
                name: "fk_bookings_booking_time_slots_booking_time_slot_id",
                table: "bookings",
                column: "booking_time_slot_id",
                principalTable: "booking_time_slots",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_bookings_booking_time_slots_booking_time_slot_id",
                table: "bookings");

            migrationBuilder.DropTable(
                name: "booking_time_slots");

            migrationBuilder.DropIndex(
                name: "ix_bookings_booking_time_slot_id",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "booking_time_slot_id",
                table: "bookings");
        }
    }
}
