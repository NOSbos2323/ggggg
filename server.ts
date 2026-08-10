import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Helper function to lazy initialize Gemini AI
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

interface AuditRequest {
  url?: string;
  rawHtml?: string;
  customHeaders?: Record<string, string>;
  options?: {
    simulateGooglebot?: boolean;
    deepAiAnalysis?: boolean;
  };
}

// Benchmark Cases for quick testing
const BENCHMARK_CASES = [
  {
    id: "clean-ecommerce",
    name: "صفحة منتج متجانسة وجاهزة للفهرسة (Clean E-Commerce)",
    description: "صفحة متكاملة تحتوي على Title, Description, Canonical ذاتي, Schema.org, ومحتوى مفصل بدون أي حظر.",
    url: "https://example.com/product/laptop-pro-15",
    rawHtml: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>حاسوب محمول برو 15 - أفضل المواصفات وأقل الأسعار</title>
  <meta name="description" content="اشترِ حاسوب برو 15 بخصم حصري. يحتوي على معالج M3 وذاكرة 16GB وشاشة Retina متميزة. شحن سريع وضمان لمدة سنتين.">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="googlebot" content="index, follow">
  <link rel="canonical" href="https://example.com/product/laptop-pro-15">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Laptop Pro 15",
    "image": "https://example.com/images/laptop.jpg",
    "description": "حاسوب محمول فائق الأداء للعمال والمطورين.",
    "brand": { "@type": "Brand", "name": "TechPro" }
  }
  </script>
</head>
<body>
  <header><h1>حاسوب محمول برو 15 - الموديل الجديد 2026</h1></header>
  <main>
    <p>يقدم الحاسوب المحمول الجديد أداءً غير مسبوق للمصممين والمبرمجين بفضل الشريحة المبتكرة وسرعة نقل البيانات العالية.</p>
    <h2>المواصفات التقنية الكاملة</h2>
    <ul>
      <li>المعالج: 10 النوى الجيل الحديث</li>
      <li>الذاكرة العشوائية: 16 جيجابايت DDR5</li>
      <li>التخزين: 512 جيجابايت NVMe SSD</li>
    </ul>
    <h2>آراء العملاء والتقييمات</h2>
    <p>تقييم 4.8/5 بناءً على 140 مراجعة حقيقية من مشترين معتمدين.</p>
  </main>
</body>
</html>`,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow",
      "server": "nginx/1.24.0"
    },
    statusCode: 200,
    ttfbMs: 120
  },
  {
    id: "valid-job-posting",
    name: "JobPosting صالح وجاهز للفهرسة",
    description: "اختبار Schema.org من نوع JobPosting مع بيانات وظيفة متسقة وCanonical ذاتي.",
    url: "https://example.com/jobs/seo-technical-auditor",
    rawHtml: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مدقق SEO تقني - وظيفة بدوام كامل</title>
  <meta name="description" content="وظيفة مدقق SEO تقني لتحليل الأداء والفهرسة وتحسين ظهور المواقع.">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="https://example.com/jobs/seo-technical-auditor">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "مدقق SEO تقني",
    "description": "نبحث عن مختص لتحليل قابلية الزحف والفهرسة وتحسين الأداء التقني للمواقع.",
    "datePosted": "2026-01-15",
    "validThrough": "2026-12-31",
    "employmentType": "FULL_TIME",
    "hiringOrganization": { "@type": "Organization", "name": "Indexora SEO", "sameAs": "https://indexora-seo.vercel.app/" },
    "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressCountry": "AE", "addressLocality": "Abu Dhabi" } },
    "baseSalary": { "@type": "MonetaryAmount", "currency": "AED", "value": { "@type": "QuantitativeValue", "minValue": 10000, "maxValue": 16000, "unitText": "MONTH" } }
  }
  </script>
</head>
<body><main><h1>مدقق SEO تقني</h1><p>حلّل بنية المواقع وبياناتها المنظمة وأداء صفحاتها.</p><h2>المهام والمسؤوليات</h2><p>تدقيق الفهرسة، مراجعة البيانات المنظمة، وكتابة تقارير قابلة للتنفيذ.</p></main></body>
</html>`,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "index, follow" },
    statusCode: 200,
    ttfbMs: 140
  },
  {
    id: "fatal-noindex",
    name: "عائق قاتل: وسم Meta Noindex (Fatal Blocker)",
    description: "صفحة ممتازة من حيث المحتوى لكن تم حظرها بـ meta noindex في الهيدر، مما يحول النتيجة إلى 0% فوراً.",
    url: "https://example.com/blog/hidden-article",
    rawHtml: `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>دليل تسريع المواقع وإدارتها</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="googlebot" content="noindex">
  <link rel="canonical" href="https://example.com/blog/hidden-article">
</head>
<body>
  <h1>مقالة متعمقة حول أداء السيرفرات</h1>
  <p>هذا النص يحتوي على تفاصيل ممتازة ولكن صفحة الوسوم تمنع محركات البحث من الفهرسة نهائياً.</p>
</body>
</html>`,
    headers: {
      "content-type": "text/html",
      "x-robots-tag": "noindex, nofollow"
    },
    statusCode: 200,
    ttfbMs: 180
  },
  {
    id: "sneaky-cloaking-tds",
    name: "كشف سبام وتوجيه مخفي Cloaking & TDS Redirect",
    description: "صفحة تعرض محتوى مقالي لبوت جوجل، لكنها تقوم بإعادة توجيه الزائر العادي أو تغيير الاستجابة إلى صفحة إعلانات.",
    url: "https://example.com/landing/free-download",
    isCloakedExample: true,
    userHtml: `<!DOCTYPE html>
<html>
<head><title>Claim Your Free Prize</title><meta http-equiv="refresh" content="0;url=https://spam-offer.com/win"></head>
<body><script>window.location.href="https://spam-offer.com/win";</script></body>
</html>`,
    botHtml: `<!DOCTYPE html>
<html>
<head><title>Comprehensive Tech Guide 2026</title><link rel="canonical" href="https://example.com/landing/free-download"></head>
<body><h1>Informational Tech Article for Search Engines</h1><p>Detailed safe content here...</p></body>
</html>`,
    headers: { "content-type": "text/html" },
    statusCode: 200,
    ttfbMs: 450
  },
  {
    id: "thin-content-canonical-mismatch",
    name: "محتوى ضعيف ومع معارضة الكانونيكال (Canonical Mismatch)",
    description: "محتوى أقل من 50 كلمة ومزود برابط كانونيكال يشير لموقع مختلف تماماً.",
    url: "https://example.com/news/short-update",
    rawHtml: `<!DOCTYPE html>
<html>
<head>
  <title>خبر سريع</title>
  <link rel="canonical" href="https://external-domain.net/main-story">
</head>
<body>
  <h1>عنوان قصير جداً</h1>
  <p>خبر من جملة واحدة فقط.</p>
</body>
</html>`,
    headers: { "content-type": "text/html" },
    statusCode: 200,
    ttfbMs: 250
  }
];

// Helper to inspect HTML string
function parseHtmlMetrics(html: string, url: string = "") {
  const metaRobotsMatch = html.match(/<meta\s+name=["'](robots|googlebot)["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+name=["'](robots|googlebot)["']/i);
  const metaRobots = metaRobotsMatch ? metaRobotsMatch[1] ? metaRobotsMatch[2] : metaRobotsMatch[1] : "";

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
    html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : "";

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : "";

  const metaRefreshMatch = html.match(/<meta\s+http-equiv=["']refresh["']\s+content=["']([^"']+)["']/i);
  const metaRefresh = metaRefreshMatch ? metaRefreshMatch[1] : "";

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h1Count = h1Match ? h1Match.length : 0;
  const firstH1 = h1Match && h1Match[0] ? h1Match[0].replace(/<[^>]+>/g, '').trim() : "";

  const h2Match = html.match(/<h2[^>]*>/gi);
  const h2Count = h2Match ? h2Match.length : 0;

  const scriptTags = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];

  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const hasSchema = !!(jsonLdMatch && jsonLdMatch.length > 0);

  // Text content extraction
  const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanText ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
  const wordCount = words.length;

  const htmlSize = html.length || 1;
  const textSize = cleanText.length;
  const textToCodeRatio = Math.round((textSize / htmlSize) * 100);

  // Link extraction
  const hrefMatches = html.match(/href=["']([^"']+)["']/gi) || [];
  const totalLinks = hrefMatches.length;

  return {
    metaRobots,
    canonical,
    title,
    metaDescription,
    metaRefresh,
    h1Count,
    firstH1,
    h2Count,
    hasSchema,
    scriptCount: scriptTags.length,
    wordCount,
    textToCodeRatio,
    totalLinks,
    cleanTextPreview: cleanText.slice(0, 300)
  };
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/benchmark-cases", (req, res) => {
  res.json({ cases: BENCHMARK_CASES });
});

app.post("/api/audit", async (req, res) => {
  try {
    const { url, rawHtml, customHeaders = {}, options = {} } = req.body as AuditRequest;

    let targetUrl = url ? url.trim() : "https://example.com/audit-page";
    if (targetUrl && !targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    let userResponseStatus = 200;
    let userHeaders: Record<string, string> = { "content-type": "text/html; charset=utf-8" };
    let userHtmlContent = "";
    let botResponseStatus = 200;
    let botHeaders: Record<string, string> = {};
    let botHtmlContent = "";
    let ttfbMs = 150;
    let isLiveFetched = false;
    let fetchError: string | null = null;

    // Check benchmark case shortcut
    const benchmarkFound = BENCHMARK_CASES.find(c => c.url.toLowerCase() === targetUrl.toLowerCase());

    if (benchmarkFound) {
      userResponseStatus = benchmarkFound.statusCode;
      userHeaders = benchmarkFound.headers;
      ttfbMs = benchmarkFound.ttfbMs;

      if (benchmarkFound.isCloakedExample) {
        userHtmlContent = benchmarkFound.userHtml || "";
        botHtmlContent = benchmarkFound.botHtml || "";
        botResponseStatus = 200;
      } else {
        userHtmlContent = benchmarkFound.rawHtml || "";
        botHtmlContent = benchmarkFound.rawHtml || "";
        botResponseStatus = benchmarkFound.statusCode;
      }
    } else if (rawHtml && rawHtml.trim().length > 0) {
      // User provided raw HTML snippet directly
      userHtmlContent = rawHtml;
      botHtmlContent = rawHtml;
      userHeaders = { ...customHeaders, "content-type": "text/html" };
    } else if (targetUrl) {
      // Attempt REAL LIVE FETCH using standard node fetch with different User-Agents
      isLiveFetched = true;
      const startTime = Date.now();

      try {
        const userAgentBrowser = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
        const googlebotUA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

        const controllerUser = new AbortController();
        const timeoutUser = setTimeout(() => controllerUser.abort(), 8000);

        const resUser = await fetch(targetUrl, {
          headers: {
            "User-Agent": userAgentBrowser,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "ar,en-US;q=0.9,en;q=0.8"
          },
          signal: controllerUser.signal,
          redirect: "follow"
        });
        clearTimeout(timeoutUser);

        ttfbMs = Date.now() - startTime;
        userResponseStatus = resUser.status;

        resUser.headers.forEach((val, key) => {
          userHeaders[key.toLowerCase()] = val;
        });

        userHtmlContent = await resUser.text();

        // Second fetch pretending to be Googlebot to test differential handling (Cloaking check)
        const controllerBot = new AbortController();
        const timeoutBot = setTimeout(() => controllerBot.abort(), 8000);

        const resBot = await fetch(targetUrl, {
          headers: {
            "User-Agent": googlebotUA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          signal: controllerBot.signal,
          redirect: "follow"
        });
        clearTimeout(timeoutBot);

        botResponseStatus = resBot.status;
        resBot.headers.forEach((val, key) => {
          botHeaders[key.toLowerCase()] = val;
        });
        botHtmlContent = await resBot.text();

      } catch (err: any) {
        fetchError = err.message || "Failed to establish network connection to target host";
        userResponseStatus = 502;
        botResponseStatus = 502;
      }
    }

    // Combine headers for evaluation
    const xRobotsTag = userHeaders["x-robots-tag"] || botHeaders["x-robots-tag"] || customHeaders["x-robots-tag"] || "";

    // Parse HTML Metrics for user & bot
    const userMetrics = parseHtmlMetrics(userHtmlContent, targetUrl);
    const botMetrics = parseHtmlMetrics(botHtmlContent || userHtmlContent, targetUrl);

    // --- FATAL BLOCKERS EVALUATION ---
    const fatalBlockers: string[] = [];

    // 1. Meta / Header Noindex
    if (/noindex|none/i.test(userMetrics.metaRobots) || /noindex|none/i.test(botMetrics.metaRobots) || /noindex|none/i.test(xRobotsTag)) {
      fatalBlockers.push("وجود وسم حظر الفهرسة (meta noindex أو X-Robots-Tag: noindex) يمنع زواحف جوجل نهائياً من إضافة الصفحة للفهرس.");
    }

    // 2. Status Code 4xx or 5xx
    if (userResponseStatus >= 400 || botResponseStatus >= 400) {
      fatalBlockers.push(`استجابة خادم غير صالحة HTTP ${userResponseStatus} (أو ${botResponseStatus} للبوت). يجب أن يرجع السيرفر كود 200 OK.`);
    }

    // 3. Meta refresh immediate redirect
    if (userMetrics.metaRefresh && /url=/i.test(userMetrics.metaRefresh)) {
      fatalBlockers.push(`اكتشاف إعادة توجيه تلقائية عبر وسم <meta http-equiv="refresh"> إلى رابط آخر (${userMetrics.metaRefresh}).`);
    }

    // 4. Fetch Connection Error
    if (fetchError) {
      fatalBlockers.push(`تعذر الاتصال بالخادم الهدف: ${fetchError}`);
    }

    // --- PILLAR 1: Technical & Edge Integrity (35%) ---
    let sTech = 100;
    const techIssues: string[] = [];

    if (xRobotsTag) {
      if (/noindex|none/i.test(xRobotsTag)) {
        sTech -= 100;
        techIssues.push("X-Robots-Tag يحتوي على حظر noindex.");
      }
    }

    // Canonical Check
    if (!userMetrics.canonical) {
      sTech -= 25;
      techIssues.push("غياب وسم الرابط القياسي (Canonical Tag). يوصى بإنشاء self-referential canonical URL.");
    } else {
      try {
        const canonicalUrlObj = new URL(userMetrics.canonical, targetUrl);
        const targetUrlObj = new URL(targetUrl);

        if (canonicalUrlObj.origin !== targetUrlObj.origin) {
          sTech -= 35;
          techIssues.push(`الـ Canonical يوجه لدومين مختلف (${canonicalUrlObj.origin}). سيؤدي لنقل القوة وإلغاء فهرسة هذه الصفحة لصالح الرابط الخارجي.`);
        } else if (canonicalUrlObj.pathname !== targetUrlObj.pathname) {
          sTech -= 15;
          techIssues.push(`الـ Canonical يشير لمسار آخر في نفس الموقع (${canonicalUrlObj.pathname}).`);
        }
      } catch (e) {
        sTech -= 20;
        techIssues.push("صيغة وسم Canonical غير صالحة.");
      }
    }

    // Status code deduction
    if (userResponseStatus !== 200) {
      sTech -= 50;
      techIssues.push(`كود استجابة غير قياسي: ${userResponseStatus}`);
    }

    sTech = Math.max(0, sTech);

    // --- PILLAR 2: Content & E-E-A-T Quality (30%) ---
    let sContent = 100;
    const contentIssues: string[] = [];

    if (!userMetrics.title) {
      sContent -= 30;
      contentIssues.push("عنصر <title> مفقود في الصفحة.");
    } else if (userMetrics.title.length < 15) {
      sContent -= 15;
      contentIssues.push("عنوان الصفحة <title> قصير جداً (أقل من 15 حرف).");
    } else if (userMetrics.title.length > 70) {
      sContent -= 10;
      contentIssues.push("عنوان الصفحة طويل جداً وقد يتم اقتطاعه في نتائج جوجل.");
    }

    if (!userMetrics.metaDescription) {
      sContent -= 20;
      contentIssues.push("الوصف الميتا <meta name='description'> مفقود.");
    }

    if (userMetrics.h1Count === 0) {
      sContent -= 20;
      contentIssues.push("غياب وسم <h1> الرئيسي للهيكلية.");
    } else if (userMetrics.h1Count > 1) {
      sContent -= 10;
      contentIssues.push("تكرار وسوم <h1> أكثر من مرة واحدة في نفس الصفحة.");
    }

    if (userMetrics.wordCount < 100) {
      sContent -= 45;
      contentIssues.push(`محتوى ضعيف للغاية (Thin Content) - إجمالي الكلمات ${userMetrics.wordCount} كلمة فقط.`);
    } else if (userMetrics.wordCount < 300) {
      sContent -= 20;
      contentIssues.push(`حجم المحتوى قليل (${userMetrics.wordCount} كلمة). يفضل توسيع الشرح والمحتوى النافع.`);
    }

    if (!userMetrics.hasSchema) {
      sContent -= 15;
      contentIssues.push("غياب بيانات Schema.org / Structured Data المدعومة من جوجل.");
    }

    sContent = Math.max(0, sContent);

    // --- PILLAR 3: SpamBrain & Security Risk Flags (20%) ---
    let sSpam = 100;
    const spamIssues: string[] = [];

    // Cloaking detection: compare botHtml vs userHtml length or status
    if (botHtmlContent && userHtmlContent) {
      const lenDiff = Math.abs(botHtmlContent.length - userHtmlContent.length);
      const percentDiff = (lenDiff / Math.max(userHtmlContent.length, 1)) * 100;

      if (botResponseStatus !== userResponseStatus) {
        sSpam -= 60;
        spamIssues.push(`اختلاف كود الاستجابة بين الزائر العادي (${userResponseStatus}) وزاحف Googlebot (${botResponseStatus}). مؤشر قوي على التوجيه الديناميكي TDS / Cloaking.`);
      } else if (percentDiff > 40) {
        sSpam -= 50;
        spamIssues.push(`اختلاف كبير في حجم كود HTML بين البوت والزائر (${Math.round(percentDiff)}%). يشير إلى احتمال تقديم محتوى مختلف لزواحف جوجل (Cloaking).`);
      }
    }

    // Suspicious redirect scripts in client
    if (/<script[^>]*>[\s\S]*?window\.location[\s\S]*?<\/script>/i.test(userHtmlContent)) {
      sSpam -= 30;
      spamIssues.push("تم اكتشاف سكريبت إعادة توجيه تلقائي عبر JS (Client-side redirect)، قد يصنف كـ Sneaky Redirect.");
    }

    sSpam = Math.max(0, sSpam);

    // --- PILLAR 4: Rendering & Crawlability (15%) ---
    let sRender = 100;
    const renderIssues: string[] = [];

    if (ttfbMs > 1000) {
      sRender -= 40;
      renderIssues.push(`بطء شديد في استجابة السيرفر (TTFB = ${ttfbMs}ms). البطء يعيق كفاءة زحف البوت (Crawl Budget).`);
    } else if (ttfbMs > 500) {
      sRender -= 20;
      renderIssues.push(`زمن استجابة الخادم متواضع (TTFB = ${ttfbMs}ms).`);
    }

    if (userMetrics.textToCodeRatio < 10) {
      sRender -= 30;
      renderIssues.push(`نسبة النص إلى الكود منخفضة جداً (${userMetrics.textToCodeRatio}%). تعتمد الصفحة على برمجيات ثقيلة أو HTML مفرط مقارنة بالنص الفعلي.`);
    }

    if (userMetrics.scriptCount > 15) {
      sRender -= 15;
      renderIssues.push(`عدد السكريبتات مرتفع (${userMetrics.scriptCount} script tags)، مما يزيد عبء معالجة الرندر WRS على زواحف جوجل.`);
    }

    sRender = Math.max(0, sRender);

    // --- CALCULATE FINAL SCORE ---
    let rawScore = Math.round((0.35 * sTech) + (0.30 * sContent) + (0.20 * sSpam) + (0.15 * sRender));

    // Fatal blocker override
    let finalScore = rawScore;
    if (fatalBlockers.length > 0) {
      finalScore = 0;
    }

    // Determine Status
    let statusCategory = "جاهز للفهرسة";
    let statusColor = "emerald"; // CSS key

    if (finalScore === 0) {
      statusCategory = "مرفوض حتماً (Fatal Blocker)";
      statusColor = "red";
    } else if (finalScore < 50) {
      statusCategory = "خطورة عالية (High Risk)";
      statusColor = "orange";
    } else if (finalScore < 80) {
      statusCategory = "مقبول بشروط (Acceptable with Conditions)";
      statusColor = "amber";
    }

    // --- GEMINI AI DEEP AUDIT FOR ACTIONABLE CODE FIXES ---
    let aiSuggestions = "";
    let generatedFixes = {
      htmlSnippet: "",
      nginxConf: "",
      vercelJson: "",
      cloudflareWorker: "",
      robotsTxt: ""
    };

    const gemini = getGeminiClient();

    if (gemini && options.deepAiAnalysis !== false) {
      try {
        const promptText = `أنت الخبير التقني الأكبر لـ Google Search Console ومحركات البحث.
قم بتقديم تحليل واستخراج أكواد برمجية معالجة دقيقة (Actionable Fixes) باللغة العربية للصفحة التالية:
- الرابط: ${targetUrl}
- النتيجة الإجمالية: ${finalScore}% (${statusCategory})
- العوائق القاتلة: ${fatalBlockers.join(" | ") || "لا يوجد"}
- المشاكل التقنية: ${techIssues.join(" | ") || "لا يوجد"}
- مشاكل المحتوى: ${contentIssues.join(" | ") || "لا يوجد"}
- مخاطر السبام: ${spamIssues.join(" | ") || "لا يوجد"}
- وسوم الحالية: Title="${userMetrics.title}", MetaRobots="${userMetrics.metaRobots}", Canonical="${userMetrics.canonical}", WordCount=${userMetrics.wordCount}

قدم إجابة JSON مبسطة بالصيغة التالية فقط بدون أيmarkdown خارجي:
{
  "summary": "نص موجز يشرح التقييم والتوصيات الفورية",
  "htmlFix": "كود الميتا والكانونيكال الصحيح للإدراج في <head>",
  "nginxFix": "توصيف أو إعداد Nginx لحل مشاكل الهيدرز والتوجيه",
  "vercelFix": "إعدادات vercel.json المناسبة للنشر على Vercel",
  "workerFix": "كود Cloudflare Worker لمعالجة X-Robots-Tag والتوجيهات على الـ Edge",
  "robotsFix": "ملف robots.txt القياسي الموصى به"
}`;

        const aiRes = await gemini.models.generateContent({
          model: "gemini-3.6-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                htmlFix: { type: Type.STRING },
                nginxFix: { type: Type.STRING },
                vercelFix: { type: Type.STRING },
                workerFix: { type: Type.STRING },
                robotsFix: { type: Type.STRING }
              },
              required: ["summary", "htmlFix", "nginxFix", "vercelFix", "workerFix", "robotsFix"]
            }
          }
        });

        const textResponse = aiRes.text || "";
        let parsedAi: any = {};
        try {
          parsedAi = JSON.parse(textResponse);
        } catch (pErr) {
          // Fallback parsing if there are unescaped control characters
          const sanitized = textResponse
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => c === '\n' ? '\\n' : c === '\r' ? '\\r' : c === '\t' ? '\\t' : '');
          parsedAi = JSON.parse(sanitized);
        }

        aiSuggestions = parsedAi.summary || "";
        generatedFixes = {
          htmlSnippet: parsedAi.htmlFix || "",
          nginxConf: parsedAi.nginxFix || "",
          vercelJson: parsedAi.vercelFix || "",
          cloudflareWorker: parsedAi.workerFix || "",
          robotsTxt: parsedAi.robotsFix || ""
        };
      } catch (geminiErr) {
        console.warn("Gemini AI Deep Analysis warning:", geminiErr);
      }
    }

    // Default Programmatic Fixes if AI is empty or unavailable
    if (!generatedFixes.htmlSnippet) {
      const canonicalHref = userMetrics.canonical || targetUrl;
      const cleanTitle = userMetrics.title || "عنوان الصفحة الرئيسي المميز والواضح";
      const cleanDesc = userMetrics.metaDescription || "وصف شامل ودقيق لمحتوى الصفحة يوفر قيمة مضافة للمستخدم ومطابق لنية البحث.";

      generatedFixes = {
        htmlSnippet: `<!-- أكواد Meta & Canonical الموصى بها في <head> -->
<title>${cleanTitle}</title>
<meta name="description" content="${cleanDesc}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="googlebot" content="index, follow">
<link rel="canonical" href="${canonicalHref}">
<meta property="og:title" content="${cleanTitle}">
<meta property="og:description" content="${cleanDesc}">
<meta property="og:url" content="${canonicalHref}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${cleanTitle}",
  "url": "${canonicalHref}"
}
</script>`,

        nginxConf: `# إعدادات Nginx لضمان إرجاع 200 OK وتعيين X-Robots-Tag سليم
server {
    listen 80;
    server_name ${targetUrl ? new URL(targetUrl).hostname : 'example.com'};

    location / {
        add_header X-Robots-Tag "index, follow, max-snippet:-1" always;
        add_header X-Content-Type-Options "nosniff" always;
        try_files $uri $uri/ /index.html;
    }
}`,

vercelJson: `{
  "headers": [
    { "source": "/api/(.*)", "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }] },
    { "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }] }
  ],
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`,

        cloudflareWorker: `// Cloudflare Worker: Edge Header & User-Agent Inspector
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)
  
  // Clean up any stray noindex header on edge
  newHeaders.set('X-Robots-Tag', 'index, follow')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}`,

        robotsTxt: `# ملف robots.txt القياسي لجميع المحركات
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${targetUrl ? new URL(targetUrl).origin : 'https://example.com'}/sitemap.xml`
      };
    }

    return res.json({
      auditResult: {
        timestamp: new Date().toISOString(),
        url: targetUrl,
        isLiveFetched,
        overallScore: finalScore,
        rawUnblockedScore: rawScore,
        statusCategory,
        statusColor,
        fatalBlockers,
        pillars: {
          technical: {
            score: sTech,
            weight: 0.35,
            issues: techIssues,
            details: {
              statusCode: userResponseStatus,
              botStatusCode: botResponseStatus,
              metaRobots: userMetrics.metaRobots || "غير محدد (مسموح افتراضياً)",
              xRobotsTag: xRobotsTag || "غير موجود",
              canonical: userMetrics.canonical || "مفقود",
              metaRefresh: userMetrics.metaRefresh || "غير موجود"
            }
          },
          content: {
            score: sContent,
            weight: 0.30,
            issues: contentIssues,
            details: {
              title: userMetrics.title || "مفقود",
              metaDescription: userMetrics.metaDescription || "مفقود",
              wordCount: userMetrics.wordCount,
              h1Count: userMetrics.h1Count,
              firstH1: userMetrics.firstH1,
              h2Count: userMetrics.h2Count,
              hasSchema: userMetrics.hasSchema,
              helpfulContentStatus: sContent >= 75 ? "مطابق لملمح المحتوى النافع" : "تحذير: يتطلب إثراء وتوسيع القيمة"
            }
          },
          spam: {
            score: sSpam,
            weight: 0.20,
            issues: spamIssues,
            details: {
              spamBrainRisk: sSpam >= 80 ? "منخفض جداً" : sSpam >= 50 ? "متوسط" : "مرتفع (تحذير كواشف Cloaking/TDS)",
              cloakingDetected: Math.abs((botHtmlContent?.length || 0) - (userHtmlContent?.length || 0)) > 500,
              scriptRedirects: /window\.location/i.test(userHtmlContent)
            }
          },
          render: {
            score: sRender,
            weight: 0.15,
            issues: renderIssues,
            details: {
              ttfbMs,
              textToCodeRatio: `${userMetrics.textToCodeRatio}%`,
              scriptCount: userMetrics.scriptCount,
              totalLinks: userMetrics.totalLinks,
              wrsEfficiency: sRender >= 70 ? "ممتازة" : "تحتاج تحسين أداء الرندر"
            }
          }
        },
        aiSuggestions,
        actionableFixes: generatedFixes,
        rawHeaders: userHeaders,
        botHeaders
      }
    });

  } catch (error: any) {
    console.error("Audit API Error:", error);
    res.status(500).json({ error: "حدث خطأ غير متوقع أثناء معالجة الفحص", details: error.message });
  }
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`G-IPAE Audit Engine Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
