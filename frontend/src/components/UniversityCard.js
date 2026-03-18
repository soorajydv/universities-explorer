import React from 'react';

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  banner: {
    height: 120,
    background: 'var(--surface2)',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.7,
  },
  countryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(108,92,231,0.85)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 20,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  logoWrap: {
    position: 'absolute',
    bottom: -22,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 10,
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 38, height: 38, objectFit: 'contain' },
  body: { padding: '28px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 },
  name: { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 },
  location: { fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 },
  stats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 },
  stat: {
    background: 'var(--surface2)',
    borderRadius: 8,
    padding: '7px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statVal: { fontSize: 13, fontWeight: 700, color: 'var(--accent2)', fontFamily: 'Syne, sans-serif' },
  statLabel: { fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  tags: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tag: {
    fontSize: 10,
    background: 'var(--surface3)',
    color: 'var(--text2)',
    padding: '3px 8px',
    borderRadius: 20,
    border: '1px solid var(--border)',
  },
  tagAccent: {
    fontSize: 10,
    background: 'rgba(108,92,231,0.15)',
    color: 'var(--accent2)',
    padding: '3px 8px',
    borderRadius: 20,
    border: '1px solid rgba(108,92,231,0.3)',
  },
  viewBtn: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--accent2)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    whiteSpace: 'nowrap',
  }
};

export default function UniversityCard({ uni, onClick }) {
  const stats = uni.overviewStats || {};
  const intakeLabels = (uni.intakes || []).map(i => {
    if (/fall/i.test(i.intake)) return 'Fall';
    if (/spring/i.test(i.intake)) return 'Spring';
    if (/winter/i.test(i.intake)) return 'Winter';
    return i.intake?.split(' ')[0];
  }).filter(Boolean);

  const levels = (uni.topCourses || []).map(c => c.name).filter(Boolean);

  return (
    <div
      style={styles.card}
      className="uni-card"
      onClick={() => onClick && onClick(uni)}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Banner */}
      <div style={styles.banner}>
        {uni.universityBannerImage ? (
          <img src={uni.universityBannerImage} alt={uni.name} style={styles.bannerImg}
            onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div style={{ ...styles.bannerImg, background: `linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)` }} />
        )}
        {uni.country && <span style={styles.countryBadge}>{uni.country}</span>}
        <div style={styles.logoWrap}>
          {(uni.universityLogo?.imageUrl || uni.image?.imageUrl) ? (
            <img
              src={uni.universityLogo?.imageUrl || uni.image?.imageUrl}
              alt={uni.universityName || uni.name || 'University Logo'}
              style={styles.logo}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span style={{ fontSize: 20, color: 'var(--text3)' }}>🎓</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.name}>
          {uni.universityName || uni.name || 'University Name Not Available'}
          {uni.extraDetail && (
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400, display: 'block' }}>
              {uni.extraDetail}
            </span>
          )}
        </div>
        {(uni.location || uni.country) && (
          <div style={styles.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {uni.location || uni.country || ''}
          </div>
        )}

        {/* Stats */}
        <div style={styles.stats}>
          {stats.acceptanceRate && (
            <div style={styles.stat}>
              <span style={styles.statVal}>{stats.acceptanceRate}</span>
              <span style={styles.statLabel}>Acceptance</span>
            </div>
          )}
          {stats.placementRate && (
            <div style={styles.stat}>
              <span style={{ ...styles.statVal, color: 'var(--success)' }}>{stats.placementRate}</span>
              <span style={styles.statLabel}>Placement</span>
            </div>
          )}
          {stats.totalInternationalStudents && (
            <div style={styles.stat}>
              <span style={{ ...styles.statVal, color: 'var(--warning)' }}>{stats.totalInternationalStudents}</span>
              <span style={styles.statLabel}>Intl. Students</span>
            </div>
          )}
          {stats.studentFacultyRatio && (
            <div style={styles.stat}>
              <span style={{ ...styles.statVal, color: 'var(--accent3)' }}>{stats.studentFacultyRatio}</span>
              <span style={styles.statLabel}>Student:Faculty</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.tags}>
          {intakeLabels.slice(0, 2).map(l => (
            <span key={l} style={styles.tag}>{l} Intake</span>
          ))}
          {levels.slice(0, 2).map(l => (
            <span key={l} style={styles.tagAccent}>{l}</span>
          ))}
          {(uni.scholarships || []).length > 0 && (
            <span style={{ ...styles.tag, color: 'var(--success)', borderColor: 'rgba(0,184,148,0.3)', background: 'rgba(0,184,148,0.1)' }}>
              🎓 Scholarship
            </span>
          )}
        </div>
        <span style={styles.viewBtn}>
          View <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
        <span>
          {uni.universityUrl && (
            <div style={{ marginTop: 8 }}>
              <a
                href={uni.universityUrl.startsWith('http') ? uni.universityUrl : `https://${uni.universityUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.viewBtn}
              >
                Visit Website <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}
