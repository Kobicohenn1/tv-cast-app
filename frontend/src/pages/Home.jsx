import { useState, useEffect } from 'react';
import PlayerList from '../components/PlayerList';
import PlayerDetails from '../components/PlayerDetails';
import CommentForm from '../components/CommentForm';
import { fetchCast, deletePlayer, addComment } from '../services/castApi';
import { formatTime } from '../utils/formatTime';
import { io } from 'socket.io-client';
import './Home.css';

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCast();
      setPlayers(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch cast data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Socket.io setup for real-time cache synchronization
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('cache-ttl-updated', (data) => {
      console.log('Cache TTL updated:', data.message);
      loadPlayers();
      setLastUpdate(new Date());
      setTimeSinceUpdate(0);
    });

    loadPlayers();

    return () => socket.disconnect();
  }, []);

  // Timer that updates every second to show time since last cache update
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastUpdate) {
        const now = new Date();
        const diff = Math.floor((now - lastUpdate) / 1000);
        setTimeSinceUpdate(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdate]);

  const handlePlayerClick = (id) => {
    const player = players.find((player) => player.id === id);
    setSelectedPlayer(player);
  };

  const handleDeletePlayer = async (id) => {
    try {
      await deletePlayer(id);
      setPlayers(players.filter((player) => player.id !== id));
      if (selectedPlayer && selectedPlayer.id === id) {
        setSelectedPlayer(null);
      }
    } catch (error) {
      console.error('Failed to delete player:', error);
    }
  };

  const handleCommentSubmit = async (playerId, commentText) => {
    try {
      await addComment(playerId, commentText);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to the TV Cast App</h1>
      <div className="status-bar">
        <div className="update-info">
          <span className="update-icon">🔄</span>
          <span className="update-text">
            Last update:{' '}
            {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </span>
        </div>
        <div className="timer">
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">
            {formatTime(timeSinceUpdate)} been passed
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading players...</div>
      ) : (
        <PlayerList players={players} onPlayerClick={handlePlayerClick} />
      )}

      {selectedPlayer && (
        <div className="details-container">
          <PlayerDetails
            player={selectedPlayer}
            onDelete={handleDeletePlayer}
          />
          <CommentForm
            playerId={selectedPlayer.id}
            onCommentSubmit={handleCommentSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
