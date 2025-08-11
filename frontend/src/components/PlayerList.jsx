import './PlayerList.css';

const PlayerList = ({ players, onPlayerClick }) => {
  return (
    <div className="player-list">
      {players.map((player) => (
        <button
          key={player.id}
          onClick={() => onPlayerClick(player.id)}
          className="player-button"
        >
          {player.id} : {player.name}
        </button>
      ))}
    </div>
  );
};

export default PlayerList;
