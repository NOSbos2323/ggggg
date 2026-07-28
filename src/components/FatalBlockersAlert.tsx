import React from "react";
import { AlertOctagon, XCircle, ShieldAlert } from "lucide-react";

interface FatalBlockersAlertProps {
  blockers: string[];
}

export const FatalBlockersAlert: React.FC<FatalBlockersAlertProps> = ({ blockers }) => {
  if (!blockers || blockers.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-red-900/60 to-rose-950/80 border-2 border-rose-500/80 rounded-2xl p-6 my-6 shadow-2xl shadow-rose-950/50" dir="rtl">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/40 text-rose-400 shrink-0">
          <AlertOctagon className="w-8 h-8 animate-bounce" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider">
              عائق قاتل (Fatal Blocker)
            </span>
            <span className="text-xs text-rose-300 font-bold">
              النتيجة الحسابية الإجمالية = 0%
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            تم اكتشاف أسباب مباشرة تحظر الفهرسة تماماً في محرك بحث جوجل:
          </h3>
          <ul className="space-y-2 mt-3">
            {blockers.map((blocker, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-rose-100 bg-rose-950/50 p-2.5 rounded-lg border border-rose-800/50">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{blocker}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-rose-300/80 mt-3 italic">
            * تنبيه المعايرة: وجود أي عائق قاتل يلغي بقية الدرجات الجزئية ويعين احتمالية الفهرسة فوراً عند 0% وفق قواعد Google Inspection.
          </p>
        </div>
      </div>
    </div>
  );
};
