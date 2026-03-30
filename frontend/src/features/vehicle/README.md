# Vehicle Diagnostic Feature

## Overview
A production-ready Vehicle Diagnostic Page that displays comprehensive vehicle information, service history, diagnostic issues, and cost calculations.

## Structure

### Types (`src/features/vehicle/types/vehicle.ts`)
- `VehicleInfo` - Vehicle details (make, model, VIN, odometer, etc.)
- `ServiceRecord` - Service history entries
- `DiagnosticIssue` - Issue with priority, cost, parts, labor
- `CostBreakdown` - Cost calculation breakdown
- `VehicleDiagnosticData` - Complete diagnostic data structure

### Components (`src/features/vehicle/components/`)

#### Layout Components
- **VehicleHeader** - Displays vehicle year/make/model, trim, and plate number
- **VehicleInfoCard** - Reusable info display card (VIN, odometer)
- **VehicleImageSection** - Hero image with battery health overlay

#### Service History
- **ServiceHistory** - Timeline-based service history wrapper
- **ServiceHistoryItem** - Individual service record with category badge

#### Diagnostic Components
- **DiagnosticReport** - Right-side section wrapper with header and "Add Issue" button
- **IssueCard** - Displays individual issue with priority styling:
  - **High Priority** - Red border, urgent attention badge
  - **Medium Priority** - Blue border, maintenance recommendation
  - **Resolved** - Gray/faded appearance
- **CostCalculator** - Bottom calculator card with parts/labor breakdown

### Mock Data (`src/features/vehicle/mock/vehicle-data.ts`)
- Complete mock vehicle diagnostic data
- 3 service records
- 3 issues (high, medium, resolved)
- Cost breakdown with realistic pricing

## Page Implementation

**Location**: `src/pages/vehicle/VehicleDiagnosticPage.tsx`

**Layout**: 2-column responsive layout
- **Left Column**: Vehicle info, service history
- **Right Column**: Diagnostic report, issues list, cost calculator

**Shell**: Uses `DashboardShell` for consistent navigation

## Routing

**Route**: `/diagnostics` (protected)

**Configuration**:
- Added to `APP_ROUTES.diagnostics` in `src/shared/config/routes.ts`
- Protected route requiring authentication
- Integrated into `DashboardShell` sidebar navigation

## Styling

### Design Tokens (from `tailwind.config.ts`)
- **Primary** (cyan/teal): `#006668` - Main brand color, used for high priority
- **Secondary** (orange): `#ab2d00` - Used for urgent issues
- **Tertiary** (blue): `#005bae` - Used for medium priority issues
- **Surface colors**: Various background shades for cards and containers

### Component Patterns
- **Timeline**: Vertical line with circular indicators
- **Priority badges**: Color-coded labels with uppercase text
- **Glass effect**: Blur backdrop for overlays
- **Card elevation**: Consistent shadow-sm and shadow-panel usage

## Features

### ✅ Implemented
- [x] Vehicle information display
- [x] VIN and odometer cards
- [x] Hero image with battery health indicator
- [x] Service history timeline
- [x] Issues list with priority levels
- [x] Cost calculator with live breakdown
- [x] Responsive 2-column layout
- [x] Navigation integration
- [x] TypeScript strict typing
- [x] Mock data for development

### 🔄 Ready for Backend Integration
The implementation is prepared for API integration:

```typescript
// Example: Create a custom hook
export function useVehicleDiagnostic(vehicleId: string) {
  // Fetch from API
  const { data, isLoading, error } = useQuery(...)
  return { data, isLoading, error }
}

// Usage in page:
const { data } = useVehicleDiagnostic(vehicleId)
```

### 🎯 Future Enhancements
- Add issue form/modal
- Service history filtering
- Export diagnostic report (PDF)
- Real-time OBD-II integration
- Cost estimation adjustments
- Parts ordering integration

## Development

### Local Testing
```bash
# Start dev server
npm run dev

# Navigate to: http://localhost:5173/diagnostics
# (Requires authentication - use demo login)
```

### Type Checking
```bash
npm run lint
npx tsc --noEmit
```

### Build
```bash
npm run build
```

## Component Usage Examples

### VehicleHeader
```tsx
<VehicleHeader vehicle={vehicleInfo} />
```

### IssueCard
```tsx
<IssueCard issue={diagnosticIssue} />
```

### CostCalculator
```tsx
<CostCalculator breakdown={costBreakdown} />
```

## Design Consistency
✅ Follows existing project patterns:
- Feature-Sliced Design architecture
- Tailwind CSS design tokens
- Material Icons
- Component composition
- TypeScript strict typing
- Mock data separation
- Protected routing

## Notes
- All components are fully typed with TypeScript
- No inline styles - pure Tailwind CSS
- Reusable components following SRP
- Ready for backend API integration
- Mobile-responsive (stacks on small screens)
- Follows existing dashboard layout patterns
