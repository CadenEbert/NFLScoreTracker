import axios from 'axios';
import { useEffect, useState } from 'react';
import './ScoreList.css';
import GameCard from './GameCard';

function ScoreList() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchScores = async () => {
        try {
            const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
            setScores(response.data.events);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching scores:', err);
            setError('Failed to fetch scores.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, []);

    if (loading) {
        return <div className="loading">Loading scores…</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="scores-list">
            {scores.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    );
}

export default ScoreList;