import { useState, useEffect } from 'react';
import { fetchCast } from '../services/castApi';

export const useFetchCast = () => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchCast();
        setPlayers(data);
      } catch (error) {
        setError('Failed to fetch cast data');
      }
    };

    loadPlayers();
  }, []);

  return { players, error };
};
