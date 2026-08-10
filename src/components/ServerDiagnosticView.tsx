import React, { useState } from "react";
import { Server, ShieldAlert, CheckCircle, XCircle, ArrowLeftRight, Eye, Code, Globe } from "lucide-react";

interface ServerDiagnosticProps {
  technicalDetails: {
    statusCode: number;
    botStatusCode: number;
    metaRobots: string;
    xRobotsTag: string;
    canonical: string;
    metaRefresh: string;
  };
  contentDetails: {
    title: string;
    metaDescription: string;
    wordCount: number;
    h1Count: number;
    firstH1: string;
    hasSchema: boolean;
  };
  rawHeaders: Record<string, string>;
  botHeaders?: Record<string, string>;
  isLiveFetched?: boolean;
}

export const ServerDiagnosticView: React.FC<ServerDiagnosticProps> = ({
  technicalDetails,
  contentDetails,
  rawHeaders,
  botHeaders,
  isLiveFetched
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "headers" | "botDiff">("overview");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 my-6 shadow-xl" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              تحليل السيرفر والروابط (Server & Edge Diagnostic)
            </h3>
            <p className="text-xs text-slate-400">
              فحص استجابة الخادم الهيدرز وتكافؤ سلوك البوت مقارنة بالمتصفح العادي
            </p>
          </div>
        </div>

        {/* Diagnostic Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "overview" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            نظرة تقنية
          </button>
          <button
            onClick={() => setActiveTab("botDiff")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "botDiff" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            مقارنة البوت (Googlebot Diff)
          </button>
          <button
            onClick={() => setActiveTab("headers")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "headers" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            روابط و Raw Headers
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Status Code */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 font-medium">كود الاستجابة (Status Code)</div>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-black ${technicalDetails.statusCode === 200 ? "text-emerald-400" : "text-rose-400"}`}>
                HTTP {technicalDetails.statusCode}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${technicalDetails.statusCode === 200 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                {technicalDetails.statusCode === 200 ? "استجابة قياسية 200 OK" : "خطأ أو إعادة توجيه"}
              </span>
            </div>
          </div>

          {/* Canonical Tag */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 font-medium">الرابط القياسي (Canonical URL)</div>
            <div className="text-xs font-mono text-slate-200 truncate" title={technicalDetails.canonical || "مفقود"}>
              {technicalDetails.canonical || <span className="text-amber-400 font-sans">غير محدد (Missing Canonical)</span>}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              {technicalDetails.canonical ? "موثق في كود <head>" : "قد يسبب محتوى مكرر دون اختيار النسخة المفضلة"}
            </div>
          </div>

          {/* Meta Robots */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 font-medium">وسم Meta Robots</div>
            <div className="text-sm font-bold text-slate-200">
              {technicalDetails.metaRobots || "افتراضي (index, follow)"}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              {/noindex/i.test(technicalDetails.metaRobots) ? (
                <span className="text-rose-400 font-bold">حظر فعال noindex</span>
              ) : (
                <span className="text-emerald-400 font-semibold">مسموح بالفهرسة</span>
              )}
            </div>
          </div>

          {/* X-Robots-Tag */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 font-medium">X-Robots-Tag (Header)</div>
            <div className="text-sm font-bold text-slate-200">
              {technicalDetails.xRobotsTag || "غير موجود في الهيدر"}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              {/noindex/i.test(technicalDetails.xRobotsTag) ? (
                <span className="text-rose-400 font-bold">محظور في HTTP Header</span>
              ) : (
                "لم يتم العثور على تقييد من السيرفر"
              )}
            </div>
          </div>

          {/* Title Tag */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 font-medium">عنوان الصفحة & Title Tag</div>
            <div className="text-xs text-slate-200 font-bold line-clamp-1" title={contentDetails.title}>
              {contentDetails.title || <span className="text-rose-400">عنصر &lt;title&gt; مفقود!</span>}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              الطول: {contentDetails.title.length} حرف
            </div>
          </div>

          {/* Schema.org */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1 font-medium">البيانات المنظمة Schema.org</div>
            <div className="flex items-center gap-2">
              {contentDetails.hasSchema ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">مكتشفة (Structured Data JSON-LD)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">غير موجودة</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "botDiff" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-white text-sm">
                اختبار سلوك Googlebot مقارنة بالمتصفح العادي (Cloaking / TDS Detector)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-bold text-blue-400 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>استجابة المتصفح العادي (Standard User-Agent):</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>Status Code: <span className="font-mono text-white">{technicalDetails.statusCode}</span></div>
                  <div>عدد الكلمات: <span className="font-mono text-white">{contentDetails.wordCount} كلمة</span></div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>استجابة زاحف جوجل (Googlebot User-Agent):</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>Status Code: <span className="font-mono text-white">{technicalDetails.botStatusCode}</span></div>
                  <div>حالة التطابق: <span className="font-semibold text-emerald-400">متطابق وبدون حظر أو إعادة توجيه مخفية</span></div>
                </div>
              </div>
            </div>

            {technicalDetails.statusCode !== technicalDetails.botStatusCode && (
              <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>تحذير: تم اكتشاف اختلال بين استجابة البوت والمتصفح. قد يصنف السيرفر تحت طائلة الخداع Sneaky Redirects / Cloaking.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "headers" && (
        <div className="space-y-3 text-xs dir-ltr">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-slate-300 max-h-60 overflow-y-auto">
            <div className="text-slate-500 font-bold mb-2 pb-1 border-b border-slate-800 dir-rtl text-right">
              HTTP Response Headers Recieved ({Object.keys(rawHeaders).length} Headers)
            </div>
            {Object.entries(rawHeaders).map(([k, v], i) => (
              <div key={i} className="py-0.5 flex gap-2">
                <span className="text-cyan-400 font-bold">{k}:</span>
                <span className="text-slate-200 break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
