import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5001/api';

export function useUniversities(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(`${API_BASE}/universities`);
        Object.entries(params).forEach(([k, v]) => {
          if (v !== '' && v !== null && v !== undefined) {
            url.searchParams.append(k, v);
          }
        });

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [params]);

  return { data, loading, error };
}

export function useFilterMeta() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/filters/meta`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  return { data, loading };
}

export function useStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/stats`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { data, loading };
}