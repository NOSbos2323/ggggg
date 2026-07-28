import React from "react";
import { Cpu, ShieldCheck, ShieldAlert, Sparkles, FileText, Activity } from "lucide-react";

interface GoogleSystemsCheckProps {
  spamDetails: {
    spamBrainRisk: string;
    cloakingDetected: boolean;
    scriptRedirects: boolean;
  };
  contentDetails: {
    helpfulContentStatus: string;
    wordCount: number;
    title: string;
    metaDescription: string;
  };
  renderDetails: {
    ttfbMs: number;
    textToCodeRatio: string;
    scriptCount: number;
    wrsEfficiency: string;
  };
}

export const GoogleSystemsCheckView: React.FC<GoogleSystemsCheckProps> = ({
  spamDetails,
  contentDetails,
  renderDetails
}) => {
  const getRiskBadge = (risk: string) => {
    if (risk.includes("منخفض")) {
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
    if (risk.includes("متوسط")) {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }
    return "bg-rose-500/20 text-rose-300 border-rose-500/40";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 my-6 shadow-xl" dir="rtl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">
            تقييم الخوارزميات وأنظمة جوجل الداخلية (Google Systems Check)
          </h3>
          <p className="text-xs text-slate-400">
            فحص التوافق مع خوارزميات SpamBrain، Helpful Content System، و WRS Rendering Service
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SpamBrain Risk */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                SpamBrain System Risk
              </span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="mb-3">
              <div className="text-xs text-slate-400 mb-1">مستوى خطورة محرك السبام:</div>
              <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-bold ${getRiskBadge(spamDetails.spamBrainRisk)}`}>
                {spamDetails.spamBrainRisk}
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${spamDetails.cloakingDetected ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                <span>فحص Cloaking: {spamDetails.cloakingDetected ? "مكتشف (تحذير)" : "سليم (مطابق)"}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${spamDetails.scriptRedirects ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                <span>توجيه سكريبت JS: {spamDetails.scriptRedirects ? "مكتشف" : "غير موجود"}</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            نظام SpamBrain يحظر النطاقات التي تنفذ Sneaky Redirects أو حشو روابط تلقائي.
          </div>
        </div>

        {/* Helpful Content System */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Helpful Content System
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>

            <div className="mb-3">
              <div className="text-xs text-slate-400 mb-1">حالة جودة المحتوى و E-E-A-T:</div>
              <span className="inline-block px-3 py-1 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-bold">
                {contentDetails.helpfulContentStatus}
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>إجمالي الكلمات: <strong className="text-white">{contentDetails.wordCount} كلمة</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${contentDetails.wordCount >= 300 ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                <span>عمق المحتوى: {contentDetails.wordCount >= 300 ? "عميق ونافع" : "قصير يحتاج إثراء"}</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            يركز النظام على تجربة المستخدم ونوايا البحث لمنع الفهرسة عن Scaled AI Content الضعيف.
          </div>
        </div>

        {/* Web Rendering Service (WRS) */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Rendering & WRS Crawlability
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="mb-3">
              <div className="text-xs text-slate-400 mb-1">كفاءة معالجة الرندر WRS:</div>
              <span className="inline-block px-3 py-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold">
                {renderDetails.wrsEfficiency}
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <span>سرعة الاستجابة TTFB: <strong className="text-white">{renderDetails.ttfbMs} ms</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>نسبة النص للكود: <strong className="text-white">{renderDetails.textToCodeRatio}</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>عدد السكريبتات: <strong className="text-white">{renderDetails.scriptCount} tag</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            تأخير الاستجابة أو الاعتماد الكلي على Client JS يزيد من استهلاك ميزانية الزحف Crawl Budget.
          </div>
        </div>
      </div>
    </div>
  );
};
