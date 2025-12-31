import PropTypes from 'prop-types';
import './Gamecard.css';

function GameCard({ game }) {
  
  const competition = game.competitions[0];
  

  const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
  const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
  
  
  const status = competition.status.type.name;

  return (
    <div className="game-card">
      <div className="team-section">
        <div className="team-name">{awayTeam.team.displayName}</div>
        <div className="score">{awayTeam.score}</div>
      </div>
      
      <div className="vs">vs</div>
      
      <div className="team-section">
        <div className="team-name">{homeTeam.team.displayName}</div>
        <div className="score">{homeTeam.score}</div>
      </div>
      
      <div className="status">{status}</div>
    </div>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    competitions: PropTypes.array.isRequired,
  }).isRequired,
};

export default GameCard;