import React, { useState } from 'react';

const s = {
  sidebar: {
    width: 260,
    flexShrink: 0,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    height: 'fit-content',
    position: 'sticky',
    top: 80,
  },
  sidebarTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearBtn: {
    fontSize: 11,
    color: 'var(--accent2)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
  },
  section: { marginBottom: 20 },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 8,
    display: 'block',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 0',
    cursor: 'pointer',
  },
  checkLabel: { fontSize: 13, color: 'var(--text2)', flex: 1 },
  count: { fontSize: 11, color: 'var(--text3)' },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  },
  range: { display: 'flex', gap: 8, alignItems: 'center' },
  rangeInput: {
    flex: 1,
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '6px 10px',
    color: 'var(--text)',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  },
  rangeSep: { color: 'var(--text3)', fontSize: 13 },
  select: {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '8px 10px',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
  },
  divider: { borderColor: 'var(--border)', marginBottom: 20 },
};

export default function FilterSidebar({ filters, onChange, meta, activeCount }) {
  const [showAllCountries, setShowAllCountries] = useState(false);
  const countries = meta?.countries || [];
  const displayCountries = showAllCountries ? countries : countries.slice(0, 8);

  const toggleCountry = (val) => {
    const current = filters.country ? filters.country.split(',').filter(Boolean) : [];
    const idx = current.indexOf(val);
    if (idx === -1) current.push(val);
    else current.splice(idx, 1);
    onChange({ country: current.join(','), page: 1 });
  };

  const selectedCountries = filters.country ? filters.country.split(',').filter(Boolean) : [];

  const handleClear = () => {
    onChange({
      country: '',
      hasScholarship: '',
      intakeType: '',
      level: '',
      minAcceptance: '',
      maxAcceptance: '',
      page: 1,
    });
  };

  return (
    <div style={s.sidebar}>
      <div style={s.sidebarTitle}>
        <span>Filters {activeCount > 0 && <span style={{ color: 'var(--accent2)' }}>({activeCount})</span>}</span>
        {activeCount > 0 && <button style={s.clearBtn} onClick={handleClear}>Clear all</button>}
      </div>

      {/* Country */}
      <div style={s.section}>
        <span style={s.label}>Country</span>
        {displayCountries.map(c => (
          <label key={c.value || c} style={s.checkRow}>
            <input
              type="checkbox"
              style={s.checkbox}
              checked={selectedCountries.includes(c.value || c)}
              onChange={() => toggleCountry(c.value || c)}
            />
            <span style={s.checkLabel}>{c.value || c}</span>
            <span style={s.count}>{c.count || ''}</span>
          </label>
        ))}
        {countries.length > 8 && (
          <button
            onClick={() => setShowAllCountries(v => !v)}
            style={{ ...s.clearBtn, marginTop: 4, display: 'block' }}
          >
            {showAllCountries ? 'Show less' : `+${countries.length - 8} more`}
          </button>
        )}
      </div>

      <hr style={s.divider} />

      {/* Level */}
      <div style={s.section}>
        <span style={s.label}>Degree Level</span>
        <select
          style={s.select}
          value={filters.level || ''}
          onChange={e => onChange({ level: e.target.value, page: 1 })}
        >
          <option value="">All Levels</option>
          {(meta?.levels || []).map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
          {!(meta?.levels?.length) && (
            <>
              <option value="Bachelor">Bachelor's</option>
              <option value="Master">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Associate">Associate</option>
              <option value="Diploma">Diploma</option>
              <option value="Certificate">Certificate</option>
            </>
          )}
        </select>
      </div>

      {/* Intake */}
      <div style={s.section}>
        <span style={s.label}>Intake</span>
        <select
          style={s.select}
          value={filters.intakeType || ''}
          onChange={e => onChange({ intakeType: e.target.value, page: 1 })}
        >
          <option value="">All Intakes</option>
          {(meta?.intakes || []).map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
          {!(meta?.intakes?.length) && (
            <>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Winter">Winter</option>
            </>
          )}
        </select>
      </div>

      {/* Acceptance Rate */}
      <div style={s.section}>
        <span style={s.label}>Acceptance Rate (%)</span>
        <div style={s.range}>
          <input
            type="number"
            style={s.rangeInput}
            placeholder="Min"
            min="0" max="100"
            value={filters.minAcceptance || ''}
            onChange={e => onChange({ minAcceptance: e.target.value, page: 1 })}
          />
          <span style={s.rangeSep}>–</span>
          <input
            type="number"
            style={s.rangeInput}
            placeholder="Max"
            min="0" max="100"
            value={filters.maxAcceptance || ''}
            onChange={e => onChange({ maxAcceptance: e.target.value, page: 1 })}
          />
        </div>
      </div>

      {/* Scholarship */}
      <div style={s.section}>
        <label style={s.checkRow}>
          <input
            type="checkbox"
            style={s.checkbox}
            checked={filters.hasScholarship === 'true'}
            onChange={e => onChange({ hasScholarship: e.target.checked ? 'true' : '', page: 1 })}
          />
          <span style={s.checkLabel}>Has Scholarships</span>
        </label>
      </div>
    </div>
  );
}
