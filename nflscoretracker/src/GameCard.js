import PropTypes from 'prop-types';
import './styles/Gamecard.css';

function GameCard({ game }) {

    const competition = game.competitions[0];


    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');


    const status = competition.status.type.name;

    return (
        <div className="game-card">
            <div className="game-info">
                <div className="away-section">
                    <img src={awayTeam.team.logo} alt={awayTeam.team.displayName} className="team-logo" />
                    <div className="team-text">
                    <div className="team-name">{awayTeam.team.displayName}</div>
                    <div className="score">{awayTeam.score}</div>
                    </div>
                </div>
                <div className="vs">vs</div>
                <div className="home-section">
                    
                    <div className="team-text">
                    <div className="team-name">{homeTeam.team.displayName}</div>
                    <div className="score">{homeTeam.score}</div>
                    </div>
                    <img src={homeTeam.team.logo} alt={homeTeam.team.displayName} className="team-logo" />
                </div>
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