import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, Calculator, ShieldCheck } from "lucide-react";

interface PillarData {
  score: number;
  weight: number;
  issues: string[];
}

interface AuditScoreCardProps {
  overallScore: number;
  statusCategory: string;
  statusColor: string;
  url: string;
  pillars: {
    technical: PillarData;
    content: PillarData;
    spam: PillarData;
    render: PillarData;
  };
}

export const AuditScoreCard: React.FC<AuditScoreCardProps> = ({
  overallScore,
  statusCategory,
  statusColor,
  url,
  pillars
}) => {
  const getBadgeStyle = () => {
    if (overallScore === 0) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/50";
    }
    if (overallScore >= 80) {
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    }
    if (overallScore >= 50) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/50";
    }
    return "bg-orange-500/20 text-orange-300 border-orange-500/50";
  };

  const getGaugeColor = () => {
    if (overallScore === 0) return "#f43f5e"; // rose
    if (overallScore >= 80) return "#10b981"; // emerald
    if (overallScore >= 50) return "#f59e0b"; // amber
    return "#f97316"; // orange
  };

  const pillarItems = [
    {
      title: "البنية التقنية وإشارات الاستجابة (Edge Integrity)",
      weight: "35%",
      score: pillars.technical.score,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      issuesCount: pillars.technical.issues.length
    },
    {
      title: "جودة المحتوى ونوايا البحث (Helpful Content & E-E-A-T)",
      weight: "30%",
      score: pillars.content.score,
      color: "bg-purple-500",
      textColor: "text-purple-400",
      issuesCount: pillars.content.issues.length
    },
    {
      title: "أنماط السبام والمخاطر (SpamBrain & Security Risk)",
      weight: "20%",
      score: pillars.spam.score,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      issuesCount: pillars.spam.issues.length
    },
    {
      title: "قابلية المعالجة والرندر (Rendering & Crawlability)",
      weight: "15%",
      score: pillars.render.score,
      color: "bg-cyan-500",
      textColor: "text-cyan-400",
      issuesCount: pillars.render.issues.length
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl my-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Score Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-l border-slate-800 pb-6 lg:pb-0 lg:pl-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            احتمالية قبول الفهرسة (Indexing Eligibility)
          </span>

          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={getGaugeColor()}
                strokeWidth="10"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-white tracking-tight">
                {overallScore}%
              </span>
              <span className="text-xs text-slate-400 font-semibold mt-1">
                الدرجة الحسابية
              </span>
            </div>
          </div>

          <div className={`mt-3 px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getBadgeStyle()}`}>
            {overallScore >= 80 ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : overallScore >= 50 ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>{statusCategory}</span>
          </div>

          <div className="text-xs text-slate-400 mt-4 text-center break-all max-w-xs">
            الرابط المفحوص: <span className="text-slate-200 font-mono">{url}</span>
          </div>
        </div>

        {/* Right column: Pillars Breakdown & Equation */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">
                معادلة التقييم الخوارزمي والأوزان (Evaluation Pillars)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded">
              Indexing Score Calculation
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono dir-ltr text-center overflow-x-auto">
            Score = (0.35 × S<sub>tech</sub>) + (0.30 × S<sub>content</sub>) + (0.20 × S<sub>spam</sub>) + (0.15 × S<sub>render</sub>)
          </div>

          <div className="space-y-4">
            {pillarItems.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      وزن {item.weight}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    {item.issuesCount > 0 && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {item.issuesCount} ملاحظة
                      </span>
                    )}
                    <span className={`font-black ${item.textColor}`}>{item.score} / 100</span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-700 rounded-full`}
                    style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
