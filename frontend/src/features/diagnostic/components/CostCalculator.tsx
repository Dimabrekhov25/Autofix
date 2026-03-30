import type { CostBreakdown } from '../types/vehicle'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { Button } from '../../../shared/ui/Button'

interface CostCalculatorProps {
  breakdown: CostBreakdown
}

export function CostCalculator({ breakdown }: CostCalculatorProps) {
  const laborTotal = breakdown.laborRate * breakdown.laborHours

  return (
    <div className="bg-on-surface text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
      {/* Abstract Design Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full -ml-12 -mb-12 blur-2xl" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-label font-bold uppercase tracking-widest text-surface-variant">
            Estimated Repair Cost
          </span>
          <span className="bg-primary/20 text-primary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter">
            LIVE CALCULATOR
          </span>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-sm opacity-80">
            <span>Parts Total</span>
            <span>${breakdown.partsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm opacity-80">
            <span>
              Labor ({breakdown.laborHours} hrs @ ${breakdown.laborRate}/hr)
            </span>
            <span>${laborTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm opacity-80">
            <span>Diagnostic Fee</span>
            <span>${breakdown.diagnosticFee.toFixed(2)}</span>
          </div>
          <div className="h-[1px] bg-white/10 my-4" />
          <div className="flex justify-between items-end">
            <span className="text-lg font-headline font-bold">Grand Total</span>
            <span className="text-4xl font-headline font-black text-primary-fixed tracking-tighter">
              ${breakdown.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          tone="ghost"
          className="w-full !bg-primary-fixed !text-on-primary-fixed py-4 rounded-xl font-headline font-extrabold text-lg flex items-center justify-center gap-3 hover:!bg-primary-fixed-dim transition-colors shadow-xl shadow-primary/20"
        >
          Finalize Diagnostic
          <MaterialIcon name="arrow_forward" />
        </Button>
      </div>
    </div>
  )
}
