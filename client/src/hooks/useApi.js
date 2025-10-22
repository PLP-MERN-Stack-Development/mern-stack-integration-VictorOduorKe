// hooks/useApi.js
import { useState, useEffect } from 'preact/hooks';
import api from '../services/api/api';

const useApi = (apiCall, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiCall(...args);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiCall, ...args]);

  return { data, loading, error };
};

export default useApi;