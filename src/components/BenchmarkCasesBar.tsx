import React from "react";
import { Zap, AlertTriangle, ShieldCheck, Sparkles, AlertOctagon } from "lucide-react";

interface BenchmarkCasesBarProps {
  onSelectCase: (caseId: string) => void;
  activeCaseId?: string;
  isScanning: boolean;
}

export const BenchmarkCasesBar: React.FC<BenchmarkCasesBarProps> = ({
  onSelectCase,
  activeCaseId,
  isScanning
}) => {
  const cases = [
    {
      id: "clean-ecommerce",
      label: "متجر إلكتروني متكامل",
      subLabel: "جاهز للفهرسة (95%)",
      icon: ShieldCheck,
      color: "hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400"
    },
    {
      id: "fatal-noindex",
      label: "عائق قاتل: Meta Noindex",
      subLabel: "مرفوض حتماً (0%)",
      icon: AlertOctagon,
      color: "hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400"
    },
    {
      id: "sneaky-cloaking-tds",
      label: "توجيه مخفي Cloaking / TDS",
      subLabel: "خطورة عالية (20%)",
      icon: AlertTriangle,
      color: "hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400"
    },
    {
      id: "thin-content-canonical-mismatch",
      label: "محتوى ضعيف & K-Mismatch",
      subLabel: "مقبول بشروط (45%)",
      icon: Sparkles,
      color: "hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400"
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 my-6" dir="rtl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-200">
            حالات اختبار معيارية جاهزة للتقييم الفوري (Benchmark Test Suite):
          </h3>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          اضغط لاختبار خوارزميات المحرك فورياً
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cases.map((c) => {
          const Icon = c.icon;
          const isActive = activeCaseId === c.id;

          return (
            <button
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              disabled={isScanning}
              className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 text-xs ${
                isActive
                  ? "bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                  : `bg-slate-800/60 border-slate-700/80 text-slate-300 ${c.color}`
              } disabled:opacity-50`}
            >
              <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-100">{c.label}</div>
                <div className="text-[11px] text-slate-400 font-medium">{c.subLabel}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
