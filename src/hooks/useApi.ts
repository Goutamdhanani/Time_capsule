import { useState, useEffect, useMemo } from 'react';

// 🔁 Change this before deploying
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tcc-blockchain-87e6-c2ee2c02db18.herokuapp.com';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(endpoint: string, options?: RequestInit): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);
  const url = useMemo(() => `${API_BASE_URL}${endpoint}`, [endpoint]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(url, {
          method: options?.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(memoizedOptions?.headers || {}),
          },
          ...memoizedOptions,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!cancelled) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [url, memoizedOptions]);

  return state;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options?.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
