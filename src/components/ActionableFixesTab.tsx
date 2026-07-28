import React, { useState } from "react";
import { Code2, Copy, Check, Terminal, FileCode, Shield, Layers } from "lucide-react";

interface ActionableFixesProps {
  fixes: {
    htmlSnippet: string;
    nginxConf: string;
    netlifyToml: string;
    cloudflareWorker: string;
    robotsTxt: string;
  };
  aiSuggestions?: string;
}

export const ActionableFixesTab: React.FC<ActionableFixesProps> = ({ fixes, aiSuggestions }) => {
  const [activeTab, setActiveTab] = useState<"html" | "nginx" | "netlify" | "worker" | "robots">("html");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabs = [
    { id: "html", label: "HTML Meta & Canonical", icon: FileCode, code: fixes.htmlSnippet, lang: "html" },
    { id: "nginx", label: "Nginx Server Config", icon: Terminal, code: fixes.nginxConf, lang: "nginx" },
    { id: "worker", label: "Cloudflare Edge Worker", icon: Shield, code: fixes.cloudflareWorker, lang: "javascript" },
    { id: "netlify", label: "Netlify (netlify.toml)", icon: Layers, code: fixes.netlifyToml, lang: "toml" },
    { id: "robots", label: "robots.txt القياسي", icon: Code2, code: fixes.robotsTxt, lang: "plaintext" }
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 my-6 shadow-xl" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              خطة الإصلاح الفورية والأكواد المطلوبة (Actionable Fixes & Scripts)
            </h3>
            <p className="text-xs text-slate-400">
              أكواد جاهزة للنسخ المباشر والتطبيق لحل المشاكل وضمان اجتياز معايير الفهرسة
            </p>
          </div>
        </div>
      </div>

      {aiSuggestions && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-6 text-xs text-emerald-200 leading-relaxed">
          <strong className="block font-bold text-emerald-400 mb-1">
            توجيهات نموذج التفكير الاصطناعي (AI Studio Diagnostic Summary):
          </strong>
          {aiSuggestions}
        </div>
      )}

      {/* Tabs list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Viewer Panel */}
      <div className="mt-4 relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden dir-ltr">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-emerald-400 font-semibold">{currentTabObj.lang} snippet</span>
          <button
            onClick={() => handleCopy(currentTabObj.code, currentTabObj.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-bold text-xs"
          >
            {copiedKey === currentTabObj.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-96">
          <code>{currentTabObj.code}</code>
        </pre>
      </div>
    </div>
  );
};
