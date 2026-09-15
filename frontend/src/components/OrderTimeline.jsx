import React from 'react';
import { formatDate } from '../utils/formatters';
import { CheckCircle2, Circle, Clock, Truck, Package, ShieldCheck, XCircle, RotateCcw } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'Confirmed', label: 'Order Placed', icon: ShieldCheck },
  { key: 'Processing', label: 'In Atelier Preparation', icon: Package },
  { key: 'Packed', label: 'Bespoke Packed', icon: Package },
  { key: 'Shipped', label: 'Dispatched with Courier', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

export const OrderTimeline = ({ order }) => {
  if (!order) return null;

  const isCancelled = order.orderStatus === 'Cancelled';
  const isReturned = order.orderStatus === 'Returned';

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-gold-700 font-semibold">
            Order Status Tracking
          </span>
          <h3 className="text-lg font-bold text-luxury-950">
            Status: <span className="text-gold-600">{order.orderStatus}</span>
          </h3>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500">Order Reference</p>
          <p className="text-xs font-mono font-bold text-luxury-950">{order.orderNumber}</p>
        </div>
      </div>

      {/* Special State: Cancelled */}
      {isCancelled ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-800">
            <p className="font-bold">This order has been cancelled.</p>
            {order.cancellation?.reason && (
              <p className="mt-1">Reason: {order.cancellation.reason}</p>
            )}
            {order.cancellation?.cancelledAt && (
              <p className="text-[11px] text-red-600 mt-1">
                Cancelled on {formatDate(order.cancellation.cancelledAt)}
              </p>
            )}
          </div>
        </div>
      ) : isReturned ? (
        /* Special State: Returned */
        <div className="p-4 bg-purple-50 border border-purple-200 rounded flex items-start space-x-3">
          <RotateCcw className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-purple-800">
            <p className="font-bold">This order has been returned to the atelier.</p>
            <p className="mt-1">Refund status: {order.returnRequest?.refundStatus || 'Processed'}</p>
          </div>
        </div>
      ) : (
        /* Visual Horizontal / Stepper Tracker */
        <div className="py-4">
          <div className="relative">
            {/* Step Line */}
            <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="hidden sm:block absolute top-1/2 left-0 h-0.5 bg-gold-600 -translate-y-1/2 transition-all duration-500 z-0"
              style={{
                width: `${Math.max(0, Math.min(100, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100))}%`,
              }}
            />

            {/* Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
              {ORDER_STEPS.map((step, index) => {
                const isPassed = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-luxury-950 text-gold-400 ring-4 ring-gold-200/60 shadow-md'
                          : isPassed
                          ? 'bg-gold-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold tracking-wider uppercase mt-2 ${
                        isCurrent
                          ? 'text-luxury-950 font-bold'
                          : isPassed
                          ? 'text-gold-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Timeline Events History */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-3">
            Activity Log
          </h4>
          <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-200">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-gold-600 ring-4 ring-white" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-luxury-950">{event.title}</p>
                  <span className="text-[10px] text-gray-400">{formatDate(event.timestamp)}</span>
                </div>
                {event.description && (
                  <p className="text-gray-600 mt-0.5 text-[11px]">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
