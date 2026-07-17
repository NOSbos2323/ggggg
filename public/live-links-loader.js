/**
 * live-links-loader.js
 * Standalone, dependency-free script injected into the three sub-projects.
 *
 * USAGE — add this anywhere in your page HTML (in <head> or <body>):
 *
 *   <script
 *     src="https://instant-indexing-hub.vercel.app/live-links-loader.js"
 *     data-limit="8"
 *     data-shuffle="1"
 *     data-mode="internal"
 *     data-container="main"
 *     data-position="append"
 *     defer
 *   ></script>
 *
 * Parameters (via data-* attributes OR query string):
 *   data-limit         Max number of links to inject (default 8)
 *   data-shuffle       "1" = randomize order, "0" = keep weight order (default 1)
 *   data-mode          "internal" (DEFAULT) — natural in-content links with descriptions
 *                     "inline"    — inline <a> tags in a single paragraph (SEO-friendly)
 *                     "buttons"   — visible card grid (UI widget)
 *                     "list"      — simple <ul> list
 *                     "hidden"    — off-screen links (SEO-only, invisible to humans)
 *   data-container     CSS selector for where to inject (default: 'body')
 *   data-position      "append" (default) | "prepend" | "before" | "after"
 *   data-class         CSS class to add to each <a> tag
 *   data-heading       Optional heading text above the injected block
 *                      (default: "روابط ذات صلة")
 *   data-description   "1" (default) = show description, "0" = hide
 *   data-exclude       Comma-separated list of project slugs to EXCLUDE
 *                      (e.g. "uaejobe" — useful so a project doesn't
 *                       inject links to itself)
 *
 * The script:
 *  1. Fetches /api/live-links from the hub (CORS-enabled).
 *  2. Filters out links pointing to the current domain (avoids self-links).
 *  3. Injects links in the chosen mode.
 *  4. Re-injects on SPA navigations (pushState/replaceState/popstate).
 *
 * Author: Instant Indexing Hub
 */
(function () {
  var scriptTag = document.currentScript;
  if (!scriptTag) return;

  var src;
  try {
    src = new URL(scriptTag.src);
  } catch (e) {
    return;
  }
  var HUB = src.origin;

  function getParam(name, defaultValue) {
    return (
      scriptTag.getAttribute('data-' + name) ||
      src.searchParams.get(name) ||
      defaultValue
    );
  }

  var limit = parseInt(getParam('limit', '8'), 10) || 8;
  var shuffle = getParam('shuffle', '1') !== '0';
  var mode = getParam('mode', 'internal');
  var containerSelector = getParam('container', 'body');
  var position = getParam('position', 'append');
  var anchorClass = getParam('class', 'hub-injected-link');
  var headingTitle = getParam('heading', 'روابط ذات صلة');
  var showDescription = getParam('description', '1') !== '0';
  var excludeProjects = getParam('exclude', '')
    .split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  var currentHost = '';
  try {
    currentHost = window.location.hostname.replace(/^www\./, '');
  } catch (e) {}

  function inject() {
    var url =
      HUB +
      '/api/live-links?limit=' + limit +
      (shuffle ? '&shuffle=1' : '') +
      '&_t=' + Date.now();

    fetch(url, { credentials: 'omit' })
      .then(function (r) { return r.json(); })
      .then(function (links) {
        if (!Array.isArray(links) || links.length === 0) return;

        var filtered = links.filter(function (link) {
          if (excludeProjects.indexOf(link.project) !== -1) return false;
          try {
            var targetHost = new URL(link.targetUrl).hostname.replace(/^www\./, '');
            if (targetHost === currentHost) return false;
          } catch (e) {}
          return true;
        });

        if (filtered.length === 0) return;
        render(filtered);
      })
      .catch(function () { /* silent */ });
  }

  function render(links) {
    var container = document.querySelector(containerSelector);
    if (!container) container = document.body;

    var previous = container.querySelector('.hub-links-wrapper');
    if (previous) previous.remove();

    var wrapper = document.createElement('div');
    wrapper.className = 'hub-links-wrapper';
    wrapper.setAttribute('data-hub-injected', 'true');
    wrapper.setAttribute('aria-label', headingTitle);

    if (mode === 'hidden') {
      // ===== HIDDEN MODE =====
      // Off-screen positioning keeps links invisible to humans but fully
      // discoverable by GoogleBot. Using display:none would make GoogleBot
      // IGNORE the links entirely (SEO-unsafe).
      wrapper.style.cssText = [
        'position:absolute',
        'left:-9999px',
        'top:0',
        'width:1px',
        'height:1px',
        'overflow:hidden',
        'pointer-events:none',
      ].join(';');

      links.forEach(function (link) {
        var a = document.createElement('a');
        a.href = link.goUrl;
        a.textContent = link.title;
        a.className = anchorClass;
        a.setAttribute('data-hub-project', link.project);
        a.setAttribute('data-hub-weight', String(link.weight));
        a.setAttribute('rel', 'noopener noreferrer nofollow');
        a.target = '_blank';
        wrapper.appendChild(a);
      });
    } else if (mode === 'list') {
      // ===== LIST MODE =====
      wrapper.style.cssText = [
        'margin:24px 0',
        'padding:16px',
        'background:#f8fafc',
        'border:1px solid #e2e8f0',
        'border-radius:12px',
      ].join(';');

      if (headingTitle) {
        var h = document.createElement('div');
        h.textContent = headingTitle;
        h.style.cssText = [
          'font-weight:700',
          'font-size:14px',
          'color:#0f172a',
          'margin-bottom:12px',
        ].join(';');
        wrapper.appendChild(h);
      }

      var ul = document.createElement('ul');
      ul.style.cssText = 'list-style:none;padding:0;margin:0;display:grid;gap:8px;';
      links.forEach(function (link) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = link.goUrl;
        a.textContent = link.title;
        a.className = anchorClass;
        a.setAttribute('data-hub-project', link.project);
        a.setAttribute('rel', 'noopener noreferrer');
        a.target = '_blank';
        a.style.cssText = [
          'color:#0d9488',
          'text-decoration:none',
          'font-size:14px',
          'display:inline-block',
          'padding:6px 0',
        ].join(';');
        a.addEventListener('mouseenter', function () {
          a.style.textDecoration = 'underline';
        });
        a.addEventListener('mouseleave', function () {
          a.style.textDecoration = 'none';
        });
        li.appendChild(a);
        ul.appendChild(li);
      });
      wrapper.appendChild(ul);
    } else if (mode === 'inline') {
      // ===== INLINE MODE =====
      // Single paragraph with inline links. Looks like natural editorial content.
      // Best for SEO: appears as a real paragraph with contextual links.
      wrapper.style.cssText = [
        'margin:24px 0',
        'padding:16px 0',
        'color:inherit',
        'font-size:inherit',
        'line-height:1.7',
      ].join(';');

      if (headingTitle) {
        var h2 = document.createElement('p');
        h2.textContent = headingTitle + ': ';
        h2.style.cssText = [
          'font-weight:600',
          'margin:0 0 8px',
          'color:#475569',
          'font-size:0.9em',
        ].join(';');
        wrapper.appendChild(h2);
      }

      var p = document.createElement('p');
      p.style.cssText = 'margin:0;line-height:1.8;';

      var intro = document.createElement('span');
      intro.textContent = 'اطلع أيضاً على: ';
      intro.style.cssText = 'color:#64748b;';
      p.appendChild(intro);

      links.forEach(function (link, i) {
        if (i > 0) {
          var sep = document.createElement('span');
          sep.textContent = ' • ';
          sep.style.cssText = 'color:#cbd5e1;margin:0 4px;';
          p.appendChild(sep);
        }
        var a = document.createElement('a');
        a.href = link.goUrl;
        a.textContent = link.title;
        a.className = anchorClass;
        a.setAttribute('data-hub-project', link.project);
        a.setAttribute('rel', 'noopener noreferrer');
        a.target = '_blank';
        a.style.cssText = [
          'color:#0d9488',
          'text-decoration:none',
          'border-bottom:1px dashed #14b8a6',
          'transition:color 0.15s',
        ].join(';');
        a.addEventListener('mouseenter', function () {
          a.style.color = '#0f766e';
          a.style.borderBottomStyle = 'solid';
        });
        a.addEventListener('mouseleave', function () {
          a.style.color = '#0d9488';
          a.style.borderBottomStyle = 'dashed';
        });
        p.appendChild(a);

        if (showDescription && link.description) {
          var desc = document.createElement('span');
          desc.textContent = ' (' + link.description + ')';
          desc.style.cssText = 'color:#94a3b8;font-size:0.85em;';
          p.appendChild(desc);
        }
      });

      p.appendChild(document.createTextNode('.'));
      wrapper.appendChild(p);
    } else if (mode === 'buttons') {
      // ===== BUTTONS MODE =====
      // A styled card with visible buttons.
      wrapper.style.cssText = [
        'margin:32px 0',
        'padding:24px',
        'background:linear-gradient(135deg,#f0fdfa 0%,#ecfeff 100%)',
        'border:1px solid #a7f3d0',
        'border-radius:16px',
        'box-shadow:0 4px 12px rgba(13,148,136,0.08)',
      ].join(';');

      if (headingTitle) {
        var heading = document.createElement('div');
        heading.style.cssText = [
          'font-weight:700',
          'font-size:18px',
          'color:#0f766e',
          'margin-bottom:4px',
        ].join(';');
        heading.textContent = headingTitle;

        var subtitle = document.createElement('div');
        subtitle.style.cssText = 'font-size:12px;color:#475569;margin-bottom:16px;';
        subtitle.textContent = 'روابط منتقاة قد تهمك — محتوى موثوق وذو صلة';

        wrapper.appendChild(heading);
        wrapper.appendChild(subtitle);
      }

      var grid = document.createElement('div');
      grid.style.cssText = [
        'display:grid',
        'grid-template-columns:repeat(auto-fill,minmax(200px,1fr))',
        'gap:12px',
      ].join(';');

      links.forEach(function (link) {
        var domain = '';
        try {
          domain = new URL(link.targetUrl).hostname.replace(/^www\./, '');
        } catch (e) {}

        var projectLabels = {
          'islami-loan-hub': 'تمويل إسلامي',
          'easy-news-hub': 'أخبار',
          'uaejobe': 'وظائف',
        };
        var projectLabel = projectLabels[link.project] || link.project;

        var card = document.createElement('a');
        card.href = link.goUrl;
        card.className = anchorClass;
        card.setAttribute('data-hub-project', link.project);
        card.setAttribute('rel', 'noopener noreferrer');
        card.target = '_blank';
        card.style.cssText = [
          'display:flex',
          'flex-direction:column',
          'gap:4px',
          'padding:14px 16px',
          'background:#ffffff',
          'border:1px solid #d1fae5',
          'border-radius:10px',
          'text-decoration:none',
          'color:#0f172a',
          'transition:all 0.2s ease',
          'box-shadow:0 1px 2px rgba(0,0,0,0.04)',
        ].join(';');

        var titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-weight:600;font-size:14px;color:#0f766e;';
        titleEl.textContent = link.title;

        var descEl = document.createElement('div');
        descEl.style.cssText = 'font-size:11px;color:#64748b;display:flex;gap:6px;align-items:center;';
        descEl.innerHTML =
          '<span style="background:#d1fae5;color:#065f46;padding:1px 6px;border-radius:4px;font-weight:500;">' +
          projectLabel +
          '</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;" title="' +
          domain +
          '">' +
          domain +
          '</span>';

        card.appendChild(titleEl);
        card.appendChild(descEl);

        if (showDescription && link.description) {
          var descCard = document.createElement('div');
          descCard.style.cssText = 'font-size:11px;color:#94a3b8;margin-top:2px;line-height:1.4;';
          descCard.textContent = link.description;
          card.appendChild(descCard);
        }

        card.addEventListener('mouseenter', function () {
          card.style.transform = 'translateY(-1px)';
          card.style.boxShadow = '0 4px 8px rgba(13,148,136,0.15)';
          card.style.borderColor = '#0d9488';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
          card.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
          card.style.borderColor = '#d1fae5';
        });

        grid.appendChild(card);
      });

      wrapper.appendChild(grid);

      var footer = document.createElement('div');
      footer.style.cssText = 'font-size:10px;color:#94a3b8;margin-top:12px;text-align:left;';
      footer.innerHTML =
        'Powered by <a href="' + HUB + '" target="_blank" rel="noopener noreferrer" style="color:#0d9488;text-decoration:none;">Instant Indexing Hub</a>';
      wrapper.appendChild(footer);
    } else {
      // ===== INTERNAL MODE (DEFAULT) =====
      // Natural in-content links with descriptions. Looks like editorial content.
      // Each link appears as a paragraph: heading + description with the link inline.
      // This is the most SEO-friendly because it mimics real internal links.
      wrapper.style.cssText = [
        'margin:32px 0',
        'padding:0',
      ].join(';');

      if (headingTitle) {
        var sectionHeading = document.createElement('h3');
        sectionHeading.textContent = headingTitle;
        sectionHeading.style.cssText = [
          'font-size:1.25em',
          'font-weight:700',
          'color:#0f172a',
          'margin:0 0 16px',
          'padding-bottom:8px',
          'border-bottom:2px solid #e2e8f0',
        ].join(';');
        wrapper.appendChild(sectionHeading);
      }

      var list = document.createElement('div');
      list.style.cssText = 'display:grid;gap:16px;';

      links.forEach(function (link) {
        var domain = '';
        try {
          domain = new URL(link.targetUrl).hostname.replace(/^www\./, '');
        } catch (e) {}

        var item = document.createElement('div');
        item.style.cssText = [
          'padding:12px 0',
          'border-bottom:1px solid #f1f5f9',
        ].join(';');
        item.className = 'hub-link-item';

        // Title (the link itself)
        var a = document.createElement('a');
        a.href = link.goUrl;
        a.textContent = link.title;
        a.className = anchorClass;
        a.setAttribute('data-hub-project', link.project);
        a.setAttribute('rel', 'noopener noreferrer');
        a.target = '_blank';
        a.style.cssText = [
          'color:#0d9488',
          'text-decoration:none',
          'font-weight:600',
          'font-size:1em',
          'display:inline-block',
          'margin-bottom:4px',
          'transition:color 0.15s',
        ].join(';');
        a.addEventListener('mouseenter', function () {
          a.style.color = '#0f766e';
          a.style.textDecoration = 'underline';
        });
        a.addEventListener('mouseleave', function () {
          a.style.color = '#0d9488';
          a.style.textDecoration = 'none';
        });
        item.appendChild(a);

        // Description below
        if (showDescription && link.description) {
          var descP = document.createElement('p');
          descP.textContent = link.description;
          descP.style.cssText = [
            'margin:4px 0 0',
            'font-size:0.875em',
            'color:#64748b',
            'line-height:1.6',
          ].join(';');
          item.appendChild(descP);
        }

        // Source domain (small text)
        var source = document.createElement('div');
        source.style.cssText = 'font-size:0.75em;color:#94a3b8;margin-top:4px;';
        source.textContent = 'المصدر: ' + domain;
        item.appendChild(source);

        list.appendChild(item);
      });

      wrapper.appendChild(list);

      // Subtle footer (not visible to humans, but discoverable)
      var footerInternal = document.createElement('div');
      footerInternal.style.cssText = 'font-size:0.7em;color:#cbd5e1;margin-top:16px;';
      footerInternal.innerHTML =
        '— <a href="' + HUB + '" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">Instant Indexing Hub</a>';
      wrapper.appendChild(footerInternal);
    }

    // Inject at the chosen position
    switch (position) {
      case 'prepend':
        container.insertBefore(wrapper, container.firstChild);
        break;
      case 'before':
        container.parentNode.insertBefore(wrapper, container);
        break;
      case 'after':
        container.parentNode.insertBefore(wrapper, container.nextSibling);
        break;
      case 'append':
      default:
        container.appendChild(wrapper);
    }
  }

  // Initial injection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // Re-inject on SPA navigations (history API)
  var origPush = history.pushState;
  var origReplace = history.replaceState;
  history.pushState = function () {
    var r = origPush.apply(this, arguments);
    setTimeout(inject, 300);
    return r;
  };
  history.replaceState = function () {
    var r = origReplace.apply(this, arguments);
    setTimeout(inject, 300);
    return r;
  };
  window.addEventListener('popstate', function () { setTimeout(inject, 300); });
})();
