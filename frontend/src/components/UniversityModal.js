import React, { useEffect } from 'react';

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    width: '100%',
    maxWidth: 780,
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'relative',
    height: 180,
    flexShrink: 0,
    background: 'var(--surface2)',
    overflow: 'hidden',
  },
  bannerImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 },
  overlay2: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(17,17,24,0.95) 30%, transparent 100%)',
  },
  closeBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 36, height: 36,
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
  },
  headerContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: '0 24px 16px',
    display: 'flex', alignItems: 'flex-end', gap: 14,
  },
  logoBox: {
    width: 60, height: 60,
    background: 'var(--surface)',
    borderRadius: 12,
    border: '2px solid var(--border)',
    overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoImg: { width: 48, height: 48, objectFit: 'contain' },
  titleArea: { flex: 1, minWidth: 0 },
  uniName: { fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.2 },
  uniSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  body: { overflowY: 'auto', padding: 24, flex: 1 },

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  statBox: {
    background: 'var(--surface2)', borderRadius: 10,
    padding: '14px 16px', textAlign: 'center',
  },
  statVal: { fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color: 'var(--accent2)' },
  statLabel: { fontSize: 11, color: 'var(--text3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: 'Syne', fontSize: 13, fontWeight: 700,
    color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px',
    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
  },
  rankGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  rankChip: {
    background: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.3)',
    borderRadius: 8, padding: '6px 12px',
  },
  rankVal: { fontFamily: 'Syne', fontSize: 14, fontWeight: 700, color: 'var(--accent2)' },
  rankSub: { fontSize: 10, color: 'var(--text3)', marginTop: 1 },

  courseTab: {
    display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap',
  },
  tabBtn: (active) => ({
    fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
    background: active ? 'var(--accent)' : 'var(--surface2)',
    color: active ? '#fff' : 'var(--text2)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  courseList: { display: 'flex', flexDirection: 'column', gap: 6 },
  courseRow: {
    background: 'var(--surface2)', borderRadius: 8,
    padding: '10px 14px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 8,
  },
  courseName: { fontSize: 13, color: 'var(--text)', flex: 1 },
  courseMeta: { fontSize: 11, color: 'var(--text3)', textAlign: 'right' },

  scholarCard: {
    background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)',
    borderRadius: 10, padding: '12px 16px', marginBottom: 8,
  },
  scholarName: { fontSize: 13, fontWeight: 600, color: 'var(--success)', marginBottom: 6 },
  scholarDetail: { fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 12, flexWrap: 'wrap' },

  salaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid var(--border)',
  },
  salaryJob: { fontSize: 13, color: 'var(--text)' },
  salaryAmt: { fontSize: 13, fontWeight: 600, color: 'var(--success)', fontFamily: 'Syne' },

  intakeChip: (idx) => ({
    background: ['rgba(108,92,231,0.15)', 'rgba(253,121,168,0.15)'][idx % 2],
    border: `1px solid ${['rgba(108,92,231,0.3)', 'rgba(253,121,168,0.3)'][idx % 2]}`,
    borderRadius: 8, padding: '10px 16px', marginBottom: 8,
  }),
  intakeName: { fontSize: 13, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 },
  intakeDesc: { fontSize: 12, color: 'var(--text2)' },
};

export default function UniversityModal({ uni, onClose }) {
  const [courseTab, setCourseTab] = React.useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const stats = uni.overviewStats || {};
  const courses = uni.topCourses || [];
  const activeCourses = courses[courseTab]?.cardDetail || [];

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal} className="fade-in">
        {/* Header */}
        <div style={s.header}>
          {uni.universityBannerImage ? (
            <img src={uni.universityBannerImage} alt="" style={s.bannerImg}
              onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <div style={{ ...s.bannerImg, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }} />
          )}
          <div style={s.overlay2} />
          <button style={s.closeBtn} onClick={onClose}>✕</button>
          <div style={s.headerContent}>
            <div style={s.logoBox}>
              {(uni.universityLogo?.imageUrl || uni.image?.imageUrl) ? (
                <img src={uni.universityLogo?.imageUrl || uni.image?.imageUrl} style={s.logoImg}
                  alt={uni.universityName || uni.name || 'University Logo'} onError={e => { e.target.style.display = 'none'; }} />
              ) : <span style={{ fontSize: 28 }}>🎓</span>}
            </div>
            <div style={s.titleArea}>
              <div style={s.uniName}>{uni.universityName || uni.name || 'University Name Not Available'}</div>
              <div style={s.uniSub}>
                {uni.extraDetail && `${uni.extraDetail} `}
                {(uni.location || uni.country) && `• ${uni.location || uni.country}`}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={s.body}>

          {/* Overview stats */}
          {(stats.acceptanceRate || stats.placementRate || stats.totalInternationalStudents || stats.studentFacultyRatio) && (
            <div style={s.grid2}>
              {stats.acceptanceRate && (
                <div style={s.statBox}>
                  <div style={s.statVal}>{stats.acceptanceRate}</div>
                  <div style={s.statLabel}>Acceptance Rate</div>
                </div>
              )}
              {stats.placementRate && (
                <div style={s.statBox}>
                  <div style={{ ...s.statVal, color: 'var(--success)' }}>{stats.placementRate}</div>
                  <div style={s.statLabel}>Placement Rate</div>
                </div>
              )}
              {stats.totalInternationalStudents && (
                <div style={s.statBox}>
                  <div style={{ ...s.statVal, color: 'var(--warning)' }}>{stats.totalInternationalStudents}</div>
                  <div style={s.statLabel}>Intl. Students</div>
                </div>
              )}
              {stats.studentFacultyRatio && (
                <div style={s.statBox}>
                  <div style={{ ...s.statVal, color: 'var(--accent3)' }}>{stats.studentFacultyRatio}</div>
                  <div style={s.statLabel}>Student:Faculty Ratio</div>
                </div>
              )}
            </div>
          )}

          {/* Rankings */}
          {(uni.rankings || []).length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>🏆 Rankings</div>
              <div style={s.rankGrid}>
                {uni.rankings.map((r, i) => (
                  <div key={i} style={s.rankChip}>
                    <div style={s.rankVal}>{r.title}</div>
                    <div style={s.rankSub}>{r.subTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {courses.length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>📚 Top Courses</div>
              <div style={s.courseTab}>
                {courses.map((c, i) => (
                  <button key={i} style={s.tabBtn(courseTab === i)} onClick={() => setCourseTab(i)}>{c.name}</button>
                ))}
              </div>
              <div style={s.courseList}>
                {activeCourses.map((c, i) => (
                  <div key={i} style={s.courseRow}>
                    <span style={s.courseName}>{c.courseName}</span>
                    <div style={s.courseMeta}>
                      {c.title1 && <div style={{ color: 'var(--accent2)', fontWeight: 600 }}>{c.title1}</div>}
                      {c.title2 && <div>{c.title2}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intakes */}
          {(uni.intakes || []).length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>📅 Intakes</div>
              {uni.intakes.map((intake, i) => (
                <div key={i} style={s.intakeChip(i)}>
                  <div style={s.intakeName}>{intake.intake}</div>
                  {intake.description && <div style={s.intakeDesc}>{intake.description}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Scholarships */}
          {(uni.scholarships || []).length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>🎓 Scholarships</div>
              {uni.scholarships.map((sch, i) => (
                <div key={i} style={s.scholarCard}>
                  <div style={s.scholarName}>{sch.name}</div>
                  <div style={s.scholarDetail}>
                    {(sch.detail || []).map((d, j) => <span key={j}>{d}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Salary */}
          {(uni.placement?.averageSalary || []).length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>💼 Average Salaries</div>
              {uni.placement.averageSalary.slice(0, 6).map((s2, i) => (
                <div key={i} style={s.salaryRow}>
                  <span style={s.salaryJob}>{s2.expenceType}</span>
                  <span style={s.salaryAmt}>{s2.totalSalary}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
