import { formatDate } from '../utils/formatDate';
import './PlayerDetails.css';

const PlayerDetails = ({ player, onDelete }) => {
  return (
    <div className="player-details">
      <h2>{player.name ?? 'Not mention'}</h2>
      <p>
        <strong>ID: </strong> {player.id}
      </p>
      <p>
        <strong>Birthday: </strong>
        {player.birthday ? formatDate(player.birthday) : 'Not mention'}
      </p>
      <p>
        <strong>Gender: </strong> {player.gender ?? 'Not mention'}
      </p>
      <button onClick={() => onDelete(player.id)}>Delete from Cache</button>
    </div>
  );
};

export default PlayerDetails;
