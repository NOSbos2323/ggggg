import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { BenchmarkCasesBar } from "./BenchmarkCasesBar";
import { AuditScoreCard } from "./AuditScoreCard";
import { FatalBlockersAlert } from "./FatalBlockersAlert";
import { ServerDiagnosticView } from "./ServerDiagnosticView";
import { GoogleSystemsCheckView } from "./GoogleSystemsCheckView";
import { ActionableFixesTab } from "./ActionableFixesTab";
import { Search, Globe, Code2, Sparkles, Loader2, Play, Cpu, CheckCircle2, ShieldCheck } from "lucide-react";

interface AuditResponseData {
  timestamp: string;
  url: string;
  isLiveFetched?: boolean;
  overallScore: number;
  rawUnblockedScore: number;
  statusCategory: string;
  statusColor: string;
  fatalBlockers: string[];
  pillars: {
    technical: {
      score: number;
      weight: number;
      issues: string[];
      details: {
        statusCode: number;
        botStatusCode: number;
        metaRobots: string;
        xRobotsTag: string;
        canonical: string;
        metaRefresh: string;
      };
    };
    content: {
      score: number;
      weight: number;
      issues: string[];
      details: {
        title: string;
        metaDescription: string;
        wordCount: number;
        h1Count: number;
        firstH1: string;
        h2Count: number;
        hasSchema: boolean;
        helpfulContentStatus: string;
      };
    };
    spam: {
      score: number;
      weight: number;
      issues: string[];
      details: {
        spamBrainRisk: string;
        cloakingDetected: boolean;
        scriptRedirects: boolean;
      };
    };
    render: {
      score: number;
      weight: number;
      issues: string[];
      details: {
        ttfbMs: number;
        textToCodeRatio: string;
        scriptCount: number;
        totalLinks: number;
        wrsEfficiency: string;
      };
    };
  };
  aiSuggestions?: string;
  actionableFixes: {
    htmlSnippet: string;
    nginxConf: string;
    netlifyToml: string;
    cloudflareWorker: string;
    robotsTxt: string;
  };
  rawHeaders: Record<string, string>;
  botHeaders?: Record<string, string>;
}

const Home: React.FC = () => {
  const [inputMode, setInputMode] = useState<"url" | "html">("url");
  const [inputUrl, setInputUrl] = useState<string>("https://example.com/product/laptop-pro-15");
  const [rawHtmlInput, setRawHtmlInput] = useState<string>("");
  const [customHeaderXRobots, setCustomHeaderXRobots] = useState<string>("");
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string | undefined>("clean-ecommerce");

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResponseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-run initial benchmark scan on load
  useEffect(() => {
    handleRunAudit("https://example.com/product/laptop-pro-15");
  }, []);

  const handleRunAudit = async (targetUrlOverride?: string) => {
    setIsScanning(true);
    setErrorMsg(null);

    const targetUrl = targetUrlOverride || inputUrl;

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: inputMode === "url" ? targetUrl : undefined,
          rawHtml: inputMode === "html" ? rawHtmlInput : undefined,
          customHeaders: customHeaderXRobots ? { "x-robots-tag": customHeaderXRobots } : undefined,
          options: {
            simulateGooglebot: true,
            deepAiAnalysis: true
          }
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - فشل الاتصال بمحرك التحليل`);
      }

      const data = await res.json();
      if (data.auditResult) {
        setAuditResult(data.auditResult);
      } else {
        throw new Error("لم يتم استقبال مخرجات صالحة من المحرك");
      }
    } catch (err: any) {
      console.error("Audit error:", err);
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء الفحص");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectBenchmark = (caseId: string) => {
    setActiveBenchmarkId(caseId);
    let sampleUrl = "https://example.com/product/laptop-pro-15";

    if (caseId === "fatal-noindex") {
      sampleUrl = "https://example.com/blog/hidden-article";
    } else if (caseId === "sneaky-cloaking-tds") {
      sampleUrl = "https://example.com/landing/free-download";
    } else if (caseId === "thin-content-canonical-mismatch") {
      sampleUrl = "https://example.com/news/short-update";
    }

    setInputMode("url");
    setInputUrl(sampleUrl);
    handleRunAudit(sampleUrl);
  };

  const handleReset = () => {
    setInputUrl("");
    setRawHtmlInput("");
    setAuditResult(null);
    setErrorMsg(null);
    setActiveBenchmarkId(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950" dir="rtl">
      {/* Header */}
      <Header onReset={handleReset} isScanning={isScanning} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام تقييم الفهرسة والتدقيق التقني المعياري (G-IPAE Engine)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            قياس احتمالية قبول الفهرسة في خوارزميات جوجل
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            استخراج النسبة المئوية المباشرة (0% - 100%)، كشف العوائق القاتلة (Fatal Blockers)، تحليل سلوك البوت، وتوفير أكواد الإصلاح الفورية.
          </p>
        </div>

        {/* Input Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          {/* Mode Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
            <button
              onClick={() => setInputMode("url")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === "url"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>فحص رابط حي (Live URL Scan)</span>
            </button>

            <button
              onClick={() => setInputMode("html")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                inputMode === "html"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>فحص كود HTML وهيدرز مباشرة</span>
            </button>
          </div>

          {/* Form Controls */}
          {inputMode === "url" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  رابط الصفحة المستهدفة (Target URL):
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      setActiveBenchmarkId(undefined);
                    }}
                    placeholder="https://yourwebsite.com/page-to-audit"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 pl-32 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors dir-ltr text-left"
                  />
                  <button
                    onClick={() => handleRunAudit()}
                    disabled={isScanning || !inputUrl.trim()}
                    className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 shadow-md"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري الفحص...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>بدء التحليل</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  كود HTML المباشر (Raw Source Code):
                </label>
                <textarea
                  value={rawHtmlInput}
                  onChange={(e) => setRawHtmlInput(e.target.value)}
                  placeholder="<!DOCTYPE html><html><head><title>My Page</title></head><body>...</body></html>"
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors dir-ltr text-left"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    محاكاة هيدر X-Robots-Tag (اختر اختياري):
                  </label>
                  <input
                    type="text"
                    value={customHeaderXRobots}
                    onChange={(e) => setCustomHeaderXRobots(e.target.value)}
                    placeholder="noindex, follow"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 dir-ltr text-left"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => handleRunAudit()}
                    disabled={isScanning || !rawHtmlInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
                    <span>تحليل الكود والهيدرز</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Benchmark Preset Bar */}
          <BenchmarkCasesBar
            onSelectCase={handleSelectBenchmark}
            activeCaseId={activeBenchmarkId}
            isScanning={isScanning}
          />
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-500/50 rounded-2xl p-4 my-6 text-xs text-rose-300 font-semibold flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Audit Results View */}
        {auditResult && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Score Card */}
            <AuditScoreCard
              overallScore={auditResult.overallScore}
              statusCategory={auditResult.statusCategory}
              statusColor={auditResult.statusColor}
              url={auditResult.url}
              pillars={auditResult.pillars}
            />

            {/* 2. Fatal Blockers (If any) */}
            <FatalBlockersAlert blockers={auditResult.fatalBlockers} />

            {/* 3. Server & Edge Diagnostic */}
            <ServerDiagnosticView
              technicalDetails={auditResult.pillars.technical.details}
              contentDetails={auditResult.pillars.content.details}
              rawHeaders={auditResult.rawHeaders}
              botHeaders={auditResult.botHeaders}
              isLiveFetched={auditResult.isLiveFetched}
            />

            {/* 4. Google Systems Check */}
            <GoogleSystemsCheckView
              spamDetails={auditResult.pillars.spam.details}
              contentDetails={auditResult.pillars.content.details}
              renderDetails={auditResult.pillars.render.details}
            />

            {/* 5. Actionable Code Fixes */}
            <ActionableFixesTab
              fixes={auditResult.actionableFixes}
              aiSuggestions={auditResult.aiSuggestions}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>Google Indexing Probability & Technical Audit Engine (G-IPAE) © {new Date().getFullYear()}</p>
        <p className="mt-1 text-[11px] text-slate-600">
          تم التطوير بالاعتماد على خوارزميات جوجل وتوجيهات Search Console و Google Web Rendering Service.
        </p>
      </footer>
    </div>
  );
};

export default Home;
