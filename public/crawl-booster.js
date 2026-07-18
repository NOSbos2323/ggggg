/**
 * crawl-booster.js
 *
 * Client-side script that FORCES search engine crawlers to discover
 * and fetch /go URLs using multiple 2025-2026 techniques:
 *
 * 1. SPECULATION RULES API
 *    Injects <script type="speculationrules"> that tells the browser
 *    to PRERENDER all /go links on the page. When GoogleBot renders
 *    the page, it sees the prerendered content immediately — no
 *    waiting for JavaScript execution.
 *
 * 2. FETCH PRIORITY HINTS
 *    Adds fetchpriority="high" to all /go links — tells the browser
 *    and crawler to prioritize fetching these URLs over other resources.
 *
 * 3. RESOURCE PREFETCH
 *    For each /go link on the page, injects <link rel="prefetch">
 *    so the browser fetches the URL in the background. GoogleBot
 *    sees these prefetch hints and may crawl them faster.
 *
 * 4. LINK DISCOVERY INJECTION
 *    Creates a hidden <noscript> block with all /go URLs as plain
 *    <a> tags — GoogleBot's Phase 1 crawl (raw HTML) discovers them
 *    WITHOUT needing to execute JavaScript.
 *
 * Usage in any page:
 *   <script src="https://anon-domain/crawl-booster.js" defer></script>
 *
 * Or with the live-links-loader:
 *   <script src="https://anon-domain/live-links-loader.js" data-mode="internal" defer></script>
 *   <script src="https://anon-domain/crawl-booster.js" defer></script>
 */
(function () {
  var HUB = 'https://instant-indexing-hub.vercel.app';

  function boost() {
    // === 1. Collect all /go URLs on the page ===
    var goLinks = [];
    var anchors = document.querySelectorAll('a[href*="/go?url="]');
    anchors.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.indexOf('/go?url=') !== -1 && goLinks.indexOf(href) === -1) {
        goLinks.push(href);
      }
    });

    // Also check the hub-links-wrapper
    var wrapper = document.querySelector('.hub-links-wrapper');
    if (wrapper) {
      wrapper.querySelectorAll('a').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (href.indexOf('/go?url=') !== -1 && goLinks.indexOf(href) === -1) {
          goLinks.push(href);
        }
      });
    }

    if (goLinks.length === 0) return;

    // === 2. SPECULATION RULES API — prerender all /go links ===
    // This is the most powerful 2025 technique: the browser starts
    // loading the /go redirect target BEFORE the user clicks.
    // GoogleBot also processes speculationrules in its render phase.
    var existingSpec = document.querySelector('script[type="speculationrules"]');
    if (!existingSpec) {
      var specScript = document.createElement('script');
      specScript.type = 'speculationrules';
      var rules = {
        prefetch: goLinks.slice(0, 10).map(function (url) {
          // Convert relative to absolute for speculation rules
          if (url.charAt(0) === '/') {
            try {
              url = window.location.origin + url;
            } catch (e) {}
          }
          return { urls: [url] };
        }),
      };
      specScript.textContent = JSON.stringify(rules);
      document.head.appendChild(specScript);
    }

    // === 3. FETCH PRIORITY — add fetchpriority="high" to /go links ===
    anchors.forEach(function (a) {
      if (!a.getAttribute('fetchpriority')) {
        a.setAttribute('fetchpriority', 'high');
      }
    });

    // === 4. RESOURCE PREFETCH — inject <link rel="prefetch"> ===
    // Browser fetches each /go URL in background → cached → faster
    // GoogleBot may also follow these prefetch hints
    goLinks.slice(0, 8).forEach(function (url) {
      // Check if already prefetched
      var existing = document.querySelector('link[rel="prefetch"][href="' + CSS.escape(url) + '"]');
      if (!existing) {
        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.setAttribute('fetchpriority', 'low');
        document.head.appendChild(link);
      }
    });

    // === 5. NOSCRIPT FALLBACK — raw HTML links for Phase 1 crawl ===
    // GoogleBot's Phase 1 (raw HTML) doesn't execute JS.
    // This <noscript> block ensures all /go URLs are visible in raw HTML.
    var existingNoscript = document.getElementById('crawl-booster-noscript');
    if (!existingNoscript) {
      var noscript = document.createElement('noscript');
      noscript.id = 'crawl-booster-noscript';
      var linksHtml = goLinks.map(function (url) {
        return '<a href="' + escapeHtml(url) + '">' + escapeHtml(url) + '</a>';
      }).join('<br>');
      noscript.innerHTML = linksHtml;
      document.body.appendChild(noscript);
    }

    // === 6. DYNAMIC SITEMAP PING ===
    // When the page loads, silently ping the HUB to notify that
    // new /go URLs have been rendered on this page.
    // This triggers WebSub + IndexNow for the current page's URLs.
    try {
      fetch(HUB + '/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: goLinks.slice(0, 5) }),
        mode: 'no-cors',
      }).catch(function () {});
    } catch (e) {}
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Run after DOM is ready (after live-links-loader has injected links)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(boost, 500); // Wait for live-links-loader to finish
    });
  } else {
    setTimeout(boost, 500);
  }

  // Re-run on SPA navigations
  var origPush = history.pushState;
  history.pushState = function () {
    var r = origPush.apply(this, arguments);
    setTimeout(boost, 800);
    return r;
  };
  window.addEventListener('popstate', function () {
    setTimeout(boost, 800);
  });
})();
