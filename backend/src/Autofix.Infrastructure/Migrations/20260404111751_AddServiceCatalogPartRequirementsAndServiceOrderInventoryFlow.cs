using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autofix.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceCatalogPartRequirementsAndServiceOrderInventoryFlow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_service_orders_booking_id",
                table: "service_orders");

            migrationBuilder.DropIndex(
                name: "ix_inventory_items_part_id",
                table: "inventory_items");

            migrationBuilder.CreateTable(
                name: "service_catalog_part_requirements",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_catalog_item_id = table.Column<Guid>(type: "uuid", nullable: false),
                    part_id = table.Column<Guid>(type: "uuid", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_service_catalog_part_requirements", x => x.id);
                    table.ForeignKey(
                        name: "fk_service_catalog_part_requirements_parts_part_id",
                        column: x => x.part_id,
                        principalTable: "parts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_service_catalog_part_requirements_service_catalog_items_ser",
                        column: x => x.service_catalog_item_id,
                        principalTable: "service_catalog_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_service_orders_booking_id",
                table: "service_orders",
                column: "booking_id",
                unique: true,
                filter: "\"is_deleted\" = false");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_items_part_id",
                table: "inventory_items",
                column: "part_id",
                unique: true,
                filter: "\"is_deleted\" = false");

            migrationBuilder.CreateIndex(
                name: "ix_service_catalog_part_requirements_part_id",
                table: "service_catalog_part_requirements",
                column: "part_id");

            migrationBuilder.CreateIndex(
                name: "ix_service_catalog_part_requirements_service_catalog_item_id_p",
                table: "service_catalog_part_requirements",
                columns: new[] { "service_catalog_item_id", "part_id" },
                unique: true,
                filter: "\"is_deleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "service_catalog_part_requirements");

            migrationBuilder.DropIndex(
                name: "ix_service_orders_booking_id",
                table: "service_orders");

            migrationBuilder.DropIndex(
                name: "ix_inventory_items_part_id",
                table: "inventory_items");

            migrationBuilder.CreateIndex(
                name: "ix_service_orders_booking_id",
                table: "service_orders",
                column: "booking_id");

            migrationBuilder.CreateIndex(
                name: "ix_inventory_items_part_id",
                table: "inventory_items",
                column: "part_id");
        }
    }
}
