import type { VehicleDiagnosticData } from '../types/vehicle'

export const mockVehicleDiagnostic: VehicleDiagnosticData = {
  vehicle: {
    id: 'veh-001',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    trim: 'Performance Dual Motor',
    color: 'Pearl White Multi-Coat',
    plateNumber: 'ABC-1234',
    vin: '5YJ3E1EB7NF2XXXXX',
    odometer: 32481,
    odometerUnit: 'mi',
    batteryHealth: 94,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6mndl1j5SBlVKBBzyeN5gASfjo7VKis6MCVxW4T2aPrvYs4k5jOwmN-34ml-L1b4HTSCWpclT7nAK0lNvCVDfuq6YtFMdz4g4zuHUmJ4w1QmI4yfaIOJQ9aILIuseztOkvLIDRiV7BgW-huA-zp-Tqx7BEegrmkvfxlgTAtPgLGDIEqg8YiJXMAZrAp0iHbTw90-2c2N-JhJqkezjLsEZ9TtdkEffFvhf3pluuhyU-WF0b-kJzN4V_OazzuHNs8SAFZ2vKacr1Q4z',
  },
  serviceHistory: [
    {
      id: 'srv-001',
      date: '2023-10-12',
      category: 'maintenance',
      title: 'Tire Rotation & Alignment',
      description: 'Four-wheel precision alignment and pressure calibration.',
    },
    {
      id: 'srv-002',
      date: '2023-05-05',
      category: 'routine',
      title: 'Cabin Air Filter Replacement',
      description: 'HEPA filter upgrade installed. HVAC system sanitized.',
    },
    {
      id: 'srv-003',
      date: '2023-01-19',
      category: 'repair',
      title: 'Brake Fluid Flush',
      description: 'Moisture content exceed 3%. Complete hydraulic flush.',
    },
  ],
  issues: [
    {
      id: 'issue-001',
      priority: 'high',
      title: 'Front Brake Pad Wear',
      description: 'Sensor triggered: 2.5mm remaining on inner pads.',
      cost: 245.0,
      laborHours: 1.5,
      parts: [
        {
          id: 'part-001',
          name: 'Performance Ceramic Pads',
          inStock: true,
        },
      ],
      hasPartsAssigned: true,
    },
    {
      id: 'issue-002',
      priority: 'medium',
      title: 'Coolant System Pressure',
      description: 'Slight pressure variance detected during high-load cycle.',
      cost: 112.5,
      laborHours: 2.0,
      hasPartsAssigned: false,
    },
    {
      id: 'issue-003',
      priority: 'resolved',
      title: 'TPMS Sensor Calibration',
      description: 'Tire pressure monitoring system recalibrated.',
      cost: 45.0,
      laborHours: 0.5,
    },
  ],
  costBreakdown: {
    partsTotal: 185.0,
    laborRate: 60,
    laborHours: 3.5,
    diagnosticFee: 7.5,
    grandTotal: 402.5,
  },
}
