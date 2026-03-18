import React, { useEffect, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────
   All colours reference the app's existing CSS custom properties:
   --surface, --surface2, --border, --text, --text2, --text3,
   --accent, --accent2, --accent3, --success, --warning
   The component is 100% theme-agnostic — it works in dark AND light
   mode automatically as long as those vars are defined globally.
   ───────────────────────────────────────────────────────────────── */

const MODAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .um-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-family: 'DM Sans', sans-serif;
  }

  .um-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    width: 100%;
    max-width: 1380px;
    max-height: 92vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.12), 0 32px 80px rgba(0,0,0,0.15);
    animation: um-in 0.28s cubic-bezier(0.34,1.15,0.64,1) forwards;
  }

  @keyframes um-in {
    from { opacity:0; transform:scale(0.96) translateY(14px); }
    to   { opacity:1; transform:scale(1)    translateY(0);    }
  }

  /* ── HEADER ── */
  .um-header {
    position: relative;
    height: 220px;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--surface2);
  }
  .um-banner-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.45;
  }
  .um-banner-fallback {
    position: absolute; inset: 0;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--accent2) 28%, var(--surface2)),
      color-mix(in srgb, var(--accent)  18%, var(--surface2))
    );
  }
  .um-banner-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 52px 52px;
    opacity: 0.5;
  }
  .um-banner-grad {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      var(--surface) 0%,
      color-mix(in srgb, var(--surface) 50%, transparent) 42%,
      transparent 100%
    );
  }

  .um-close {
    position: absolute; top: 14px; right: 14px;
    width: 36px; height: 36px;
    background: color-mix(in srgb, var(--surface) 85%, transparent);
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text2);
    font-size: 15px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10;
    transition: background 0.15s, color 0.15s;
  }
  .um-close:hover { background: var(--surface2); color: var(--text); }

  .um-header-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 0 28px 22px;
    display: flex; align-items: flex-end; gap: 18px;
  }
  .um-logo-box {
    width: 70px; height: 70px;
    background: var(--surface);
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.14);
  }
  .um-logo-img { width: 54px; height: 54px; object-fit: contain; }
  .um-title-area { flex: 1; min-width: 0; }

  .um-uni-name {
    font-family: 'Syne', 'DM Sans', sans-serif;
    font-size: 24px; font-weight: 800;
    color: var(--text);
    line-height: 1.2; letter-spacing: -0.3px;
  }
  .um-uni-sub { font-size: 13px; color: var(--text3); margin-top: 4px; }

  .um-rank-badge {
    background: color-mix(in srgb, var(--accent2) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent2) 32%, transparent);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 11px; font-weight: 700;
    color: var(--accent2);
    letter-spacing: 0.6px; text-transform: uppercase;
    align-self: flex-end; margin-bottom: 6px;
    white-space: nowrap; flex-shrink: 0;
  }

  /* ── BODY ── */
  .um-body { flex: 1; display: flex; overflow: hidden; }

  /* ── SIDEBAR ── */
  .um-sidebar {
    width: 290px; flex-shrink: 0;
    border-right: 1px solid var(--border);
    padding: 22px 18px;
    overflow-y: auto;
    display: flex; flex-direction: column; gap: 22px;
    background: color-mix(in srgb, var(--surface2) 55%, var(--surface));
  }

  /* ── SECTION ── */
  .um-section { display: flex; flex-direction: column; gap: 10px; }
  .um-section-title {
    font-size: 10px; font-weight: 700;
    color: var(--text3);
    text-transform: uppercase; letter-spacing: 1.6px;
    display: flex; align-items: center; gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .um-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    flex-shrink: 0;
  }

  /* ── STAT BOX ── */
  .um-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .um-stat-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 10px; text-align: center;
    transition: border-color 0.18s;
  }
  .um-stat-box:hover { border-color: color-mix(in srgb, var(--accent2) 45%, var(--border)); }
  .um-stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800; line-height: 1; letter-spacing: -0.5px;
  }
  .um-stat-label {
    font-size: 9.5px; color: var(--text3);
    margin-top: 4px; text-transform: uppercase;
    letter-spacing: 0.8px; line-height: 1.3;
  }

  /* ── RANKINGS ── */
  .um-rank-chip {
    background: color-mix(in srgb, var(--accent2) 8%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--accent2) 22%, var(--border));
    border-radius: 10px; padding: 10px 13px;
    display: flex; justify-content: space-between; align-items: center; gap: 8px;
    transition: border-color 0.15s;
  }
  .um-rank-chip:hover { border-color: color-mix(in srgb, var(--accent2) 50%, var(--border)); }
  .um-rank-val {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 800; color: var(--accent2);
  }
  .um-rank-sub { font-size: 11px; color: var(--text3); text-align: right; }

  /* ── INTAKES ── */
  .um-intake-chip {
    border-radius: 10px; padding: 12px 13px;
    border: 1px solid var(--border);
    background: var(--surface2);
  }
  .um-intake-chip.alt-a {
    background: color-mix(in srgb, var(--accent) 7%, var(--surface));
    border-color: color-mix(in srgb, var(--accent) 28%, var(--border));
  }
  .um-intake-chip.alt-b {
    background: color-mix(in srgb, var(--success) 7%, var(--surface));
    border-color: color-mix(in srgb, var(--success) 28%, var(--border));
  }
  .um-intake-name {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    color: var(--accent2); margin-bottom: 5px;
  }
  .um-intake-desc { font-size: 12px; color: var(--text2); line-height: 1.6; }

  /* ── MAIN ── */
  .um-main {
    flex: 1; padding: 24px 26px;
    overflow-y: auto;
    display: flex; flex-direction: column; gap: 26px;
  }

  /* ── TABS ── */
  .um-tab-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .um-tab {
    font-size: 12px; font-weight: 600;
    padding: 5px 15px; border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text2);
    cursor: pointer; transition: all 0.15s; letter-spacing: 0.15px;
  }
  .um-tab:hover { border-color: var(--accent2); color: var(--accent2); }
  .um-tab.active {
    background: color-mix(in srgb, var(--accent2) 14%, var(--surface));
    border-color: color-mix(in srgb, var(--accent2) 45%, transparent);
    color: var(--accent2);
  }

  /* ── COURSE CARDS ── */
  .um-course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
    gap: 9px;
  }
  .um-course-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 11px; padding: 13px 15px;
    display: flex; flex-direction: column; gap: 5px;
    transition: border-color 0.18s, background 0.18s;
  }
  .um-course-card:hover {
    background: color-mix(in srgb, var(--accent2) 6%, var(--surface2));
    border-color: color-mix(in srgb, var(--accent2) 35%, var(--border));
  }
  .um-course-name { font-size: 13px; color: var(--text); font-weight: 500; line-height: 1.4; }
  .um-course-m1   { font-size: 12px; color: var(--accent2); font-weight: 600; }
  .um-course-m2   { font-size: 11px; color: var(--text3); }

  /* ── SCHOLARSHIPS ── */
  .um-scholar-card {
    background: color-mix(in srgb, var(--success) 7%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--success) 20%, var(--border));
    border-radius: 12px; padding: 14px 15px;
  }
  .um-scholar-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
  .um-scholar-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: color-mix(in srgb, var(--success) 15%, var(--surface));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .um-scholar-name { font-size: 13px; font-weight: 600; color: var(--success); line-height: 1.3; }
  .um-scholar-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .um-scholar-tag {
    background: color-mix(in srgb, var(--success) 10%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--success) 22%, var(--border));
    border-radius: 6px; padding: 3px 10px;
    font-size: 11px; color: var(--text2);
  }

  /* ── SALARIES ── */
  .um-salary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
    gap: 8px;
  }
  .um-salary-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px;
    display: flex; flex-direction: column; gap: 4px;
    transition: border-color 0.18s;
  }
  .um-salary-card:hover { border-color: color-mix(in srgb, var(--success) 40%, var(--border)); }
  .um-salary-job { font-size: 12px; color: var(--text3); line-height: 1.3; }
  .um-salary-amt {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 800;
    color: var(--success); letter-spacing: -0.3px;
  }

  /* ── SCROLLBARS ── */
  .um-sidebar::-webkit-scrollbar,
  .um-main::-webkit-scrollbar { width: 4px; }
  .um-sidebar::-webkit-scrollbar-track,
  .um-main::-webkit-scrollbar-track { background: transparent; }
  .um-sidebar::-webkit-scrollbar-thumb,
  .um-main::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

const STAT_COLORS = [
  'var(--accent2)',
  'var(--success)',
  'var(--warning)',
  'var(--accent3)',
];

function getIntakeDesc(name, fallback) {
  if (!name) return fallback;
  const n = name.toLowerCase();
  if (n.includes('august') || n.includes('fall'))
    return 'Most popular intake — all undergraduate and graduate programs open, maximum flexibility for international students.';
  if (n.includes('january') || n.includes('spring'))
    return 'Great alternative for those who missed Fall deadlines or want to start mid-year. Covers most programs.';
  if (n.includes('may') || n.includes('summer'))
    return 'Limited but specialized programs — ideal for graduate study or a lighter academic start.';
  if (n.includes('october'))
    return 'All the courses are available in this intake for international students.';
  return fallback || '';
}

export default function UniversityModal({ uni, onClose }) {
  const [courseTab, setCourseTab] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const stats = uni.overviewStats || {};
  const courses = uni.topCourses || [];
  const activeCourses = courses[courseTab]?.cardDetail || [];
  const rankings = uni.rankings || [];
  const intakes = uni.intakes || [];
  const scholarships = uni.scholarships || [];
  const salaries = uni.placement?.averageSalary || [];

  const statItems = [
    { val: stats.acceptanceRate, label: 'Acceptance Rate' },
    { val: stats.placementRate, label: 'Placement Rate' },
    { val: stats.totalInternationalStudents, label: 'Intl. Students' },
    { val: stats.studentFacultyRatio, label: 'Student : Faculty' },
  ].filter(x => x.val);

  const logoSrc = uni.universityLogo?.imageUrl || uni.image?.imageUrl;

  return (
    <>
      <style>{MODAL_CSS}</style>

      <div className="um-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="um-modal">

          {/* ── HEADER ── */}
          <div className="um-header">
            {uni.universityBannerImage
              ? <img src={uni.universityBannerImage} alt="" className="um-banner-img"
                onError={e => e.target.style.display = 'none'} />
              : <div className="um-banner-fallback" />}
            <div className="um-banner-grid" />
            <div className="um-banner-grad" />

            <button className="um-close" onClick={onClose} title="Close">✕</button>

            <div className="um-header-content">
              <div className="um-logo-box">
                {logoSrc
                  ? <img src={logoSrc} className="um-logo-img" alt=""
                    onError={e => e.target.style.display = 'none'} />
                  : <span style={{ fontSize: 30 }}>🎓</span>}
              </div>
              <div className="um-title-area">
                <div className="um-uni-name">{uni.universityName || uni.name || 'University'}</div>
                <div className="um-uni-sub">
                  {uni.extraDetail || ''}
                  {(uni.location || uni.country) ? ` · ${uni.location || uni.country}` : ''}
                </div>
              </div>
              {rankings.length > 0 && (
                <div className="um-rank-badge">#{rankings[0].title} Ranked</div>
              )}
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="um-body">

            {/* ── SIDEBAR ── */}
            <aside className="um-sidebar">

              {statItems.length > 0 && (
                <div className="um-section">
                  <div className="um-section-title"><span className="um-dot" />Overview</div>
                  <div className="um-stats-grid">
                    {statItems.map((x, i) => (
                      <div key={i} className="um-stat-box">
                        <div className="um-stat-val" style={{ color: STAT_COLORS[i] }}>{x.val}</div>
                        <div className="um-stat-label">{x.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rankings.length > 0 && (
                <div className="um-section">
                  <div className="um-section-title"><span className="um-dot" />Rankings</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {rankings.map((r, i) => (
                      <div key={i} className="um-rank-chip">
                        <div className="um-rank-val">{r.title}</div>
                        <div className="um-rank-sub">{r.subTitle}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {intakes.length > 0 && (
                <div className="um-section">
                  <div className="um-section-title"><span className="um-dot" />Intakes</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {intakes.map((intake, i) => {
                      const name = intake.intake || intake;
                      const desc = getIntakeDesc(name, intake.description || '');
                      return (
                        <div key={i} className={`um-intake-chip ${i % 2 === 0 ? 'alt-a' : 'alt-b'}`}>
                          <div className="um-intake-name">{name}</div>
                          {desc && <div className="um-intake-desc">{desc}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>

            {/* ── MAIN ── */}
            <main className="um-main">

              {courses.length > 0 && (
                <div className="um-section">
                  <div className="um-section-title"><span className="um-dot" />Top Courses</div>
                  <div className="um-tab-row">
                    {courses.map((c, i) => (
                      <button key={i}
                        className={`um-tab${courseTab === i ? ' active' : ''}`}
                        onClick={() => setCourseTab(i)}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                  <div className="um-course-grid">
                    {activeCourses.map((c, i) => (
                      <div key={i} className="um-course-card">
                        <span className="um-course-name">{c.courseName}</span>
                        {c.title1 && <span className="um-course-m1">{c.title1}</span>}
                        {c.title2 && <span className="um-course-m2">{c.title2}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scholarships.length > 0 && (
                <div className="um-section">
                  <div className="um-section-title"><span className="um-dot" />Scholarships</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {scholarships.map((sch, i) => (
                      <div key={i} className="um-scholar-card">
                        <div className="um-scholar-header">
                          <div className="um-scholar-icon">🎓</div>
                          <div style={{ flex: 1 }}>
                            <div className="um-scholar-name">{sch.name}</div>
                          </div>
                        </div>
                        {(sch.detail || []).length > 0 && (
                          <div className="um-scholar-tags">
                            {sch.detail.map((d, j) => (
                              <span key={j} className="um-scholar-tag">{d}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {salaries.length > 0 && (
                <div className="um-section">
                  <div className="um-section-title"><span className="um-dot" />Average Salaries</div>
                  <div className="um-salary-grid">
                    {salaries.slice(0, 8).map((item, i) => (
                      <div key={i} className="um-salary-card">
                        <div className="um-salary-job">{item.expenceType}</div>
                        <div className="um-salary-amt">{item.totalSalary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}