import axios from 'axios';
import { useEffect, useState } from 'react';
import './ScoreList.css';
import GameCard from './GameCard';

function ScoreList() {
    const today = new Date();
    const defaultSeasonYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
    const [year, setYear] = useState(defaultSeasonYear);
    const [seasonType, setSeasonType] = useState('all');
    const [week, setWeek] = useState('all');
    const [allScores, setAllScores] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        let isMounted = true;

        const fetchScores = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use date range for NFL season: Sept 1 to Mar 1 of next year
                const startDate = `${year}0901`;
                const endDate = `${Number(year) + 1}0301`;
                const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=400&dates=${startDate}-${endDate}`;
                console.log({ year, startDate, endDate, url });
                const { data } = await axios.get(url);
                if (!isMounted) return;
                setScores(data.events || []);
                setAllScores(data.events || []);
                console.log('Sample game data:', data.events?.[0]);
                console.log('Competition:', data.events?.[0]?.competitions?.[0]);
                console.log('URL:', url);
                console.log('events:', data.events?.length);
            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching scores:', err);
                setError('Failed to fetch scores.');
            } finally {
                if (!isMounted) return;
                setLoading(false);
            }
        };

        fetchScores();

        return () => {
            isMounted = false;
        };
    }, [year]);

    // Filter games based on season type and week
    useEffect(() => {
        let filtered = [...allScores];

        filtered = filtered.filter(game => {
            const competition = game.competitions?.[0];
            const gameWeek = competition?.week?.number;
            const gameSeasonType = competition?.week?.seasonType;
            
            // Filter by season type
            if (seasonType !== 'all') {
                const typeMap = { preseason: 1, regular: 2, postseason: 3 };
                if (gameSeasonType !== typeMap[seasonType]) return false;
            }

            // Filter by week
            if (week !== 'all' && gameWeek !== Number(week)) {
                return false;
            }

            return true;
        });

        setScores(filtered);
    }, [seasonType, week, allScores]);

    const years = Array.from({ length: 12 }, (_, i) => defaultSeasonYear - i);

    // Extract unique weeks from all scores
    const uniqueWeeks = Array.from(
        new Set(allScores
            .map(game => game.competitions?.[0]?.week?.number)
            .filter(Boolean)
        )
    ).sort((a, b) => a - b);

    if (loading) {
        return <div className="loading">Loading scores…</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="filters">
                <select value={year} onChange={e => setYear(Number(e.target.value))}>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <select value={seasonType} onChange={e => setSeasonType(e.target.value)}>
                    <option value="all">All Seasons</option>
                    <option value="preseason">Preseason</option>
                    <option value="regular">Regular Season</option>
                    <option value="postseason">Postseason</option>
                </select>

                <select value={week} onChange={e => setWeek(e.target.value)}>
                    <option value="all">All Weeks</option>
                    {uniqueWeeks.map(w => (
                        <option key={w} value={w}>Week {w}</option>
                    ))}
                </select>
            </div>

            <div className="scores-list">
                {scores.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
}

export default ScoreList;