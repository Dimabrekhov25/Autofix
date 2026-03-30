import type { Booking } from '../types/booking'
import type { VehicleDiagnosticData } from '../../diagnostic/types/vehicle'

// Booking 1: Tesla Model 3 - In Service
const teslaModel3Diagnostic: VehicleDiagnosticData = {
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
  ],
  issues: [
    {
      id: 'issue-001',
      priority: 'high',
      title: 'Front Brake Pad Wear',
      description: 'Sensor triggered: 2.5mm remaining on inner pads.',
      cost: 245.0,
      laborHours: 1.5,
      parts: [{ id: 'part-001', name: 'Performance Ceramic Pads', inStock: true }],
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
  ],
  costBreakdown: {
    partsTotal: 185.0,
    laborRate: 60,
    laborHours: 3.5,
    diagnosticFee: 7.5,
    grandTotal: 402.5,
  },
}

// Booking 2: BMW M4 - Completed
const bmwM4Diagnostic: VehicleDiagnosticData = {
  vehicle: {
    id: 'veh-002',
    make: 'BMW',
    model: 'M4',
    year: 2023,
    trim: 'Competition xDrive',
    color: 'Sao Paulo Yellow',
    plateNumber: 'XYZ-5678',
    vin: 'WBS8M9C51P7E12345',
    odometer: 15230,
    odometerUnit: 'mi',
  },
  serviceHistory: [
    {
      id: 'srv-003',
      date: '2024-03-20',
      category: 'maintenance',
      title: 'Oil Change & Inspection',
      description: 'Full synthetic oil replacement and multi-point inspection.',
    },
  ],
  issues: [
    {
      id: 'issue-003',
      priority: 'resolved',
      title: 'Engine Oil Service',
      description: 'Synthetic oil change completed with new filter.',
      cost: 180.0,
      laborHours: 1.0,
    },
  ],
  costBreakdown: {
    partsTotal: 120.0,
    laborRate: 60,
    laborHours: 1.0,
    diagnosticFee: 0,
    grandTotal: 180.0,
  },
}

// Booking 3: Porsche 911 - Confirmed (Upcoming)
const porsche911Diagnostic: VehicleDiagnosticData = {
  vehicle: {
    id: 'veh-003',
    make: 'Porsche',
    model: '911',
    year: 2024,
    trim: 'Carrera GTS',
    color: 'Shark Blue',
    plateNumber: 'POR-9911',
    vin: 'WP0AB2A99PS123456',
    odometer: 8420,
    odometerUnit: 'mi',
  },
  serviceHistory: [
    {
      id: 'srv-004',
      date: '2024-01-15',
      category: 'routine',
      title: 'Pre-Delivery Inspection',
      description: 'New vehicle delivery inspection and setup.',
    },
  ],
  issues: [],
  costBreakdown: {
    partsTotal: 0,
    laborRate: 60,
    laborHours: 0,
    diagnosticFee: 0,
    grandTotal: 0,
  },
}

// Booking 4: Mercedes-Benz AMG GT - Pending
const mercedesAMGDiagnostic: VehicleDiagnosticData = {
  vehicle: {
    id: 'veh-004',
    make: 'Mercedes-Benz',
    model: 'AMG GT',
    year: 2023,
    trim: 'GT 63 S 4MATIC+',
    color: 'Designo Magno Night Black',
    plateNumber: 'AMG-GT63',
    vin: 'WDDYK8EB7PA123456',
    odometer: 12100,
    odometerUnit: 'mi',
  },
  serviceHistory: [],
  issues: [
    {
      id: 'issue-004',
      priority: 'medium',
      title: 'Transmission Fluid Service',
      description: 'Scheduled transmission fluid replacement at 12k miles.',
      cost: 320.0,
      laborHours: 2.5,
      hasPartsAssigned: false,
    },
  ],
  costBreakdown: {
    partsTotal: 180.0,
    laborRate: 60,
    laborHours: 2.5,
    diagnosticFee: 10.0,
    grandTotal: 340.0,
  },
}

export const mockBookings: Booking[] = [
  {
    id: 'booking-001',
    vehicleId: 'veh-001',
    status: 'in-service',
    scheduledDate: '2024-03-30',
    scheduledTime: '09:00 AM',
    estimatedCompletion: 'Today, 4:30 PM',
    diagnosticData: teslaModel3Diagnostic,
    notes: 'Customer requested priority service for brake issue',
    createdAt: '2024-03-28T10:30:00Z',
    updatedAt: '2024-03-30T09:15:00Z',
  },
  {
    id: 'booking-002',
    vehicleId: 'veh-002',
    status: 'completed',
    scheduledDate: '2024-03-20',
    scheduledTime: '02:00 PM',
    diagnosticData: bmwM4Diagnostic,
    notes: 'Routine maintenance completed successfully',
    createdAt: '2024-03-15T14:20:00Z',
    updatedAt: '2024-03-20T16:45:00Z',
  },
  {
    id: 'booking-003',
    vehicleId: 'veh-003',
    status: 'confirmed',
    scheduledDate: '2024-04-05',
    scheduledTime: '10:30 AM',
    diagnosticData: porsche911Diagnostic,
    notes: 'First service appointment - diagnostic scan requested',
    createdAt: '2024-03-29T11:00:00Z',
    updatedAt: '2024-03-29T11:00:00Z',
  },
  {
    id: 'booking-004',
    vehicleId: 'veh-004',
    status: 'pending',
    scheduledDate: '2024-04-12',
    scheduledTime: '01:00 PM',
    diagnosticData: mercedesAMGDiagnostic,
    notes: 'Awaiting customer confirmation for transmission service',
    createdAt: '2024-03-30T09:00:00Z',
    updatedAt: '2024-03-30T09:00:00Z',
  },
]

export function getBookingSummary() {
  return {
    totalBookings: mockBookings.length,
    active: mockBookings.filter((b) => b.status === 'in-service').length,
    completed: mockBookings.filter((b) => b.status === 'completed').length,
    upcoming: mockBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
  }
}

export function getBookingById(id: string) {
  return mockBookings.find((b) => b.id === id)
}
