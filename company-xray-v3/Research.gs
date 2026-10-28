/**
 * ============================================================
 * COMPANY X-RAY
 * Integrated Research Engine
 * Version 3.0 — evidence-governed benchmark
 * ============================================================
 *
 * Scope:
 * 1. Company Verification
 * 2. Salary Survey Intelligence
 * 3. Employee / Candidate Feedback
 *
 * Salary flow:
 * Serper -> Gemini + deterministic snippet extraction -> strict source
 * verification -> recent comparable evidence only -> indicative raw
 * range when sufficient. No survey percentiles or invented adjustments.
 *
 * IMPORTANT:
 * - Gemini does NOT calculate the final salary benchmark.
 * - Verified salary observations remain unmodified.
 * - Raw observed public salary evidence is NEVER altered.
 */


/**
 * ============================================================
 * GLOBAL SALARY SETTINGS
 * ============================================================
 */

const COMPANY_XRAY_SALARY_MARKET_FACTOR_ = 1.00;
const COMPANY_XRAY_MIN_MARKET_POINTS_ = 3;


/**
 * ============================================================
 * MAIN ENTRY POINT
 * ============================================================
 */


/**
 * COMPANY X-RAY 3.0: No artificial market discounts, imaginary percentiles,
 * company-size salary guesses or statistically unsupported confidence.
 * Serper snippets are pointers, not representative salary-survey microdata.
 */
const XR_MAX_SALARY_AGE_MONTHS_ = 18;
const XR_MIN_DISTINCT_PUBLISHERS_ = 2;
function xrSourceDate_(value, now) {
  const raw = String(value||'').trim().toLowerCase();
  if(!raw) return null;
  const current = now ? new Date(now) : new Date();
  if(!Number.isFinite(current.getTime()))return null;
  const relative = raw.match(/(?:^|\b)(\d+)\s+(day|week|month|year)s?\s+ago/);
  if(relative){
    const d=new Date(current.getTime());
    const n=Number(relative[1]);
    const u=relative[2];
    if(u==='day')d.setUTCDate(d.getUTCDate()-n);
    else if(u==='week')d.setUTCDate(d.getUTCDate()-7*n);
    else if(u==='month')d.setUTCMonth(d.getUTCMonth()-n);
    else d.setUTCFullYear(d.getUTCFullYear()-n);
    return d.toISOString().slice(0,10);
  }
  const y=raw.match(/\b(20\d{2})\b/);
  if(!y || /^20\d{2}$/.test(raw))return null;
  const dt=new Date(value);
  if(Number.isFinite(dt.getTime()))return dt.toISOString().slice(0,10);
  return null; // A bare year is not precise enough to certify recency.
}
function xrSalarySourceFresh_(value,now) {
  const date=xrSourceDate_(value,now);
  if(!date)return false; // unknown publication date cannot pass as recent
  const current=new Date(now||Date.now());
  const d=new Date(date+'T00:00:00Z');
  const earliest=new Date(current.getTime());
  earliest.setUTCMonth(earliest.getUTCMonth()-XR_MAX_SALARY_AGE_MONTHS_);
  return d<=current && d>=earliest;
}
function xrRoleGeographyMatch_(request,source){
  const city=normalizeXRayText_(request.city||'').trim();
  if(!city)return true;
  const text=normalizeXRayText_([source.title||'',source.snippet||''].join(' '));
  // City-specific benchmark: "Egypt" alone is not "Cairo".
  return city.length>=3 && text.indexOf(city)>=0;
}
function xrCompanyMatch_(request,source){
  const tokens=getXRayTokens_(request.company||'');
  if(!tokens.length)return false;
  const t=normalizeXRayText_([source.title||'',source.snippet||''].join(' '));
  return tokens.every(function(x){return t.indexOf(x)>=0;});
}
function xrSalaryExtractMatches_(item,source) {
  const text=[source.title||'',source.snippet||''].join(' ');
  const period=extractPeriodBoundSalary_(text);
  if(!period)return false;
  const itemPeriod=String(item.period||'').toUpperCase();
  if(period.period!==itemPeriod)return false;
  const a=Number(item.min_salary),b=Number(item.max_salary);
  if(!Number.isFinite(a)||!Number.isFinite(b))return false;
  const pmin=Number(period.min),pmax=Number(period.max);
  const near=function(x,y){return Math.abs(x-y)<=Math.max(10,0.015*Math.max(x,y));};
  return near(Math.min(a,b),Math.min(pmin,pmax)) && near(Math.max(a,b),Math.max(pmin,pmax));
}
function xrSalaryEvidenceCategories_(points) {
  // Do not mix basic with gross, net or total cash in a single series.
  const buckets={};
  (points||[]).forEach(function(p){
   const key=p.payBasis||'UNKNOWN';
   (buckets[key]||(buckets[key]=[])).push(p);
  });
  return buckets;
}
function xrIndependentSourceCount_(points) {
  return new Set((points||[]).map(function(x){
    let d=getXRayDomain_(x.url||'').toLowerCase();
    d=d.replace(/^(www|m|eg|en)\./,'');
    // A regional subdomain is not an independent publisher.
    const a=d.split('.').filter(Boolean);
    if(a.length>=3 && ['co','com','org','net'].includes(a[a.length-2]) &&
      a[a.length-1].length===2)return a.slice(-3).join('.');
    return a.length>=2?a.slice(-2).join('.'):d;
  }).filter(Boolean)).size;
}
function xrEvidenceLedger_(accepted,rejected,evidenceMap) {
  const good=(accepted||[]).map(function(p){
    const usable=p.sourceFresh && p.locationVerified &&
      ['GROSS_SALARY','BASE_SALARY'].includes(p.payBasis) &&
      !['SOCIAL_MEDIA','UNKNOWN','EMPLOYEE_REVIEW'].includes(p.sourceType);
    const note=!p.sourceFresh?'OLD_OR_UNDATED_SOURCE':
      !p.locationVerified?'CITY_NOT_VERIFIED':
      !['GROSS_SALARY','BASE_SALARY'].includes(p.payBasis)?'PAY_BASIS_NOT_COMPARABLE':
      !usable?'SOURCE_NOT_SUITABLE_FOR_BENCHMARK':
      !p.benchmarkSelected?'INSUFFICIENT_COMPARABLE_PUBLISHERS_OR_SOURCES':'COMPARABLE_BENCHMARK_SIGNAL';
    return {evidence_id:p.evidenceId,
      status:p.benchmarkSelected?'IN_BENCHMARK':'OBSERVED_CONTEXT_ONLY',
      reason:note,verification_level:'SEARCH_SNIPPET_ONLY',
      url:p.url,title:p.title,publication_date:p.sourceDate||null,
      currency:p.currency,pay_basis:p.payBasis,original_period:p.originalPeriod,
      monthly_min:p.monthlyMin,monthly_max:p.monthlyMax,source_type:p.sourceType,
      used_in_benchmark:Boolean(p.benchmarkSelected),
      location_verified:p.locationVerified||false,source_fresh:p.sourceFresh||false};
  });
  const bad=(rejected||[]).map(function(p){
    const ev=evidenceMap[Number(p.evidenceId||0)]||{};
    return {evidence_id:p.evidenceId||null,status:'EXCLUDED',reason:p.reason,
      url:ev.url||null,title:ev.title||null,publication_date:xrSourceDate_(ev.date)};
  });
  return good.concat(bad);
}
function xrStrictSurveyStatus_(points) {
  // Aggregate snippets are NOT a microdata survey. No P25/P50/P75.
  return {
    survey_classification:'NOT_A_STATISTICAL_SURVEY',
    p25:null,p50:null,p75:null,
    sample_size:null, // Web snippet count is NOT respondent count.
    source_pages:(points||[]).length,
    distinct_publishers:xrIndependentSourceCount_(points),
    disclosure:'Public salary signals are not a representative survey; no percentiles, market discount or company-offer estimates have been inferred.'
  };
}

function runCompanyXRay_(request) {

  const startedAt = Date.now();

  request = normalizeCompanyXRayRequest_(request);
  validateCompanyXRayRequest_(request);

  const depthConfig = getResearchDepthConfig_(request.depth);

  const targetSeniority = inferTargetSeniority_(
    request.jobTitle,
    request.experienceLevel
  );

  console.log('==========================================');
  console.log('Company X-Ray started');
  console.log('Company: ' + request.company);
  console.log('Country: ' + (request.country || 'Not specified'));
  console.log('Target Role: ' + (request.jobTitle || 'Not provided'));
  console.log('Target Seniority: ' + targetSeniority);
  console.log('Depth: ' + depthConfig.label);


  /**
   * ==========================================================
   * STEP 1 - SEARCH PLAN
   * ==========================================================
   */

  const searchPlan = buildCompanyXRaySearchPlan_(
    request,
    depthConfig,
    targetSeniority
  );

  console.log('Search queries planned: ' + searchPlan.length);


  /**
   * ==========================================================
   * STEP 2 - SERPER SEARCH
   * ==========================================================
   */

  const searchRuns = [];

  searchPlan.forEach(function(searchItem, index) {

    console.log(
      'Search ' +
      (index + 1) +
      '/' +
      searchPlan.length +
      ': ' +
      searchItem.query
    );

    try {

      const result = serperSearch_(
        searchItem.query,
        {
          country: request.country,
          language: 'en',
          num: searchItem.num || 8
        }
      );

      searchRuns.push({
        module: searchItem.module,
        query: searchItem.query,
        result: result,
        success: true
      });

    } catch (error) {

      console.warn(
        'Search failed: ' +
        searchItem.query +
        ' | ' +
        String(error.message || error)
      );

      searchRuns.push({
        module: searchItem.module,
        query: searchItem.query,
        result: null,
        success: false,
        error: String(error.message || error)
      });
    }
  });


  /**
   * ==========================================================
   * STEP 3 - BUILD / DEDUPLICATE / RANK EVIDENCE
   * ==========================================================
   */

  let evidence = buildCompanyXRayEvidence_(searchRuns);
  evidence = deduplicateCompanyXRayEvidence_(evidence);
  evidence = rankCompanyXRayEvidence_(request, evidence);

  evidence = evidence.slice(
    0,
    getCompanyXRayMaxEvidence_(request.depth)
  );

  evidence = evidence.map(function(item, index) {
    item.evidenceId = index + 1;
    return item;
  });

  console.log('Unique evidence items: ' + evidence.length);

  if (evidence.length === 0) {
    return createEmptyCompanyXRayResult_(
      request,
      startedAt,
      searchRuns
    );
  }


  /**
   * ==========================================================
   * STEP 4 - GEMINI EVIDENCE EXTRACTION
   * ==========================================================
   */

  const prompt = buildCompanyXRayPrompt_(
    request,
    evidence,
    targetSeniority
  );

  console.log('Sending evidence to Gemini...');

  let aiResult;
  try {
    aiResult = geminiStructuredAnalysis_({
      input: prompt,
      schema: getCompanyXRaySchema_(),
      thinkingLevel: depthConfig.thinkingLevel,
      maxOutputTokens: 12000
    }) || {};
  } catch (error) {
    console.warn('Gemini evidence extraction failed; falling back to direct Serper snippets.');
    aiResult = {data:{},interaction:null,usage:null,error_code:'GEMINI_EXTRACTION_UNAVAILABLE'};
  }
  if (!aiResult.data) aiResult.data={};


  /**
   * ==========================================================
   * STEP 5 - DIRECT SALARY EXTRACTION FROM SEARCH SNIPPETS
   * ==========================================================
   *
   * This supplements Gemini with deterministic extraction when
   * Serper snippets themselves show explicit salary numbers.
   */

  const snippetSalaryEvidence = extractSalaryEvidenceFromSearchSnippets_(
    request,
    evidence,
    targetSeniority
  );

  console.log(
    'Direct snippet salary evidence: ' +
    snippetSalaryEvidence.length
  );

  aiResult.data.salary_evidence = mergeSalaryEvidence_(
    aiResult.data.salary_evidence || [],
    snippetSalaryEvidence
  );

  console.log(
    'Total merged salary evidence: ' +
    aiResult.data.salary_evidence.length
  );


  /**
   * ==========================================================
   * STEP 6 - UPGRADE OFFICIAL COMPANY SOURCES
   * ==========================================================
   */

  evidence = upgradeOfficialCompanySources_(
    evidence,
    aiResult.data.company
      ? aiResult.data.company.official_website
      : null
  );


  /**
   * ==========================================================
   * STEP 7 - FINAL NORMALIZATION + DETERMINISTIC SALARY ENGINE
   * ==========================================================
   */

  const normalized = normalizeCompanyXRayResult_(
    request,
    aiResult.data,
    evidence,
    targetSeniority
  );

  const completedAt = Date.now();

  const finalResult = {

    success: true,
    request: request,
    company: normalized.company,
    salary: normalized.salary,
    feedback: normalized.feedback,
    sources: normalized.sources,

    research: {
      depth: request.depth,
      searchProvider: 'Serper',
      searchesExecuted: searchRuns.length,
      successfulSearches: searchRuns.filter(function(item) {
        return item.success;
      }).length,
      uniqueEvidenceItems: evidence.length,
      geminiModel: aiResult.interaction
        ? aiResult.interaction.model
        : null,
      geminiFallbackUsed: aiResult.interaction
        ? aiResult.interaction.fallbackUsed
        : false,
      geminiUsage: aiResult.usage || null,
      warning:aiResult.error_code||null,
      durationSeconds: Math.round(
        (completedAt - startedAt) / 1000
      )
    }
  };

  console.log('Company X-Ray completed.');

  console.log(
    'Salary accepted evidence: ' +
    (
      finalResult.salary &&
      finalResult.salary.diagnostics
        ? finalResult.salary.diagnostics.acceptedEvidenceCount
        : 0
    )
  );

  console.log(
    'Salary rejected evidence: ' +
    (
      finalResult.salary &&
      finalResult.salary.diagnostics
        ? finalResult.salary.diagnostics.rejectedEvidenceCount
        : 0
    )
  );

  return finalResult;
}


/**
 * ============================================================
 * REQUEST NORMALIZATION
 * ============================================================
 */

function normalizeCompanyXRayRequest_(request) {

  request = request || {};

  return {
    company: cleanCompanyXRayText_(request.company),
    country: cleanCompanyXRayText_(request.country),
    city: cleanCompanyXRayText_(request.city),
    jobTitle: cleanCompanyXRayText_(request.jobTitle),
    experienceLevel: cleanCompanyXRayText_(request.experienceLevel),
    depth: normalizeCompanyXRayDepth_(request.depth)
  };
}


function normalizeCompanyXRayDepth_(value) {

  value = String(value || '')
    .trim()
    .toLowerCase();

  if (value === 'quick' || value === 'deep') {
    return value;
  }

  return 'professional';
}


function validateCompanyXRayRequest_(request) {

  if (!request.company) {
    throw new Error('COMPANY_NAME_REQUIRED');
  }

  if (
    request.company.length >
    APP_CONFIG.LIMITS.COMPANY_NAME_MAX_LENGTH
  ) {
    throw new Error('COMPANY_NAME_TOO_LONG');
  }

  if (
    request.country.length >
    APP_CONFIG.LIMITS.COUNTRY_MAX_LENGTH
  ) {
    throw new Error('COUNTRY_TOO_LONG');
  }

  if (
    request.jobTitle.length >
    APP_CONFIG.LIMITS.JOB_TITLE_MAX_LENGTH
  ) {
    throw new Error('JOB_TITLE_TOO_LONG');
  }
}


/**
 * ============================================================
 * TARGET SENIORITY
 * ============================================================
 */

function inferTargetSeniority_(jobTitle, experienceLevel) {

  const title = normalizeXRayText_(jobTitle);
  const experience = normalizeXRayText_(experienceLevel);

  if (/\b(director|head|chief|vp|vice president)\b/i.test(title)) {
    return 'HEAD_DIRECTOR';
  }

  if (/\bmanager\b/i.test(title)) {
    return 'MANAGER';
  }

  if (/\b(senior|sr|lead|supervisor)\b/i.test(title)) {
    return 'SENIOR';
  }

  if (/\b(junior|jr|assistant|trainee|intern)\b/i.test(title)) {
    return 'JUNIOR';
  }

  if (experience.indexOf('0 1') !== -1) {
    return 'ENTRY';
  }

  if (experience.indexOf('1 3') !== -1) {
    return 'JUNIOR';
  }

  if (experience.indexOf('3 5') !== -1) {
    return 'MID';
  }

  if (experience.indexOf('5 8') !== -1) {
    return 'SENIOR';
  }

  if (
    experience.indexOf('8 12') !== -1 ||
    experience.indexOf('12') !== -1
  ) {
    return 'SENIOR';
  }

  return 'UNKNOWN';
}


/**
 * ============================================================
 * SEARCH PLAN
 * ============================================================
 */

function buildCompanyXRaySearchPlan_(
  request,
  depthConfig,
  targetSeniority
) {

  const company = request.company;
  const country = request.country || 'Egypt';
  const city = request.city || 'Cairo';
  const role = request.jobTitle;
  const experience = request.experienceLevel;
  const year = new Date().getFullYear();

  const searches = [];

  /** Company identity */
  searches.push({
    module: 'company',
    query: buildXRayQuery_([
      '"' + company + '"',
      country,
      'official website company profile'
    ]),
    num: 8
  });

  /** Genuine employee feedback */
  searches.push({
    module: 'feedback',
    query: buildXRayQuery_([
      '"' + company + '"',
      'employee reviews Glassdoor Indeed'
    ]),
    num: 8
  });

  if (role) {

    /** Company-specific salary */
    searches.push({
      module: 'salary_company',
      query: buildXRayQuery_([
        '"' + company + '"',
        '"' + role + '"',
        'salary EGP monthly'
      ]),
      num: 10
    });

    /** Exact role + monthly currency signal */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        '"' + role + '"',
        country,
        '"EGP"',
        '"per month"',
        experience
      ]),
      num: 10
    });

    /** Exact role + city + current year */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        '"' + role + ' salary"',
        city,
        country,
        'EGP',
        year
      ]),
      num: 10
    });

    /** Bayt salary search */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        'site:bayt.com',
        '"' + role + '"',
        country,
        'salary EGP'
      ]),
      num: 10
    });

    /** Glassdoor salary search */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        'site:glassdoor.com',
        '"' + role + '"',
        country,
        'salary'
      ]),
      num: 10
    });

    /** Wuzzuf salary / vacancy search */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        'site:wuzzuf.net',
        '"' + role + '"',
        'salary',
        country
      ]),
      num: 10
    });

    /** Salary platforms */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        '"' + role + '"',
        country,
        'SalaryExpert PayScale Talent salary'
      ]),
      num: 10
    });

    /** Arabic salary query */
    searches.push({
      module: 'salary_market',
      query: buildXRayQuery_([
        '"' + role + '"',
        'مرتب راتب جنيه مصر'
      ]),
      num: 10
    });
  }

  /** Extra deep research */
  if (request.depth === 'deep') {

    searches.push({
      module: 'feedback',
      query: buildXRayQuery_([
        '"' + company + '"',
        'employee reviews management work life balance'
      ]),
      num: 10
    });

    if (role) {
      searches.push({
        module: 'salary_market',
        query: buildXRayQuery_([
          '"' + role + '"',
          country,
          targetSeniority,
          'compensation range monthly salary'
        ]),
        num: 10
      });
    }
  }

  let maxQueries = 10;

  if (request.depth === 'quick') {
    maxQueries = 5;
  }

  if (request.depth === 'deep') {
    maxQueries = 12;
  }

  return searches.slice(0, maxQueries);
}


function buildXRayQuery_(parts) {

  return parts
    .filter(function(part) {
      return Boolean(String(part || '').trim());
    })
    .join(' ')
    .trim();
}


/**
 * ============================================================
 * EVIDENCE CREATION
 * ============================================================
 */

function buildCompanyXRayEvidence_(searchRuns) {

  const evidence = [];

  searchRuns.forEach(function(run) {

    if (
      !run.success ||
      !run.result ||
      !Array.isArray(run.result.results)
    ) {
      return;
    }

    run.result.results.forEach(function(item) {

      if (!item || !item.url) {
        return;
      }

      evidence.push({
        module: run.module,
        searchQuery: run.query,
        title: String(item.title || '').trim(),
        url: String(item.url || '').trim(),
        domain: getXRayDomain_(item.url),
        snippet: String(item.snippet || '').trim(),
        date: item.date || null,
        googlePosition: Number(item.position || 0),
        sourceType: classifyXRaySource_(item.url, item.title)
      });
    });
  });

  return evidence;
}


function deduplicateCompanyXRayEvidence_(evidence) {

  const map = {};

  evidence.forEach(function(item) {

    const key = normalizeXRayUrl_(item.url);

    if (!key) {
      return;
    }

    if (!map[key]) {
      map[key] = item;
      return;
    }

    const existing = map[key];

    const modules = String(existing.module || '')
      .split(',')
      .concat(String(item.module || '').split(','))
      .filter(Boolean);

    existing.module = Array.from(new Set(modules)).join(',');

    /** Keep the richer snippet if duplicate URLs differ. */
    if (
      String(item.snippet || '').length >
      String(existing.snippet || '').length
    ) {
      existing.snippet = item.snippet;
    }
  });

  return Object.keys(map).map(function(key) {
    return map[key];
  });
}


/**
 * ============================================================
 * EVIDENCE RANKING
 * ============================================================
 */

function rankCompanyXRayEvidence_(request, evidence) {

  const companyTokens = getXRayTokens_(request.company);
  const roleTokens = getXRayTokens_(request.jobTitle);

  return evidence
    .map(function(item) {

      const text = normalizeXRayText_([
        item.title,
        item.snippet,
        item.domain
      ].join(' '));

      let score = 0;

      companyTokens.forEach(function(token) {
        if (text.indexOf(token) !== -1) {
          score += 10;
        }
      });

      roleTokens.forEach(function(token) {
        if (text.indexOf(token) !== -1) {
          score += 7;
        }
      });

      score += getXRaySourceWeightScore_(item.sourceType);

      score += Math.max(
        0,
        8 - Number(item.googlePosition || 8)
      );

      if (/salary|salaries|compensation|pay|egp|جنيه|مرتب|راتب/i.test(text)) {
        score += 10;
      }

      if (/review|employee|interview|work environment/i.test(text)) {
        score += 5;
      }

      item.relevanceScore = score;
      return item;
    })
    .sort(function(a, b) {
      return b.relevanceScore - a.relevanceScore;
    });
}


function getXRaySourceWeightScore_(sourceType) {

  const map = {
    OFFICIAL: 14,
    GOVERNMENT: 14,
    JOB_BOARD: 11,
    SALARY_PLATFORM: 11,
    EMPLOYEE_REVIEW: 10,
    PROFESSIONAL_NETWORK: 8,
    REPUTABLE_MEDIA: 7,
    SOCIAL_MEDIA: 3,
    BUSINESS_DIRECTORY: 3,
    UNKNOWN: 2
  };

  return map[sourceType] || 2;
}


/**
 * ============================================================
 * SOURCE CLASSIFICATION
 * ============================================================
 */

function classifyXRaySource_(url, title) {

  const domain = getXRayDomain_(url);
  const lowerUrl = String(url || '').toLowerCase();
  const lowerTitle = String(title || '').toLowerCase();
  const text = lowerUrl + ' ' + lowerTitle;

  if (
    text.indexOf('glassdoor.') !== -1 &&
    (text.indexOf('review') !== -1 || text.indexOf('reviews') !== -1)
  ) {
    return 'EMPLOYEE_REVIEW';
  }

  if (
    text.indexOf('indeed.') !== -1 &&
    (text.indexOf('/cmp/') !== -1 || text.indexOf('review') !== -1)
  ) {
    return 'EMPLOYEE_REVIEW';
  }

  if (text.indexOf('glassdoor.') !== -1) {
    if (text.indexOf('salar') !== -1) {
      return 'SALARY_PLATFORM';
    }
    return 'EMPLOYEE_REVIEW';
  }

  if (
    text.indexOf('indeed.') !== -1 ||
    text.indexOf('wuzzuf.') !== -1 ||
    text.indexOf('bayt.') !== -1 ||
    text.indexOf('linkedin.com/jobs') !== -1 ||
    text.indexOf('tanqeeb.com') !== -1
  ) {
    return 'JOB_BOARD';
  }

  if (
    text.indexOf('salaryexpert.') !== -1 ||
    text.indexOf('payscale.') !== -1 ||
    text.indexOf('talent.com') !== -1 ||
    text.indexOf('salaryexplorer.') !== -1
  ) {
    return 'SALARY_PLATFORM';
  }

  if (text.indexOf('linkedin.com') !== -1) {
    return 'PROFESSIONAL_NETWORK';
  }

  if (
    text.indexOf('facebook.com') !== -1 ||
    text.indexOf('instagram.com') !== -1 ||
    text.indexOf('tiktok.com') !== -1
  ) {
    return 'SOCIAL_MEDIA';
  }

  if (/\.gov\.|gov\.|government/i.test(domain)) {
    return 'GOVERNMENT';
  }

  return 'UNKNOWN';
}


function upgradeOfficialCompanySources_(evidence, officialWebsite) {

  const officialDomain = getXRayDomain_(officialWebsite);

  if (!officialDomain) {
    return evidence;
  }

  return evidence.map(function(item) {
    if (item.domain === officialDomain) {
      item.sourceType = 'OFFICIAL';
    }
    return item;
  });
}


/**
 * ============================================================
 * GEMINI PROMPT
 * ============================================================
 */

function buildCompanyXRayPrompt_(
  request,
  evidence,
  targetSeniority
) {

  const evidenceText = evidence.map(function(item) {

    return [
      'EVIDENCE_ID: ' + item.evidenceId,
      'MODULE: ' + item.module,
      'SOURCE_TYPE: ' + item.sourceType,
      'TITLE: ' + item.title,
      'DOMAIN: ' + item.domain,
      'URL: ' + item.url,
      'DATE: ' + (item.date || 'Not provided'),
      'SEARCH_SNIPPET: ' + (item.snippet || 'No snippet')
    ].join('\n');

  }).join('\n\n============================\n\n');

  return [

    'You are the Company X-Ray Evidence Extraction Engine.',
    '',
    'Do NOT calculate final salary ranges.',
    'Extract structured evidence only from the supplied evidence.',
    '',
    'TARGET COMPANY:',
    request.company,
    '',
    'TARGET COUNTRY:',
    request.country || 'Not specified',
    '',
    'TARGET CITY:',
    request.city || 'Not specified',
    '',
    'TARGET JOB:',
    request.jobTitle || 'Not specified',
    '',
    'TARGET EXPERIENCE:',
    request.experienceLevel || 'Not specified',
    '',
    'TARGET SENIORITY:',
    targetSeniority,
    '',
    '========================================',
    'STRICT SALARY RULES',
    '========================================',
    '',
    '1. Do NOT calculate Market Range.',
    '2. Do NOT calculate Estimated Company Range.',
    '3. Do NOT calculate Most Probable Offer.',
    '4. Do NOT calculate Strong Candidate Range.',
    '',
    '5. Create salary_evidence only when the supplied title or snippet contains an explicit numeric salary.',
    '',
    '6. Never create salary numbers from general knowledge.',
    '',
    '7. Preserve whether salary is MONTHLY or ANNUAL.',
    '',
    '8. If salary period cannot be established, use UNKNOWN.',
    '',
    '9. Normalize Egyptian currency labels such as EGP, LE, E£ and جنيه to EGP.',
    '',
    '10. role_match rules:',
    'EXACT = same target role.',
    'CLOSE = genuinely equivalent role at the same career level.',
    'BROAD = only the broad occupational family.',
    'MISMATCH = materially different role.',
    '',
    '11. seniority_match rules:',
    'EXACT = same seniority.',
    'CLOSE = adjacent reasonable seniority.',
    'UNKNOWN = evidence does not state seniority.',
    'MISMATCH = clearly different seniority.',
    '',
    '12. HR Manager is NOT HR Specialist.',
    '13. HR Director / Head of HR is NOT HR Manager or HR Specialist.',
    '14. Internship, trainee and training stipends are NOT salary evidence for a normal Specialist role unless the requested role itself is internship/trainee.',
    '',
    '15. company_specific=true only when salary evidence clearly relates to the requested company.',
    '',
    '16. pay_basis must be one of BASE_SALARY, GROSS_SALARY, TOTAL_COMPENSATION, NET_SALARY, UNKNOWN.',
    '',
    '========================================',
    'COMPANY RULES',
    '========================================',
    '',
    'Only identify the requested company from supplied evidence.',
    'Do not invent company size.',
    'Do not invent official website.',
    'LinkedIn and Facebook are not official corporate websites.',
    '',
    '========================================',
    'EMPLOYEE FEEDBACK RULES',
    '========================================',
    '',
    'Employee feedback must come from actual employee-review evidence.',
    'Recruitment advertisements are NOT employee feedback.',
    'Job vacancies are NOT evidence of positive company culture.',
    'Company expansion announcements are NOT employee reviews.',
    'Training announcements are NOT employee feedback.',
    'Benefits mentioned in a vacancy may be benefit evidence, but NOT employee-review evidence.',
    'Do not infer employee satisfaction from hiring activity.',
    'Do not treat one isolated comment as a repeated company pattern.',
    'When actual employee-review evidence is insufficient, use INSUFFICIENT_PUBLIC_FEEDBACK.',
    '',
    '========================================',
    'BENEFIT RULES',
    '========================================',
    '',
    'Include a benefit only when explicitly supported by supplied evidence.',
    'Official company or direct verified job-ad evidence may support CONFIRMED.',
    'Company social/recruitment posts should generally be LIKELY unless clearly authoritative.',
    'Third-party social posts should not normally be marked CONFIRMED.',
    '',
    '========================================',
    'PUBLIC SEARCH EVIDENCE',
    '========================================',
    '',
    evidenceText

  ].join('\n');
}

/**
 * ============================================================
 * GEMINI OUTPUT SCHEMA
 * ============================================================
 */

function getCompanyXRaySchema_() {

  return {
    type: 'object',
    additionalProperties: false,

    properties: {

      company: {
        type: 'object',
        additionalProperties: false,
        properties: {
          identity_status: {
            type: 'string',
            enum: ['CONFIRMED', 'LIKELY', 'AMBIGUOUS', 'NOT_FOUND']
          },
          confidence_score: {
            type: 'integer',
            minimum: 0,
            maximum: 100
          },
          canonical_name: {
            type: ['string', 'null']
          },
          aliases: {
            type: 'array',
            items: { type: 'string' }
          },
          country: {
            type: ['string', 'null']
          },
          industry: {
            type: ['string', 'null']
          },
          company_size_range: {
            type: ['string', 'null']
          },
          main_location: {
            type: ['string', 'null']
          },
          official_website: {
            type: ['string', 'null']
          },
          evidence_ids: {
            type: 'array',
            items: { type: 'integer' }
          },
          notes: {
            type: 'string'
          }
        },
        required: [
          'identity_status',
          'confidence_score',
          'canonical_name',
          'aliases',
          'country',
          'industry',
          'company_size_range',
          'main_location',
          'official_website',
          'evidence_ids',
          'notes'
        ]
      },

      salary_evidence: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            evidence_id: { type: 'integer' },
            role_title: { type: ['string', 'null'] },
            role_match: {
              type: 'string',
              enum: ['EXACT', 'CLOSE', 'BROAD', 'MISMATCH']
            },
            seniority_match: {
              type: 'string',
              enum: ['EXACT', 'CLOSE', 'UNKNOWN', 'MISMATCH']
            },
            company_specific: { type: 'boolean' },
            company_name: { type: ['string', 'null'] },
            min_salary: { type: ['number', 'null'] },
            max_salary: { type: ['number', 'null'] },
            currency: { type: ['string', 'null'] },
            period: {
              type: 'string',
              enum: ['MONTHLY', 'ANNUAL', 'DAILY', 'HOURLY', 'UNKNOWN']
            },
            pay_basis: {
              type: 'string',
              enum: [
                'BASE_SALARY',
                'GROSS_SALARY',
                'TOTAL_COMPENSATION',
                'NET_SALARY',
                'UNKNOWN'
              ]
            },
            location: { type: ['string', 'null'] },
            explicit_numeric_salary: { type: 'boolean' },
            confidence_score: {
              type: 'integer',
              minimum: 0,
              maximum: 100
            },
            notes: { type: 'string' }
          },
          required: [
            'evidence_id',
            'role_title',
            'role_match',
            'seniority_match',
            'company_specific',
            'company_name',
            'min_salary',
            'max_salary',
            'currency',
            'period',
            'pay_basis',
            'location',
            'explicit_numeric_salary',
            'confidence_score',
            'notes'
          ]
        }
      },

      benefits: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            benefit: { type: 'string' },
            verification: {
              type: 'string',
              enum: ['CONFIRMED', 'LIKELY', 'UNVERIFIED']
            },
            evidence_ids: {
              type: 'array',
              items: { type: 'integer' }
            }
          },
          required: [
            'benefit',
            'verification',
            'evidence_ids'
          ]
        }
      },

      feedback: {
        type: 'object',
        additionalProperties: false,
        properties: {
          status: {
            type: 'string',
            enum: [
              'COMPLETED',
              'LIMITED',
              'INSUFFICIENT_PUBLIC_FEEDBACK'
            ]
          },
          overall_signal: {
            type: 'string',
            enum: ['POSITIVE', 'MIXED', 'NEGATIVE', 'INSUFFICIENT']
          },
          confidence_score: {
            type: 'integer',
            minimum: 0,
            maximum: 100
          },
          positive_themes: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                theme: { type: 'string' },
                summary: { type: 'string' },
                evidence_ids: {
                  type: 'array',
                  items: { type: 'integer' }
                }
              },
              required: ['theme', 'summary', 'evidence_ids']
            }
          },
          negative_themes: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                theme: { type: 'string' },
                summary: { type: 'string' },
                evidence_ids: {
                  type: 'array',
                  items: { type: 'integer' }
                }
              },
              required: ['theme', 'summary', 'evidence_ids']
            }
          },
          categories: {
            type: 'object',
            additionalProperties: false,
            properties: {
              management: { type: 'string' },
              compensation_benefits: { type: 'string' },
              career_growth: { type: 'string' },
              work_environment: { type: 'string' },
              work_life_balance: { type: 'string' },
              recruitment_interview: { type: 'string' }
            },
            required: [
              'management',
              'compensation_benefits',
              'career_growth',
              'work_environment',
              'work_life_balance',
              'recruitment_interview'
            ]
          },
          repeated_signals: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                signal: { type: 'string' },
                direction: {
                  type: 'string',
                  enum: ['POSITIVE', 'NEGATIVE', 'MIXED']
                },
                strength: {
                  type: 'string',
                  enum: ['WEAK', 'MODERATE', 'STRONG']
                },
                evidence_ids: {
                  type: 'array',
                  items: { type: 'integer' }
                }
              },
              required: [
                'signal',
                'direction',
                'strength',
                'evidence_ids'
              ]
            }
          },
          limitations: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: [
          'status',
          'overall_signal',
          'confidence_score',
          'positive_themes',
          'negative_themes',
          'categories',
          'repeated_signals',
          'limitations'
        ]
      }
    },

    required: [
      'company',
      'salary_evidence',
      'benefits',
      'feedback'
    ]
  };
}


/**
 * ============================================================
 * DIRECT SALARY EXTRACTION FROM SERPER SNIPPETS
 * ============================================================
 */

function extractSalaryEvidenceFromSearchSnippets_(
  request,
  evidence,
  targetSeniority
) {

  if (!request.jobTitle || !Array.isArray(evidence)) {
    return [];
  }

  const results = [];
  const roleTokens = getXRayTokens_(request.jobTitle);
  const companyTokens = getXRayTokens_(request.company);

  const targetIsTrainingRole = /\b(intern|internship|trainee|training)\b/i.test(
    String(request.jobTitle || '')
  );

  evidence.forEach(function(source) {

    const text = [
      source.title || '',
      source.snippet || ''
    ].join(' ');

    const normalized = normalizeXRayText_(text);

    /** Must contain an Egyptian currency signal. */
    if (!/(\bEGP\b|\bLE\b|L\.E\.|E£|جنيه|جنيه مصري)/i.test(text)) {
      return;
    }

    /** Never treat training / internship stipends as a normal salary. */
    if (
      !targetIsTrainingRole &&
      /(internship|intern|trainee|training|stipend|مكافأة|تدريب)/i.test(text)
    ) {
      return;
    }

    /** Role relevance. */
    let matchedRoleTokens = 0;

    roleTokens.forEach(function(token) {
      if (normalized.indexOf(token) !== -1) {
        matchedRoleTokens++;
      }
    });

    if (roleTokens.length && matchedRoleTokens === 0) {
      return;
    }

    const roleRatio = roleTokens.length
      ? matchedRoleTokens / roleTokens.length
      : 0;

    let roleMatch = 'MISMATCH';

    if (roleTokens.length && matchedRoleTokens === roleTokens.length) {
      roleMatch = 'EXACT';
    } else if (roleRatio >= 0.67) {
      roleMatch = 'CLOSE';
    }

    if (roleMatch === 'MISMATCH') {
      return;
    }

    /**
     * Detect seniority from the actual evidence text.
     * This prevents Senior / Manager salary snippets from entering
     * a Junior / Entry-level benchmark.
     */
    const evidenceSeniority = inferEvidenceSeniorityFromText_(text);
    const seniorityMatch = compareSalarySeniority_(
      targetSeniority,
      evidenceSeniority
    );

    if (seniorityMatch === 'MISMATCH') {
      return;
    }

    /**
     * Extract a salary value that is explicitly bound to its period.
     * If a snippet contains both annual and monthly figures, the
     * monthly figure is preferred and the annual number is NOT
     * accidentally treated as monthly.
     */
    const parsedSalary = extractPeriodBoundSalary_(text);

    if (!parsedSalary) {
      return;
    }

    const minSalary = parsedSalary.min;
    const maxSalary = parsedSalary.max;
    const period = parsedSalary.period;

    if (
      !Number.isFinite(minSalary) ||
      !Number.isFinite(maxSalary) ||
      minSalary <= 0 ||
      maxSalary <= 0
    ) {
      return;
    }

    /** Determine whether company name also appears in the evidence. */
    let matchedCompanyTokens = 0;

    companyTokens.forEach(function(token) {
      if (normalized.indexOf(token) !== -1) {
        matchedCompanyTokens++;
      }
    });

    const companySpecific = (
      String(source.module || '').indexOf('salary_company') !== -1 &&
      companyTokens.length > 0 &&
      matchedCompanyTokens / companyTokens.length >= 0.5
    );

    results.push({
      evidence_id: source.evidenceId,
      role_title: request.jobTitle,
      role_match: roleMatch,
      seniority_match: seniorityMatch,
      company_specific: companySpecific,
      company_name: companySpecific ? request.company : null,
      min_salary: minSalary,
      max_salary: maxSalary,
      currency: 'EGP',
      period: period,
      pay_basis: /\b(gross|gross salary|إجمالي)\b/i.test(text)?'GROSS_SALARY':
        /\b(basic|base salary|أساسي)\b/i.test(text)?'BASE_SALARY':
        /\b(net|take.home|صافي)\b/i.test(text)?'NET_SALARY':
        /total compensation|total cash|إجمالي التعويضات/i.test(text)?'TOTAL_COMPENSATION':'UNKNOWN',
      location: request.city || request.country || null,
      explicit_numeric_salary: true,
      confidence_score: getSnippetSalaryConfidence_(source, roleMatch),
      notes: 'Direct salary extracted from an explicit public search snippet with salary period matched to the number.'
    });
  });

  return results;
}


/**
 * ============================================================
 * PERIOD-BOUND SALARY PARSER
 * ============================================================
 *
 * The parser only accepts a number/range when the pay period is
 * directly attached to that amount.
 *
 * Examples handled safely:
 * - Salary: 20,000 to 25,000 EGP per month
 * - EGP 20,000 - 25,000 monthly
 * - EGP 5,482 per year, EGP 457 per month
 *
 * In the last example, 457 MONTHLY is selected. 5,482 is never
 * mislabeled as a monthly salary.
 */
function extractPeriodBoundSalary_(text) {

  text = String(text || '');

  const amount = '(\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?|\\d{1,7}(?:\\.\\d+)?|\\d+(?:\\.\\d+)?\\s*[kK])';
  const currency = '(?:EGP|LE|L\\.E\\.|E£|جنيه(?:\\s+مصري)?)';
  const separator = '(?:-|–|—|to|إلى|الي)';
  const month = '(?:per\\s+month|monthly|\\/\\s*month|a\\s+month|شهري|شهريا|شهرياً)';
  const year = '(?:per\\s+year|annual|annually|yearly|\\/\\s*year|a\\s+year|سنوي|سنويا|سنوياً)';

  /** Monthly range patterns are checked first. */
  const monthlyRangePatterns = [
    new RegExp(amount + '\\s*' + separator + '\\s*' + amount + '\\s*' + currency + '\\s*' + month, 'i'),
    new RegExp(currency + '\\s*' + amount + '\\s*' + separator + '\\s*' + amount + '\\s*' + month, 'i'),
    new RegExp(currency + '\\s*' + amount + '\\s*' + separator + '\\s*' + currency + '?\\s*' + amount + '\\s*' + month, 'i'),
    new RegExp(amount + '\\s*' + currency + '\\s*' + separator + '\\s*' + amount + '\\s*' + currency + '?\\s*' + month, 'i')
  ];

  const monthlyRange = matchSalaryRangePatterns_(
    text,
    monthlyRangePatterns,
    'MONTHLY'
  );

  if (monthlyRange) {
    return monthlyRange;
  }

  /** Explicit single monthly values. */
  const monthlySinglePatterns = [
    new RegExp(currency + '\\s*' + amount + '\\s*' + month, 'i'),
    new RegExp(amount + '\\s*' + currency + '\\s*' + month, 'i')
  ];

  const monthlySingle = matchSalarySinglePatterns_(
    text,
    monthlySinglePatterns,
    'MONTHLY'
  );

  if (monthlySingle) {
    return monthlySingle;
  }

  /** Annual range patterns. */
  const annualRangePatterns = [
    new RegExp(amount + '\\s*' + separator + '\\s*' + amount + '\\s*' + currency + '\\s*' + year, 'i'),
    new RegExp(currency + '\\s*' + amount + '\\s*' + separator + '\\s*' + amount + '\\s*' + year, 'i'),
    new RegExp(currency + '\\s*' + amount + '\\s*' + separator + '\\s*' + currency + '?\\s*' + amount + '\\s*' + year, 'i'),
    new RegExp(amount + '\\s*' + currency + '\\s*' + separator + '\\s*' + amount + '\\s*' + currency + '?\\s*' + year, 'i')
  ];

  const annualRange = matchSalaryRangePatterns_(
    text,
    annualRangePatterns,
    'ANNUAL'
  );

  if (annualRange) {
    return annualRange;
  }

  /** Explicit single annual values. */
  const annualSinglePatterns = [
    new RegExp(currency + '\\s*' + amount + '\\s*' + year, 'i'),
    new RegExp(amount + '\\s*' + currency + '\\s*' + year, 'i')
  ];

  return matchSalarySinglePatterns_(
    text,
    annualSinglePatterns,
    'ANNUAL'
  );
}


function matchSalaryRangePatterns_(text, patterns, period) {

  for (let i = 0; i < patterns.length; i++) {

    const match = String(text || '').match(patterns[i]);

    if (!match) {
      continue;
    }

    const amounts = getParsedAmountsFromRegexMatch_(match);

    if (amounts.length >= 2) {
      return {
        min: Math.min(amounts[0], amounts[1]),
        max: Math.max(amounts[0], amounts[1]),
        period: period
      };
    }
  }

  return null;
}


function matchSalarySinglePatterns_(text, patterns, period) {

  for (let i = 0; i < patterns.length; i++) {

    const match = String(text || '').match(patterns[i]);

    if (!match) {
      continue;
    }

    const amounts = getParsedAmountsFromRegexMatch_(match);

    if (amounts.length >= 1) {
      return {
        min: amounts[0],
        max: amounts[0],
        period: period
      };
    }
  }

  return null;
}


function getParsedAmountsFromRegexMatch_(match) {

  const amounts = [];

  for (let i = 1; i < match.length; i++) {

    if (match[i] === undefined || match[i] === null) {
      continue;
    }

    const parsed = parseSalaryAmount_(match[i]);

    if (Number.isFinite(parsed)) {
      amounts.push(parsed);
    }
  }

  return amounts;
}


function parseSalaryAmount_(value) {

  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value)
    .trim()
    .replace(/,/g, '');

  if (!text) {
    return null;
  }

  if (/k$/i.test(text.replace(/\s+/g, ''))) {
    const compact = Number(
      text.replace(/\s*[kK]\s*$/, '')
    );

    return Number.isFinite(compact)
      ? compact * 1000
      : null;
  }

  const number = Number(text);

  return Number.isFinite(number)
    ? number
    : null;
}


/**
 * ============================================================
 * EVIDENCE SENIORITY DETECTION
 * ============================================================
 */
function inferEvidenceSeniorityFromText_(text) {

  const normalized = normalizeXRayText_(text);

  if (/\b(director|head|chief|vice president|vp)\b/i.test(normalized)) {
    return 'HEAD_DIRECTOR';
  }

  if (/\bmanager\b/i.test(normalized)) {
    return 'MANAGER';
  }

  if (/\b(senior|sr|lead|supervisor)\b/i.test(normalized)) {
    return 'SENIOR';
  }

  if (/\b(junior|jr)\b/i.test(normalized)) {
    return 'JUNIOR';
  }

  if (/\b(intern|internship|trainee|training)\b/i.test(normalized)) {
    return 'ENTRY';
  }

  return 'UNKNOWN';
}


function compareSalarySeniority_(targetSeniority, evidenceSeniority) {

  const target = String(targetSeniority || 'UNKNOWN').toUpperCase();
  const evidence = String(evidenceSeniority || 'UNKNOWN').toUpperCase();

  if (target === 'UNKNOWN' || evidence === 'UNKNOWN') {
    return 'UNKNOWN';
  }

  if (target === evidence) {
    return 'EXACT';
  }

  const levels = {
    ENTRY: 1,
    JUNIOR: 2,
    MID: 3,
    SENIOR: 4,
    MANAGER: 5,
    HEAD_DIRECTOR: 6
  };

  if (!levels[target] || !levels[evidence]) {
    return 'UNKNOWN';
  }

  const difference = Math.abs(levels[target] - levels[evidence]);

  /** Adjacent levels may be used with a reduced weight. */
  if (difference === 1) {
    return 'CLOSE';
  }

  return 'MISMATCH';
}


/**
 * Keep the previous generic range helper for compatibility with
 * any internal calls. It now delegates to the safe period parser.
 */
function extractNumericSalaryRange_(text) {

  const parsed = extractPeriodBoundSalary_(text);

  if (!parsed) {
    return null;
  }

  return {
    min: parsed.min,
    max: parsed.max
  };
}


function getSnippetSalaryConfidence_(source, roleMatch) {

  let score = 50;

  if (roleMatch === 'EXACT') {
    score += 15;
  }

  if (source.sourceType === 'SALARY_PLATFORM') {
    score += 15;
  }

  if (source.sourceType === 'JOB_BOARD') {
    score += 12;
  }

  if (source.sourceType === 'EMPLOYEE_REVIEW') {
    score += 8;
  }

  if (source.sourceType === 'SOCIAL_MEDIA') {
    score -= 20;
  }

  if (source.sourceType === 'UNKNOWN') {
    score -= 10;
  }

  return Math.max(25, Math.min(90, score));
}


function mergeSalaryEvidence_(geminiEvidence, snippetEvidence) {

  const combined = []
    .concat(geminiEvidence || [])
    .concat(snippetEvidence || []);

  const map = {};

  combined.forEach(function(item) {

    const key = [
      Number(item.evidence_id || 0),
      Number(item.min_salary || 0),
      Number(item.max_salary || 0),
      String(item.period || '').toUpperCase()
    ].join('|');

    if (!map[key]) {
      map[key] = item;
      return;
    }

    if (
      Number(item.confidence_score || 0) >
      Number(map[key].confidence_score || 0)
    ) {
      map[key] = item;
    }
  });

  return Object.keys(map).map(function(key) {
    return map[key];
  });
}


/**
 * ============================================================
 * FINAL NORMALIZATION
 * ============================================================
 */

function normalizeCompanyXRayResult_(
  request,
  data,
  evidence,
  targetSeniority
) {

  data = data || {};

  const company = data.company || {};
  const companyIds=(Array.isArray(company.evidence_ids)?company.evidence_ids:[]).map(Number);
  const validCompanySources=evidence.filter(function(x){
    return companyIds.indexOf(Number(x.evidenceId))>=0 &&
      xrCompanyMatch_(request,x) && /^https:\/\//i.test(x.url||'');
  });
  // Only claimed company details that have a real, matching source survive.
  if(!validCompanySources.length) {
    company.identity_status='AMBIGUOUS';
    company.official_website=null;
    company.company_size_range=null;
    company.main_location=null;
    company.industry=null;
    company.confidence_score=null;
    company.notes='Company identity and corporate facts are not backed by traceable evidence.';
  } else if(company.official_website) {
    const officialDomain=getXRayDomain_(company.official_website);
    if(!validCompanySources.some(function(x){return x.domain===officialDomain;}))
      company.official_website=null;
  }

  company.confidence_score=null; // No statistical respondent sample supports a percentage.
  if(validCompanySources.length){
    const hasOfficial=validCompanySources.some(function(x){return x.sourceType==='OFFICIAL';});
    if(!hasOfficial&&company.identity_status==='CONFIRMED')company.identity_status='LIKELY';
    ['company_size_range','main_location','industry'].forEach(function(k){
      const value=normalizeXRayText_(String(company[k]||'')).trim();
      if(value && !validCompanySources.some(function(src){
        return normalizeXRayText_([src.title||'',src.snippet||''].join(' ')).indexOf(value)>=0;
      }))company[k]=null;
    });
  }

  const feedback = normalizeEmployeeFeedback_(
    data.feedback,
    evidence,
    request.company
  );

  const salary = buildDeterministicSalaryResult_(
    request,
    company,
    data.salary_evidence || [],
    data.benefits || [],
    evidence,
    targetSeniority
  );

  const combinedForSources = {
    company: company,
    salary: salary,
    feedback: feedback
  };

  const usedIds = collectCompanyXRayEvidenceIds_(
    combinedForSources
  );

  const evidenceMap = {};

  evidence.forEach(function(item) {
    evidenceMap[Number(item.evidenceId)] = item;
  });

  const uniqueIds = evidence.map(function(s){return Number(s.evidenceId);});

  const sources = uniqueIds.map(function(id) {

    const source = evidenceMap[id];

    return {
      id: source.evidenceId,
      title: source.title,
      url: source.url,
      domain: source.domain,
      sourceType: source.sourceType,
      date: source.date,
      snippet: source.snippet
    };
  });

  return {
    company: company,
    salary: salary,
    feedback: feedback,
    sources: sources
  };
}


/**
 * ============================================================
 * EMPLOYEE FEEDBACK NORMALIZATION
 * ============================================================
 */

function normalizeEmployeeFeedback_(rawFeedback,evidence,requestedCompany){
  const empty=createEmptyFeedback_();
  if(!rawFeedback||!Array.isArray(evidence))return empty;
  const map={};evidence.forEach(function(x){map[Number(x.evidenceId)]=x;});
  const independent=new Set();
  function trueReview(id){
    const s=map[Number(id)];
    if(!s||s.sourceType!=='EMPLOYEE_REVIEW')return false;
    const text=[s.title||'',s.snippet||''].join(' ');
    if(!/review|employee|working at|management|culture|مراجعة|العمل|موظف/i.test(text))return false;
    const sn=String(s.snippet||'').trim();
    if(sn.length<55 || !/pros|cons|worked|working|management|salary|culture|موظف|إدارة|بيئة العمل|مزايا|عيوب/i.test(sn))
      return false; // A review landing page title alone is not an actual review.
    if(requestedCompany&&!xrCompanyMatch_({company:requestedCompany},s))return false;
    if(!/^https:\/\//i.test(s.url||''))return false;
    independent.add(normalizeXRayUrl_(s.url));
    return true;
  }
  function themes(items){
    return (Array.isArray(items)?items:[]).map(function(x){
      const ids=(Array.isArray(x.evidence_ids)?x.evidence_ids:[]).map(Number).filter(trueReview);
      if(!ids.length)return null;
      const snippets=ids.map(function(id){return String(map[id].snippet||'').trim();}).filter(Boolean);
      return {theme:String(x.theme||''),summary:snippets.slice(0,2).join(' | ').slice(0,550),
        evidence_ids:Array.from(new Set(ids)),evidence_basis:'DIRECT_SOURCE_SNIPPET'};
    }).filter(Boolean);
  }
  const positive=themes(rawFeedback.positive_themes);
  const negative=themes(rawFeedback.negative_themes);
  const signals=(Array.isArray(rawFeedback.repeated_signals)?rawFeedback.repeated_signals:[]).map(function(x){
    const ids=(Array.isArray(x.evidence_ids)?x.evidence_ids:[]).map(Number).filter(trueReview);
    // One review page is never a repeated pattern.
    if(new Set(ids).size<2)return null;
    return {signal:String(x.signal||''),direction:String(x.direction||'MIXED'),strength:'WEAK',evidence_ids:Array.from(new Set(ids))};
  }).filter(Boolean);
  if(independent.size<2)return empty;
  return {
    status:'LIMITED',
    overall_signal:'MIXED', // No representative employee survey: no company-wide conclusion.
    confidence_score:null, // No known respondent sample to support a percentage.
    positive_themes:positive,negative_themes:negative,
    categories:empty.categories,repeated_signals:signals,
    source_pages:independent.size,
    limitations:['PUBLIC REVIEW EXCERPTS ONLY — not an employee sentiment survey.',
      'Sample size, respondent identity and representativeness are not verifiable.',
      'A repeated pattern requires independent review URLs; company-wide rating is not estimated.']
  };
}


/**
 * ============================================================
 * DETERMINISTIC SALARY ENGINE
 * ============================================================
 */

function buildDeterministicSalaryResult_(request,company,rawSalaryEvidence,benefits,publicEvidence,targetSeniority){
  if(!request.jobTitle)return createNotRequestedSalary_();
  const em={};(publicEvidence||[]).forEach(function(x){em[Number(x.evidenceId)]=x;});
  const currency=getTargetSalaryCurrency_(request,rawSalaryEvidence||[]);
  const accepted=[],rejected=[];
  (rawSalaryEvidence||[]).forEach(function(x){
    const v=normalizeSalaryEvidenceItem_(x,em,currency,targetSeniority,request);
    if(v.accepted)accepted.push(v.item);
    else rejected.push({evidenceId:Number(x.evidence_id||0),reason:v.reason});
  });
  // Only employer-authored, directly referenced offers can be called a
  // company-specific observed range. NEVER infer from employer headcount.
  const companyPoints=accepted.filter(function(x){
    return x.companySpecific&&x.sourceFresh&&x.locationVerified&&
      ['GROSS_SALARY','BASE_SALARY'].includes(x.payBasis);
  });
  const companyBuckets=xrSalaryEvidenceCategories_(companyPoints);
  const companyKeys=Object.keys(companyBuckets).filter(function(k){return companyBuckets[k].length;});
  const confirmedCompany=(companyKeys.length===1)?
    buildConfirmedCompanySalary_(companyBuckets[companyKeys[0]],currency):
    buildConfirmedCompanySalary_([],currency);
  const comparison=accepted.filter(function(x){
    return x.sourceFresh && x.locationVerified &&
      ['GROSS_SALARY','BASE_SALARY'].includes(x.payBasis) &&
      ['EXACT','CLOSE'].includes(x.roleMatch) && x.seniorityMatch!=='MISMATCH' &&
      !['SOCIAL_MEDIA','UNKNOWN','EMPLOYEE_REVIEW'].includes(x.sourceType);
  });
  const uniqueComparisons=[],sourceKeys={};
  comparison.forEach(function(x){
    const k=normalizeXRayUrl_(x.url)+'|'+x.payBasis;
    if(sourceKeys[k]){
      // Same source+pay basis must not count twice as independent salary evidence.
      // If amounts conflict, exclude this page entirely until corroborated.
      const old=sourceKeys[k];
      if(old.monthlyMin!==x.monthlyMin||old.monthlyMax!==x.monthlyMax)old.conflict=true;
      return;
    }
    sourceKeys[k]=x;uniqueComparisons.push(x);
  });
  const cleanComparisons=uniqueComparisons.filter(function(x){return !x.conflict;});
  const payBuckets=xrSalaryEvidenceCategories_(cleanComparisons);
  let candidates=[],benchmark=null,basisUsed=null;
  for(const b of ['GROSS_SALARY','BASE_SALARY']){
    const pts=payBuckets[b]||[];
    const domains=xrIndependentSourceCount_(pts);
    if(pts.length>=COMPANY_XRAY_MIN_MARKET_POINTS_ && domains>=XR_MIN_DISTINCT_PUBLISHERS_ &&
        pts.length>candidates.length){candidates=pts;basisUsed=b;}
  }
  // The exact observed published values are not adjusted, synthesized or given
  // percentile labels. If data are insufficient, return null—not guessed pay.
  if(candidates.length)benchmark=calculateCoreMarketBenchmark_(candidates,currency);
  const comparableIds=new Set(candidates.map(function(x){return x.evidenceId;}));
  // An observed salary signal is not "rejected" merely because there
  // are too few comparable observations for a published market band.
  accepted.forEach(function(x){x.benchmarkSelected=Boolean(benchmark&&comparableIds.has(x.evidenceId));});
  const quality=benchmark?'INDICATIVE_PUBLIC_EVIDENCE':'INSUFFICIENT_COMPARABLE_EVIDENCE';
  const sourceDates=candidates.map(function(x){return x.sourceDate;}).filter(Boolean);
  const ledger=xrEvidenceLedger_(accepted,rejected,em);
  const notes=[
    'PUBLIC EVIDENCE, NOT A SALARY SURVEY. P25/P50/P75 require survey microdata and a documented representative methodology.',
    'No automatic -15% market discount, synthetic +/-10% spread, company-size pay uplift or unsupported salary-offer predictions.',
    'Salary types (GROSS, BASE, NET and TOTAL CASH) are not mixed.',
    'Only traceable HTTPS sources with explicit numeric amount and period are accepted; unmatched AI-extracted numbers are rejected.',
    'Comparative range requires at least 3 fresh matched references from at least 2 publisher domains with the SAME pay basis and a verified city.',
    'Unknown and older-than-18-month publication dates cannot qualify for a current salary range.',
    'A research result cannot prove employer payroll figures, statistical confidence or representative employee sentiment.',
    'Source dates are publication/update metadata when provided by search; they are not independently certified collection dates.'
  ];
  if(!benchmark)notes.push('Insufficient independent, current, local, comparable public evidence: no numeric market benchmark issued.');
  if(!confirmedCompany.available)notes.push('No directly evidenced company-specific salary for this role.');
  return {
    status:benchmark||confirmedCompany.available?'COMPLETED':'INSUFFICIENT_DATA',
    target_role:request.jobTitle,inferred_seniority:targetSeniority!=='UNKNOWN'?targetSeniority:null,currency:currency,
    confirmed_company_salary:confirmedCompany,
    market_range:{min:benchmark?benchmark.min:null,max:benchmark?benchmark.max:null,period:benchmark?'monthly':null,
      evidence_ids:benchmark?candidates.map(function(x){return x.evidenceId;}):[],
      pay_basis:basisUsed,label:benchmark?'INDICATIVE_PUBLIC_RANGE':'INSUFFICIENT_EVIDENCE',
      survey_classification:'NOT_A_STATISTICAL_SURVEY',p25:null,p50:null,p75:null},
    estimated_company_range:{min:null,max:null,period:null,evidence_ids:[],note:'NOT CALCULATED: employer size cannot justify a pay multiplier.'},
    most_probable_offer:{min:null,max:null,period:null,note:'NOT ESTIMATED: no verified actual company offer distribution.'},
    strong_candidate_range:{min:null,max:null,period:null,note:'NOT ESTIMATED: requires approved competency and internal pay data.'},
    benefits:normalizeSalaryBenefits_(benefits||[],em),
    confidence_score:null,evidence_grade:quality,
    methodology_notes:notes,
    evidence_ledger:ledger,
    source_date_span:{earliest:sourceDates.length?sourceDates.sort()[0]:null,latest:sourceDates.length?sourceDates.sort().slice(-1)[0]:null},
    survey_statistics:xrStrictSurveyStatus_(candidates),
    diagnostics:{
      acceptedEvidenceCount:benchmark?candidates.length:0,
      observedEvidenceCount:accepted.length,rejectedEvidenceCount:rejected.length,
      totalExtractedSalaryEvidence:(rawSalaryEvidence||[]).length,
      independentPublishers:benchmark?xrIndependentSourceCount_(candidates):0,
      observed_public_range:benchmark?{min:benchmark.min,max:benchmark.max,currency:currency,period:'monthly'}:null,
      marketAdjustmentPercent:0,marketAdjustmentFactor:1,
      raw_market_benchmark:benchmark?{min:benchmark.min,max:benchmark.max,median:null,currency:currency,period:'monthly'}:null,
      adjusted_market_benchmark:null,companyAdjustmentPercent:0,rejectedEvidence:rejected,
      requireRepresentativeSurveyForPercentiles:true
    }
  };
}


/**
 * ============================================================
 * SALARY EVIDENCE NORMALIZATION
 * ============================================================
 */

function normalizeSalaryEvidenceItem_(item,evidenceMap,targetCurrency,targetSeniority,request){
  item=item||{};request=request||{};
  const id=Number(item.evidence_id||0),source=evidenceMap[id];
  const reject=function(reason){return {accepted:false,reason:reason};};
  if(!source||!/^https:\/\//i.test(source.url||''))return reject('UNVERIFIED_OR_INVALID_URL');
  if(item.explicit_numeric_salary!==true)return reject('NO_EXPLICIT_NUMERIC_SALARY');
  const match=String(item.role_match||'MISMATCH').toUpperCase();
  if(match!=='EXACT'&&match!=='CLOSE')return reject('ROLE_MISMATCH');
  const roleTokens=getXRayTokens_(request.jobTitle||'');
  const original=normalizeXRayText_([source.title||'',source.snippet||''].join(' '));
  const matched=roleTokens.filter(function(x){return original.indexOf(x)>=0;});
  if(!roleTokens.length || matched.length/roleTokens.length<0.75)
    return reject('ROLE_NOT_VERIFIABLE_IN_ORIGINAL_SOURCE');
  const txt=[source.title||'',source.snippet||'',item.role_title||''].join(' ');
  const seniorityDetected=inferEvidenceSeniorityFromText_(txt);
  const seniorityMatch=seniorityDetected==='UNKNOWN'?
    String(item.seniority_match||'UNKNOWN').toUpperCase():
    compareSalarySeniority_(targetSeniority,seniorityDetected);
  if(seniorityMatch==='MISMATCH')return reject('SENIORITY_MISMATCH');
  const currency=normalizeCurrencyCode_(item.currency);
  if(currency!==targetCurrency)return reject('CURRENCY_MISMATCH');
  if(!xrSalaryExtractMatches_(item,source))return reject('AMOUNT_NOT_VERIFIABLE_IN_SOURCE_SNIPPET');
  const period=String(item.period||'UNKNOWN').toUpperCase();
  if(period!=='MONTHLY'&&period!=='ANNUAL')return reject('UNKNOWN_PAY_PERIOD');
  const a=Number(item.min_salary),b=Number(item.max_salary);
  if(!(a>0&&b>0))return reject('INVALID_SALARY_NUMBERS');
  const min=Math.min(a,b)/(period==='ANNUAL'?12:1),max=Math.max(a,b)/(period==='ANNUAL'?12:1);
  if(!Number.isFinite(min)||!Number.isFinite(max)||max>10000000)return reject('IMPLAUSIBLE_SALARY_VALUE');
  const floor=getMinimumReasonableMonthlySalary_(currency,request.jobTitle||item.role_title);
  if(floor!==null&&max<floor)return reject('PARSER_SANITY_FLOOR');
  const basis=String(item.pay_basis||'UNKNOWN').toUpperCase();
  const acceptedBasis=['GROSS_SALARY','BASE_SALARY','TOTAL_COMPENSATION','NET_SALARY','UNKNOWN'];
  if(acceptedBasis.indexOf(basis)===-1)return reject('UNKNOWN_PAY_BASIS');
  const isCompany=item.company_specific===true &&
    xrCompanyMatch_(request,source) &&
    (source.sourceType==='OFFICIAL'||source.sourceType==='JOB_BOARD');
  return {accepted:true,item:{
    evidenceId:id,sourceType:source.sourceType||'UNKNOWN',
    url:source.url,title:source.title||'',sourceDate:xrSourceDate_(source.date),
    sourceFresh:xrSalarySourceFresh_(source.date),
    locationVerified:xrRoleGeographyMatch_(request,source),
    roleTitle:item.role_title||null,roleMatch:match,
    seniorityMatch:seniorityMatch,detectedSeniority:seniorityDetected,
    companySpecific:isCompany,companyName:isCompany?request.company:null,
    monthlyMin:min,monthlyMax:max,midpoint:(min+max)/2,currency:currency,
    originalPeriod:period,payBasis:basis,location:item.location||null,
    evidenceConfidence:null,weight:1,
    notes:'Numerical amount, pay period and URL checked against the original search evidence. Date/location/basis evaluated separately.'
  }};
}


function getMinimumReasonableMonthlySalary_(currency, roleTitle) {

  if (currency !== 'EGP') {
    return null;
  }

  const role = normalizeXRayText_(roleTitle);

  /** Training / internship roles use a lower parser floor. */
  if (/\b(intern|internship|trainee|training)\b/i.test(role)) {
    return 1000;
  }

  /**
   * Professional-role parser floor for Egypt.
   * It is deliberately conservative and only rejects obviously
   * corrupted / implausibly tiny values from search snippets.
   */
  return 5000;
}


/**
 * ============================================================
 * SALARY SOURCE WEIGHTS
 * ============================================================
 */

function getSalarySourceWeight_(sourceType) {

  const map = {
    OFFICIAL: 1.00,
    GOVERNMENT: 0.95,
    JOB_BOARD: 0.98,
    SALARY_PLATFORM: 0.75,
    EMPLOYEE_REVIEW: 0.75,
    PROFESSIONAL_NETWORK: 0.70,
    REPUTABLE_MEDIA: 0.60,
    BUSINESS_DIRECTORY: 0.40,
    SOCIAL_MEDIA: 0.28,
    UNKNOWN: 0.22
  };

  return map[sourceType] || 0.22;
}


function getSalaryRoleMatchWeight_(roleMatch) {

  const map = {
    EXACT: 1,
    CLOSE: 0.76,
    BROAD: 0.35,
    MISMATCH: 0
  };

  return map[roleMatch] || 0;
}


function getSalarySeniorityWeight_(match) {

  const map = {
    EXACT: 1,
    CLOSE: 0.85,
    UNKNOWN: 0.65,
    MISMATCH: 0
  };

  return map[match] || 0.65;
}


/**
 * ============================================================
 * CURRENCY
 * ============================================================
 */

function getTargetSalaryCurrency_(request, salaryEvidence) {

  const country = normalizeXRayText_(request.country);

  if (country === 'egypt' || country === 'مصر') {
    return 'EGP';
  }

  const weighted = {};

  (salaryEvidence || []).forEach(function(item) {

    const currency = normalizeCurrencyCode_(item.currency);

    if (!currency) {
      return;
    }

    weighted[currency] = (weighted[currency] || 0) + 1;
  });

  const currencies = Object.keys(weighted);

  if (!currencies.length) {
    return null;
  }

  currencies.sort(function(a, b) {
    return weighted[b] - weighted[a];
  });

  return currencies[0];
}


function normalizeCurrencyCode_(value) {

  const text = String(value || '')
    .trim()
    .toUpperCase();

  if (!text) {
    return null;
  }

  if (
    text === 'EGP' ||
    text === 'LE' ||
    text === 'L.E.' ||
    text === 'E£' ||
    text.indexOf('EGYPT') !== -1 ||
    text.indexOf('جنيه') !== -1
  ) {
    return 'EGP';
  }

  if (text === 'USD' || text === '$') {
    return 'USD';
  }

  if (text === 'SAR') {
    return 'SAR';
  }

  if (text === 'AED') {
    return 'AED';
  }

  return text;
}


/**
 * ============================================================
 * CONFIRMED COMPANY SALARY
 * ============================================================
 *
 * Never altered by a made-up market discount.
 */

function buildConfirmedCompanySalary_(points, currency) {

  if (!points || !points.length) {
    return {
      available: false,
      min: null,
      max: null,
      period: null,
      evidence_ids: [],
      note: 'No verified company-specific salary was publicly disclosed.'
    };
  }

  const mins = points.map(function(item) {
    return item.monthlyMin;
  });

  const maxs = points.map(function(item) {
    return item.monthlyMax;
  });

  return {
    available: true,
    min: roundSalaryAmount_(
      Math.min.apply(null, mins),
      currency
    ),
    max: roundSalaryAmount_(
      Math.max.apply(null, maxs),
      currency
    ),
    period: 'monthly',
    evidence_ids: points.map(function(item) {
      return item.evidenceId;
    }),
    note: 'Public company-specific salary evidence was found.'
  };
}


/**
 * ============================================================
 * OUTLIER FILTER
 * ============================================================
 */

function filterSalaryOutliers_(points) {

  if (!points || points.length <= 2) {
    return {
      accepted: points || [],
      rejected: []
    };
  }

  const midpoints = points
    .map(function(item) {
      return item.midpoint;
    })
    .sort(function(a, b) {
      return a - b;
    });

  const median = simpleMedian_(midpoints);

  const deviations = midpoints
    .map(function(value) {
      return Math.abs(value - median);
    })
    .sort(function(a, b) {
      return a - b;
    });

  const mad = simpleMedian_(deviations);
  const accepted = [];
  const rejected = [];

  points.forEach(function(item) {

    let isOutlier = false;

    if (mad > 0) {

      const robustZ = (
        0.6745 *
        Math.abs(item.midpoint - median)
      ) / mad;

      if (robustZ > 3.5) {
        isOutlier = true;
      }

    } else {

      if (
        item.midpoint < median * 0.55 ||
        item.midpoint > median * 1.8
      ) {
        isOutlier = true;
      }
    }

    if (isOutlier) {
      rejected.push(item);
    } else {
      accepted.push(item);
    }
  });

  if (accepted.length < 1) {
    return {
      accepted: points,
      rejected: []
    };
  }

  return {
    accepted: accepted,
    rejected: rejected
  };
}


/**
 * ============================================================
 * CORE MARKET BENCHMARK
 * ============================================================
 *
 * One strong source is allowed with LOW confidence.
 * Weak single sources are rejected.
 *
 * Evidence-only comparative range: no market multiplier or invented percentiles.
 */

function calculateCoreMarketBenchmark_(points,currency){
  if(!Array.isArray(points)||points.length<COMPANY_XRAY_MIN_MARKET_POINTS_)return null;
  if(xrIndependentSourceCount_(points)<XR_MIN_DISTINCT_PUBLISHERS_)return null;
  if(points.some(function(x){
   return !x.sourceFresh||!x.locationVerified||
     (x.payBasis!=='GROSS_SALARY'&&x.payBasis!=='BASE_SALARY');
  }))return null;
  const bases=new Set(points.map(function(x){return x.payBasis;}));
  if(bases.size!==1)return null;
  const mins=points.map(function(x){return x.monthlyMin;});
  const maxs=points.map(function(x){return x.monthlyMax;});
  const low=Math.min.apply(null,mins),high=Math.max.apply(null,maxs);
  if(!(low>0&&high>=low))return null;
  return {min:roundSalaryAmount_(low,currency),max:roundSalaryAmount_(high,currency),
    median:null,rawMarketMin:roundSalaryAmount_(low,currency),
    rawMarketMax:roundSalaryAmount_(high,currency),rawMarketMedian:null,
    adjustmentPercent:0,adjustmentFactor:1,singleSourceBenchmark:false,
    methodology:'OBSERVED_INDICATIVE_RANGE_NOT_A_STATISTICAL_SURVEY',
    payBasis:points[0].payBasis,observationCount:points.length,
    independentPublishers:xrIndependentSourceCount_(points),
    p25:null,p50:null,p75:null};
}

/**
 * ============================================================
 * COMPANY ADJUSTMENT
 * ============================================================
 *
 * Legacy company multiplier is disabled in v3.
 * Maximum uplift = +5%.
 */

function getCompanySalaryAdjustment_(company){return 0;}


function buildEstimatedCompanyRange_(benchmark,adjustment,currency){return null;}


function buildMostProbableOffer_(benchmark,companyRange,currency){return null;}


function buildStrongCandidateRange_(benchmark,companyRange,probableOffer,currency){return null;}


/**
 * ============================================================
 * OBSERVED PUBLIC RANGE
 * ============================================================
 */

function buildObservedSalaryRange_(points, currency) {

  if (!points || !points.length) {
    return {
      min: null,
      max: null,
      currency: currency,
      period: 'monthly'
    };
  }

  const lows = points.map(function(item) {
    return item.monthlyMin;
  });

  const highs = points.map(function(item) {
    return item.monthlyMax;
  });

  return {
    min: roundSalaryAmount_(
      Math.min.apply(null, lows),
      currency
    ),
    max: roundSalaryAmount_(
      Math.max.apply(null, highs),
      currency
    ),
    currency: currency,
    period: 'monthly'
  };
}


/**
 * ============================================================
 * SALARY CONFIDENCE
 * ============================================================
 */

function calculateSalaryConfidence_(points,confirmedCompanyPoints){return null; /* Unsupported statistical confidence percentage */}


/**
 * ============================================================
 * BENEFITS
 * ============================================================
 */

function normalizeSalaryBenefits_(benefits,evidenceMap){
  if(!Array.isArray(benefits))return [];
  return benefits.map(function(x){
    const label=String(x.benefit||'').trim();
    if(!label)return null;
    const ids=(Array.isArray(x.evidence_ids)?x.evidence_ids:[]).map(Number).filter(function(id){
      const e=evidenceMap[id];if(!e)return false;
      // Benefit claim must be visible on cited source excerpt, not AI recall.
      const words=getXRayTokens_(label);
      const text=normalizeXRayText_([e.title||'',e.snippet||''].join(' '));
      return words.length>0&&words.some(function(w){return text.indexOf(w)>=0;});
    });
    if(!ids.length)return null;
    const direct=ids.some(function(id){return ['OFFICIAL','JOB_BOARD'].includes(evidenceMap[id].sourceType);});
    return {
      benefit:label,verification:direct?'LIKELY':'UNVERIFIED',
      evidence_ids:Array.from(new Set(ids)),
      note:'Benefit phrase appears in cited search excerpt; contract eligibility not independently verified.'
    };
  }).filter(Boolean);
}


/**
 * ============================================================
 * WEIGHTED STATISTICS
 * ============================================================
 */

function weightedSalaryPercentile_(
  points,
  property,
  percentile
) {

  const sorted = points
    .slice()
    .filter(function(item) {
      return Number.isFinite(Number(item[property]));
    })
    .sort(function(a, b) {
      return Number(a[property]) - Number(b[property]);
    });

  if (!sorted.length) {
    return null;
  }

  const totalWeight = sorted.reduce(function(sum, item) {
    return sum + Number(item.weight || 1);
  }, 0);

  const target = totalWeight * percentile;
  let cumulative = 0;

  for (let i = 0; i < sorted.length; i++) {

    cumulative += Number(sorted[i].weight || 1);

    if (cumulative >= target) {
      return Number(sorted[i][property]);
    }
  }

  return Number(
    sorted[sorted.length - 1][property]
  );
}


function simpleMedian_(values) {

  if (!values || !values.length) {
    return 0;
  }

  const sorted = values
    .slice()
    .sort(function(a, b) {
      return a - b;
    });

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2) {
    return sorted[middle];
  }

  return (
    sorted[middle - 1] +
    sorted[middle]
  ) / 2;
}


/**
 * ============================================================
 * SALARY ROUNDING
 * ============================================================
 */

function roundSalaryAmount_(value, currency) {

  if (!Number.isFinite(Number(value))) {
    return null;
  }

  value = Number(value);
  let increment = 100;

  if (currency === 'EGP') {
    increment = value >= 5000
      ? 500
      : 100;
  }

  return Math.round(value / increment) * increment;
}


/**
 * ============================================================
 * EMPTY / NOT REQUESTED SALARY
 * ============================================================
 */

function createNotRequestedSalary_() {

  return {
    status: 'NOT_REQUESTED',
    target_role: null,
    inferred_seniority: null,
    currency: null,

    confirmed_company_salary: {
      available: false,
      min: null,
      max: null,
      period: null,
      evidence_ids: [],
      note: 'Salary Intelligence was not requested.'
    },

    market_range: {
      min: null,
      max: null,
      period: null,
      evidence_ids: []
    },

    estimated_company_range: {
      min: null,
      max: null,
      period: null,
      evidence_ids: []
    },

    most_probable_offer: {
      min: null,
      max: null,
      period: null
    },

    strong_candidate_range: {
      min: null,
      max: null,
      period: null
    },

    benefits: [],
    confidence_score: null,
    methodology_notes: ['No salary study was requested; no statistical confidence is asserted.'],

    diagnostics: {
      acceptedEvidenceCount: 0,
      rejectedEvidenceCount: 0,
      totalExtractedSalaryEvidence: 0,
      observed_public_range: {
        min: null,
        max: null,
        currency: null,
        period: null
      },
      marketAdjustmentPercent: 0,
      marketAdjustmentFactor: COMPANY_XRAY_SALARY_MARKET_FACTOR_,
      raw_market_benchmark: null,
      adjusted_market_benchmark: null,
      companyAdjustmentPercent: 0,
      rejectedEvidence: []
    }
  };
}


/**
 * ============================================================
 * EMPTY FEEDBACK
 * ============================================================
 */

function createEmptyFeedback_() {

  return {
    status: 'INSUFFICIENT_PUBLIC_FEEDBACK',
    overall_signal: 'INSUFFICIENT',
    confidence_score: null,
    evidence_grade:'INSUFFICIENT',
    survey_classification:'NOT_AN_EMPLOYEE_SURVEY',
    positive_themes: [],
    negative_themes: [],
    categories: {
      management: 'INSUFFICIENT',
      compensation_benefits: 'INSUFFICIENT',
      career_growth: 'INSUFFICIENT',
      work_environment: 'INSUFFICIENT',
      work_life_balance: 'INSUFFICIENT',
      recruitment_interview: 'INSUFFICIENT'
    },
    repeated_signals: [],
    limitations: [
      'Insufficient public employee-review evidence.'
    ]
  };
}


/**
 * ============================================================
 * SOURCE COLLECTION
 * ============================================================
 */

function collectCompanyXRayEvidenceIds_(value) {

  const result = [];

  function walk_(node) {

    if (node === null || node === undefined) {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(walk_);
      return;
    }

    if (typeof node === 'object') {

      Object.keys(node).forEach(function(key) {

        if (
          key === 'evidence_ids' &&
          Array.isArray(node[key])
        ) {

          node[key].forEach(function(id) {

            id = Number(id);

            if (Number.isFinite(id)) {
              result.push(id);
            }
          });

          return;
        }

        walk_(node[key]);
      });
    }
  }

  walk_(value);
  return result;
}


/**
 * ============================================================
 * EMPTY COMPANY X-RAY RESULT
 * ============================================================
 */

function createEmptyCompanyXRayResult_(
  request,
  startedAt,
  searchRuns
) {

  return {

    success: true,
    request: request,

    company: {
      identity_status: 'NOT_FOUND',
      confidence_score: null,
      canonical_name: null,
      aliases: [],
      country: request.country || null,
      industry: null,
      company_size_range: null,
      main_location: null,
      official_website: null,
      evidence_ids: [],
      notes: 'No useful public search evidence was found.'
    },

    salary: request.jobTitle
      ? {
          status: 'INSUFFICIENT_DATA',
          target_role: request.jobTitle,
          inferred_seniority: null,
          currency: normalizeXRayText_(request.country) === 'egypt'
            ? 'EGP'
            : null,

          confirmed_company_salary: {
            available: false,
            min: null,
            max: null,
            period: null,
            evidence_ids: [],
            note: 'No public salary evidence was found.'
          },

          market_range: {
            min: null,
            max: null,
            period: null,
            evidence_ids: []
          },

          estimated_company_range: {
            min: null,
            max: null,
            period: null,
            evidence_ids: []
          },

          most_probable_offer: {
            min: null,
            max: null,
            period: null
          },

          strong_candidate_range: {
            min: null,
            max: null,
            period: null
          },

          benefits: [],
          confidence_score: null,
          methodology_notes: [
            'No usable public salary evidence was found.'
          ],

          diagnostics: {
            acceptedEvidenceCount: 0,
            rejectedEvidenceCount: 0,
            totalExtractedSalaryEvidence: 0,
            observed_public_range: {
              min: null,
              max: null,
              currency: 'EGP',
              period: 'monthly'
            },
            marketAdjustmentPercent: 0,
            marketAdjustmentFactor: COMPANY_XRAY_SALARY_MARKET_FACTOR_,
            raw_market_benchmark: null,
            adjusted_market_benchmark: null,
            companyAdjustmentPercent: 0,
            rejectedEvidence: []
          }
        }
      : createNotRequestedSalary_(),

    feedback: createEmptyFeedback_(),
    sources: [],

    research: {
      depth: request.depth,
      searchesExecuted: searchRuns.length,
      successfulSearches: searchRuns.filter(function(item) {
        return item.success;
      }).length,
      uniqueEvidenceItems: 0,
      durationSeconds: Math.round(
        (Date.now() - startedAt) / 1000
      )
    }
  };
}


/**
 * ============================================================
 * GENERAL HELPERS
 * ============================================================
 */

function cleanCompanyXRayText_(value) {

  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}


function normalizeXRayText_(value) {

  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


function getXRayTokens_(value) {

  const stop = {
    group: true,
    company: true,
    co: true,
    ltd: true,
    llc: true,
    inc: true,
    sae: true,
    for: true,
    the: true,
    and: true
  };

  return normalizeXRayText_(value)
    .split(' ')
    .filter(function(token) {
      return token.length >= 2 && stop[token] !== true;
    });
}


function getXRayDomain_(url) {

  try {

    const match = String(url || '').match(
      /^https?:\/\/([^\/]+)/i
    );

    if (!match) {
      return '';
    }

    return match[1]
      .replace(/^www\./i, '')
      .toLowerCase();

  } catch (ignore) {
    return '';
  }
}


function normalizeXRayUrl_(url) {

  return String(url || '')
    .trim()
    .replace(/#.*$/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}


function getCompanyXRayMaxEvidence_(depth) {

  if (depth === 'quick') {
    return 24;
  }

  if (depth === 'deep') {
    return 55;
  }

  return 45;
}


/**
 * ============================================================
 * SINGLE END-TO-END TEST
 * ============================================================
 */

function testFullCompanyXRay() {

  const result = runCompanyXRay_({
    company: 'Eagle Chemicals Group',
    country: 'Egypt',
    city: 'Cairo',
    jobTitle: 'HR Specialist',
    experienceLevel: '1-3 years',
    depth: 'professional'
  });

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  return result;
}

/** v3 local self-test. No Serper/Gemini calls, no credentials, no Sheet writes.
 * Run this once in Apps Script editor before redeploying Company X-Ray. */
function runCompanyXRayV3SelfTest(){
  const q={company:'Vodafone Egypt',country:'Egypt',city:'Cairo',jobTitle:'HR Specialist',experienceLevel:'3-5 years'};
  const mk=function(id,domain,value,basis,date,city,role){
    role=role||'HR Specialist';city=city||'Cairo';
    const s={evidenceId:id,title:role+' salary '+city+' Egypt',
      snippet:role+' salary '+city+' Egypt EGP '+value+' per month',
      url:'https://'+domain+'/salary/'+id,domain:domain,
      sourceType:'SALARY_PLATFORM',date:date===undefined?'2026-08-20':date};
    const x={evidence_id:id,role_title:role,role_match:'EXACT',seniority_match:'CLOSE',
      company_specific:false,company_name:null,min_salary:value,max_salary:value,
      period:'MONTHLY',currency:'EGP',pay_basis:basis||'GROSS_SALARY',
      explicit_numeric_salary:true,location:city,confidence_score:75};
    return {s:s,x:x};
  };
  const a=mk(1,'indeed.com',15000),b=mk(2,'glassdoor.com',17000),c=mk(3,'wuzzuf.net',19000);
  function run(arr){return buildDeterministicSalaryResult_(q,{},arr.map(z=>z.x),[],arr.map(z=>z.s),'SPECIALIST');}
  const cases=[
    ['3 independent', [a,b,c],15000],
    ['1 source',[a],null],['2 sources',[a,b],null],
    ['3 pages same domain',[mk(1,'indeed.com',15000),mk(2,'indeed.com',17000),mk(3,'indeed.com',19000)],null],
    ['gross/net mismatch',[a,b,mk(3,'wuzzuf.net',19000,'NET_SALARY')],null],
    ['outdated source',[a,b,mk(3,'wuzzuf.net',19000,'GROSS_SALARY','2023-01-01')],null],
    ['undated source',[a,b,mk(3,'wuzzuf.net',19000,'GROSS_SALARY',null)],null],
    ['wrong city',[a,b,mk(3,'wuzzuf.net',19000,'GROSS_SALARY',undefined,'Alexandria')],null],
    ['wrong role',[a,b,mk(3,'wuzzuf.net',19000,'GROSS_SALARY',undefined,'Cairo','Marketing Specialist')],null],
    ['duplicate page',[a,a,b],null],
    ['unknown pay basis',[a,b,mk(3,'wuzzuf.net',19000,'UNKNOWN')],null],
    ['consistent base pay',[mk(1,'indeed.com',15000,'BASE_SALARY'),mk(2,'glassdoor.com',17000,'BASE_SALARY'),mk(3,'wuzzuf.net',19000,'BASE_SALARY')],15000]
  ];
  const failures=[];
  cases.forEach(function(c){
    try{
      const out=run(c[1]);
      if(out.market_range.min!==c[2]||out.market_range.p25!==null||
        out.market_range.p75!==null||out.diagnostics.marketAdjustmentPercent!==0||
        out.estimated_company_range.min!==null||out.most_probable_offer.min!==null||
        out.confidence_score!==null) failures.push({case:c[0],actual:out.market_range});
    }catch(e){failures.push({case:c[0],error:String(e)});}
  });
  const empty=createEmptyFeedback_();
  if(empty.confidence_score!==null||empty.overall_signal!=='INSUFFICIENT')failures.push({case:'empty feedback'});
  const noRole=createNotRequestedSalary_();
  if(noRole.diagnostics.marketAdjustmentPercent!==0)failures.push({case:'no role retains legacy discount'});
  const result={passed:14-failures.length,total:14,ok:!failures.length,failures:failures,
    note:'Synthetic data test only; live search, Gemini and deployment must be checked separately.'};
  console.log(JSON.stringify(result));
  if(!result.ok)throw Error('Company X-Ray v3 self-test failed '+JSON.stringify(failures));
  return result;
}
