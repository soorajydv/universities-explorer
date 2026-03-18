import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useUniversities, useFilterMeta, useStats } from '../hooks/useApi';
import UniversityCard from '../components/UniversityCard';
import FilterSidebar from '../components/FilterSidebar';
import UniversityModal from '../components/UniversityModal';
import Navbar from '../components/Navbar';

const SORT_OPTIONS = [
  { value: 'priority:asc',    label: 'Priority (Default)' },
  { value: 'name:asc',        label: 'Name A–Z' },
  { value: 'name:desc',       label: 'Name Z–A' },
  { value: 'country:asc',     label: 'Country A–Z' },
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'created_at:asc',  label: 'Oldest First' },
];

const LIMITS = [12, 24, 48];

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  navbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
    backdropFilter: 'blur(16px)',
    '-webkit-backdrop-filter': 'blur(16px)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    padding: '0 24px',
    height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
  },
  'navbar[data-theme="dark"]': {
    background: 'linear-gradient(180deg, rgba(17,19,25,0.95), rgba(17,19,25,0.85))',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  navbarLogo: {
    display: 'flex', alignItems: 'center', gap: 16,
    fontFamily: 'Inter', fontWeight: 700, letterSpacing: '-0.5px',
    textDecoration: 'none', color: 'var(--text)', transition: 'all 0.3s ease',
  },
  navbarLogoHover: {
    transform: 'translateY(-1px)',
  },
  navbarBrand: {
    fontSize: 20, background: 'linear-gradient(135deg, var(--accent2), var(--accent3))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navbarSubtitle: {
    fontSize: 12, color: 'var(--text3)', fontWeight: 500,
    borderLeft: '1px solid var(--border)', paddingLeft: 16,
  },
  navbarActions: {
    display: 'flex', alignItems: 'center', gap: 12,
  },
  navbarThemeToggle: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text)', borderRadius: 12, padding: '8px 12px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 8,
  },
  navbarThemeToggleHover: {
    borderColor: 'var(--accent)', transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  navbarStats: {
    display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text2)',
  },
  navbarStat: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '6px 12px', fontWeight: 600,
  },

  container: { maxWidth: 1360, margin: '0 auto', padding: '24px' },
  heroSection: {
    padding: '32px 24px', textAlign: 'center',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
    borderBottom: '1px solid var(--border)',
  },
  'heroSection[data-theme="light"]': {
    background: 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))',
    borderBottom: '1px solid var(--border)',
  },
  heroTitle: {
    fontFamily: 'Inter', fontSize: 32, fontWeight: 800, color: 'var(--text)',
    margin: '0 0 8px 0', letterSpacing: '-0.5px',
  },
  heroSubtitle: {
    fontSize: 16, color: 'var(--text2)', margin: 0, fontWeight: 500,
  },

  toolbar: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 20, flexWrap: 'wrap',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 12,
  },
  searchWrap: {
    flex: 1, minWidth: 220,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px 10px 38px',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s ease',
    border: 'none',
    boxShadow: 'none',
  },
  searchInputFocus: {
    background: 'var(--surface)',
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.1)',
  },
  searchIcon: {
    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--text3)', pointerEvents: 'none',
    zIndex: 1,
  },
  select: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px',
    color: 'var(--text)', fontSize: 13, outline: 'none',
  },
  gridBtn: (active) => ({
    padding: '9px 10px', borderRadius: 8,
    background: active ? 'var(--surface3)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--border2)' : 'var(--border)'}`,
    color: active ? 'var(--text)' : 'var(--text3)',
    cursor: 'pointer',
  }),

  layout: { display: 'flex', gap: 24, alignItems: 'flex-start' },
  main: { flex: 1, minWidth: 0 },

  resultsInfo: {
    fontSize: 13, color: 'var(--text2)', marginBottom: 16,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },

  grid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 16,
  }),
  list: { display: 'flex', flexDirection: 'column', gap: 12 },

  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: 6, marginTop: 32, flexWrap: 'wrap',
  },
  pageBtn: (active, disabled) => ({
    minWidth: 36, height: 36,
    background: active ? 'var(--accent)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 8,
    color: active ? '#fff' : disabled ? 'var(--text3)' : 'var(--text)',
    fontSize: 13, fontFamily: 'Syne', fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s',
  }),
  pageInfo: { fontSize: 13, color: 'var(--text2)' },

  empty: {
    textAlign: 'center', padding: '80px 20px',
    color: 'var(--text2)',
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: 'Syne', fontSize: 18, color: 'var(--text)', marginBottom: 8 },

  skeletonGrid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 16,
  }),
  skeletonCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    height: 320,
  },

  mobileFilterBtn: {
    display: 'none',
    padding: '9px 16px', borderRadius: 10,
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 13, cursor: 'pointer',
  },
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function UniversitiesPage() {
  const [filters, setFilters] = useState({
    page: 1, limit: 12,
    search: '', country: '',
    sortBy: 'priority', sortOrder: 'asc',
    hasScholarship: '', intakeType: '', level: '',
    minAcceptance: '', maxAcceptance: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [gridCols, setGridCols] = useState(3);
  const [selectedUni, setSelectedUni] = useState(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  useEffect(() => {
    setFilters(f => ({ ...f, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const meta = useFilterMeta();
  const stats = useStats();

  const apiParams = useMemo(() => 
    Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    ), [filters]
  );
  const { data, loading } = useUniversities(apiParams);

  const universities = data?.data || [];
  const pagination = data?.pagination || {};

  const handleFilterChange = useCallback((changes) => {
    setFilters(f => ({ ...f, ...changes }));
  }, []);

  const handleSort = (val) => {
    const [sortBy, sortOrder] = val.split(':');
    setFilters(f => ({ ...f, sortBy, sortOrder, page: 1 }));
  };

  const activeCount = [
    filters.country, filters.hasScholarship, filters.intakeType,
    filters.level, filters.minAcceptance, filters.maxAcceptance,
  ].filter(Boolean).length;

  const totalPages = pagination.totalPages || 1;
  const curPage = pagination.page || 1;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= curPage - delta && i <= curPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const SkeletonCards = () => (
    <div style={s.skeletonGrid(gridCols)}>
      {Array.from({ length: filters.limit }).map((_, i) => (
        <div key={i} style={s.skeletonCard}>
          <div className="skeleton" style={{ height: 120 }} />
          <div style={{ padding: '28px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="skeleton" style={{ height: 14, width: '80%' }} />
            <div className="skeleton" style={{ height: 12, width: '50%' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <div className="skeleton" style={{ height: 52 }} />
              <div className="skeleton" style={{ height: 52 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar />

      <div style={s.container}>
        {/* Hero Section */}
        <div style={s.heroSection}>
          <h1 style={s.heroTitle}>Find Your University</h1>
          <p style={s.heroSubtitle}>
            Explore {stats?.total?.toLocaleString() || 'thousands of'} universities across {stats?.countries || 'the world'} countries
          </p>
        </div>

        {/* Toolbar */}
        <div style={s.toolbar}>
          {/* Search */}
          <div style={s.searchWrap}>
            <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              style={s.searchInput}
              placeholder="Search universities, locations..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onFocus={e => { 
                e.target.style.background = 'var(--surface)';
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.1)';
              }}
              onBlur={e => { 
                e.target.style.background = 'var(--surface2)';
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Sort */}
          <select
            style={s.select}
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={e => handleSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Per page */}
          <select
            style={s.select}
            value={filters.limit}
            onChange={e => setFilters(f => ({ ...f, limit: parseInt(e.target.value), page: 1 }))}
          >
            {LIMITS.map(l => <option key={l} value={l}>{l} per page</option>)}
          </select>

          {/* Grid cols */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[2, 3, 4].map(n => (
              <button key={n} style={s.gridBtn(gridCols === n)} onClick={() => setGridCols(n)}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  {n === 2 && <><rect x="0" y="0" width="7" height="7"/><rect x="9" y="0" width="7" height="7"/><rect x="0" y="9" width="7" height="7"/><rect x="9" y="9" width="7" height="7"/></>}
                  {n === 3 && <><rect x="0" y="0" width="4" height="4"/><rect x="6" y="0" width="4" height="4"/><rect x="12" y="0" width="4" height="4"/><rect x="0" y="6" width="4" height="4"/><rect x="6" y="6" width="4" height="4"/><rect x="12" y="6" width="4" height="4"/><rect x="0" y="12" width="4" height="4"/><rect x="6" y="12" width="4" height="4"/><rect x="12" y="12" width="4" height="4"/></>}
                  {n === 4 && <><rect x="0" y="0" width="3" height="3"/><rect x="4.5" y="0" width="3" height="3"/><rect x="9" y="0" width="3" height="3"/><rect x="13.5" y="0" width="3" height="3"/><rect x="0" y="4.5" width="3" height="3"/><rect x="4.5" y="4.5" width="3" height="3"/><rect x="9" y="4.5" width="3" height="3"/><rect x="13.5" y="4.5" width="3" height="3"/><rect x="0" y="9" width="3" height="3"/><rect x="4.5" y="9" width="3" height="3"/><rect x="9" y="9" width="3" height="3"/><rect x="13.5" y="9" width="3" height="3"/></>}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div style={s.layout}>
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            meta={meta}
            activeCount={activeCount}
          />

          {/* Main */}
          <div style={s.main}>
            {/* Results info */}
            <div style={s.resultsInfo}>
              <span>
                {loading ? 'Loading...' : (
                  <>
                    <strong style={{ color: 'var(--text)' }}>
                      {pagination.total?.toLocaleString() || 0}
                    </strong> universities found
                    {filters.search && ` for "${filters.search}"`}
                    {filters.country && ` in ${filters.country}`}
                  </>
                )}
              </span>
              {pagination.total > 0 && (
                <span>
                  Page {curPage} of {totalPages}
                </span>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <SkeletonCards />
            ) : universities.length === 0 ? (
              <div style={s.empty}>
                <div style={s.emptyIcon}>🔍</div>
                <div style={s.emptyTitle}>No universities found</div>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div style={s.grid(gridCols)} className="fade-in">
                {universities.map(uni => (
                  <UniversityCard
                    key={uni._id}
                    uni={uni}
                    onClick={setSelectedUni}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={s.pagination}>
                <button
                  style={s.pageBtn(false, curPage === 1)}
                  onClick={() => !loading && curPage > 1 && handleFilterChange({ page: curPage - 1 })}
                  disabled={curPage === 1}
                >
                  ← Prev
                </button>

                {getPageNumbers().map((p, i) => (
                  p === '...' ? (
                    <span key={`dot-${i}`} style={{ color: 'var(--text3)', padding: '0 4px' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      style={s.pageBtn(p === curPage, false)}
                      onClick={() => !loading && handleFilterChange({ page: p })}
                    >
                      {p}
                    </button>
                  )
                ))}

                <button
                  style={s.pageBtn(false, curPage === totalPages)}
                  onClick={() => !loading && curPage < totalPages && handleFilterChange({ page: curPage + 1 })}
                  disabled={curPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUni && (
        <UniversityModal uni={selectedUni} onClose={() => setSelectedUni(null)} />
      )}
    </div>
  );
}
