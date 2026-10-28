/* COMPANY X-RAY v3.3 — FULL DROP-IN SUCCESS HANDLER.
 * Replace the complete google.script.run chain provided by the user.
 * This block does NOT need ReportUIFix.html or any extra JS file.
 * Preserve the existing stopLoading, renderResult, showError and request variables.
 */
google.script.run
  .withSuccessHandler(function(result) {
    stopLoading();

    // Protect the requested business from a different company that happens
    // to share a brand token (e.g. "Winners" vs "Winners Developer").
    if (result && result.company && result.request && result.request.company) {
      var company = result.company;
      var target = String(result.request.company).trim();
      var key = function(x) {
        return String(x || '').toLowerCase().trim().replace(/\s+/g, ' ');
      };
      var rawName = String(company.canonical_name || '').trim();
      var singleWord = target.split(/\s+/).length === 1;
      if ((rawName && key(rawName) !== key(target)) || singleWord) {
        company.identity_status = 'AMBIGUOUS';
        company.industry = null;
        company.company_size_range = null;
        company.main_location = null;
        company.official_website = null;
        company.evidence_ids = [];
        company.notes = 'The available public search results do not verify the exact requested company.';
      }
      company.canonical_name = target;
      company.aliases = (Array.isArray(company.aliases) ? company.aliases : [])
        .filter(function(alias) { return key(alias) === key(target); });
    }

    // Run the existing Winners report renderer without changing its design.
    renderResult(result);

    // Self-contained source figures panel. No dependency on ReportUIFix.html.
    function enhanceReport() {
      if (!result || !result.salary) return;

      var salary = result.salary;
      var present = salary.presentation || {};
      var data = Array.isArray(present.published_salary_mentions)
        ? present.published_salary_mentions : [];

      // Fallback for v3.1/v3.2 backend versions with an evidence ledger.
      if (!data.length) {
        var ledger = Array.isArray(salary.observed_public_signals)
          ? salary.observed_public_signals
          : (Array.isArray(salary.evidence_ledger) ? salary.evidence_ledger : []);
        data = ledger.filter(function(x) {
          return x.status !== 'EXCLUDED' && x.location_verified === true &&
            Number(x.monthly_min) > 0 && Number(x.monthly_max) > 0;
        }).map(function(x) {
          return {
            monthly_min: x.monthly_min,
            monthly_max: x.monthly_max,
            currency: x.currency || salary.currency || 'EGP',
            pay_basis: x.pay_basis || 'UNKNOWN',
            source_title: x.title || 'Salary source',
            source_url: x.url || '',
            publication_date: x.publication_date || null,
            current_source_page_verified: false,
            limitation: x.reason || 'SEARCH_SNIPPET_ONLY'
          };
        });
      }

      var uniq = Object.create(null);
      data = data.filter(function(x) {
        var url = String(x.source_url || '');
        if (!/^https:\/\//i.test(url)) return false;
        var lo = Number(x.monthly_min), hi = Number(x.monthly_max);
        if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi < lo) return false;
        var key = url.toLowerCase() + '|' + lo + '|' + hi;
        if (uniq[key]) return false;
        uniq[key] = true;
        return true;
      });

      function node(tag, text, style) {
        var e = document.createElement(tag);
        if (text !== undefined && text !== null) e.textContent = String(text);
        if (style) e.style.cssText = style;
        return e;
      }
      function fmt(x, c) {
        return new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(Number(x)) +
          ' ' + (c || salary.currency || 'EGP');
      }
      function anchorForSalary() {
        var els = document.querySelectorAll('h1,h2,h3,h4,h5,div,span,strong,p');
        for (var i = 0; i < els.length; i++) {
          var x = els[i];
          if (x.children.length || String(x.textContent || '').trim() !== 'Salary Intelligence') continue;
          var ancestor = x;
          for (var depth = 0; depth < 7 && ancestor && ancestor !== document.body; depth++) {
            var txt = String(ancestor.textContent || '').toLowerCase();
            if (txt.indexOf('most probable offer') >= 0 &&
                (txt.indexOf('market range') >= 0 || txt.indexOf('confirmed company salary') >= 0)) {
              return { card: ancestor, title: x };
            }
            ancestor = ancestor.parentElement;
          }
          return { card: x.parentElement && x.parentElement.parentElement || x.parentElement, title: x };
        }
        return { card: document.querySelector('#results,#result,#report,#reportContent,.report-container') || document.body, title: null };
      }

      var old = document.getElementById('xray-v33-salary-mentions');
      if (old && old.parentNode) old.parentNode.removeChild(old);

      var panel = node('section', null,
        'background:#f8fafc;border:1px solid #dbe3ee;border-radius:12px;' +
        'padding:14px;margin:16px 0;color:#192c4e;font:13px Arial,sans-serif;');
      panel.id = 'xray-v33-salary-mentions';
      panel.appendChild(node('div', 'PUBLIC SALARY MENTIONS  •  ' + data.length + ' SOURCE(S)',
        'font-size:14px;font-weight:800;color:#132956;margin-bottom:8px;'));
      panel.appendChild(node('p',
        'Figures from public search excerpts only — NOT confirmed employer salary, a market survey, or a verified offer.',
        'font-size:12px;line-height:1.65;color:#5a6473;margin:0 0 10px;'));

      if (!data.length) {
        panel.appendChild(node('p',
          'No usable numeric salary mentions were extracted for this role and location in this run. ' +
          'A salary figure cannot be provided reliably from the available sources.',
          'font-size:13px;line-height:1.6;margin:4px 0;'));
      }

      data.forEach(function(x) {
        var lo = Number(x.monthly_min), hi = Number(x.monthly_max);
        var row = node('div', null,
          'background:white;border:1px solid #e1e6ee;border-radius:9px;margin:8px 0;padding:11px;');
        row.appendChild(node('div',
          fmt(lo, x.currency) + (hi !== lo ? ' – ' + fmt(hi, x.currency) : '') + ' / month',
          'font-size:18px;font-weight:800;color:#0f2447;'));
        row.appendChild(node('div',
          (x.pay_basis && x.pay_basis !== 'UNKNOWN' ? x.pay_basis.replace(/_/g,' ') : 'Pay basis unknown') +
          '  •  ' + (x.publication_date || 'Date unverified') + '  •  Source page not checked',
          'font-size:11px;color:#69768a;margin:6px 0;line-height:1.5;'));
        var a = node('a', x.source_title || x.source_url,
          'font-size:12px;color:#184b82;text-decoration:underline;overflow-wrap:anywhere;');
        a.href = x.source_url;
        a.rel = 'noopener noreferrer';
        a.target = '_blank';
        row.appendChild(a);
        panel.appendChild(row);
      });

      panel.appendChild(node('div',
        'Market Benchmark and Most Probable Offer remain unavailable unless sufficient comparable sources support them.',
        'font-size:11px;color:#8a6214;line-height:1.6;margin-top:8px;'));

      var loc = anchorForSalary();
      if (loc.card) loc.card.appendChild(panel);

      // The existing Index.html converts null confidence to a misleading 0%.
      // Correct only the displayed confidence labels when the backend score is null.
      var allNull = [result.company && result.company.confidence_score,
        result.salary && result.salary.confidence_score,
        result.feedback && result.feedback.confidence_score]
        .every(function(x) { return x === null || x === undefined; });

      if (allNull) {
        var cells = document.querySelectorAll('span,strong,small,div,p');
        for (var j = 0; j < cells.length; j++) {
          var cell = cells[j];
          if (cell.children.length) continue;
          var str = String(cell.textContent || '').trim();
          if (/^0%\s*[-•·]\s*Low$/i.test(str)) cell.textContent = 'Not assessed';
          else if (/^Confidence:\s*0%\s*\(Low\)/i.test(str))
            cell.textContent = str.replace(/^Confidence:\s*0%\s*\(Low\)/i, 'Confidence: Not assessed');
        }
      }

      console.log('Company X-Ray v3.3 report enhancement rendered:', data.length, 'salary sources');
    }

    try {
      enhanceReport();
    } catch (error) {
      console.error('Company X-Ray v3.3 UI enhancement error', error);
    }

  })
  .withFailureHandler(function(error) {
    stopLoading();
    showError(error && error.message ? error.message : String(error));
  })
  .runCompanyXRay(request);
