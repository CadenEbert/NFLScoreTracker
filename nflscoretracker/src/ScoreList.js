import axios from 'axios';
import { useEffect, useState } from 'react';
import './styles/ScoreList.css';
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
    const [retryCount, setRetryCount] = useState(0);
    const [seasonStartDate, setSeasonStartDate] = useState(null);
    const [scoreData, setScoreData] = useState({});
    
    useEffect(() => {
        let isMounted = true;

        const fetchSeasonStart = async () => {
            try {
                
                const earlySeasonUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=50&dates=${year}0901-${year}0920`;
                const { data } = await axios.get(earlySeasonUrl);
                
                if (!isMounted) return;
                
                if (data.events && data.events.length > 0) {
                    const firstGame = data.events.reduce((earliest, game) => {
                        const gameDate = new Date(game.date);
                        return !earliest || gameDate < new Date(earliest.date) ? game : earliest;
                    });
                    setSeasonStartDate(new Date(firstGame.date));
                    console.log('Season start date:', new Date(firstGame.date));
                }
            } catch (err) {
                console.error('Error fetching season start:', err);
                setSeasonStartDate(new Date(year, 8, 1));
            }
        };

        fetchSeasonStart();

        return () => {
            isMounted = false;
        };
    }, [year]);
    
    useEffect(() => {
        let isMounted = true;

        const fetchScores = async () => {
            
            if (!seasonStartDate) return;
            
            try {
                setLoading(true);
                setError(null);
                
                let startDate, endDate;
                
                if (week === 'all') {
                    startDate = `${year}0901`;
                    endDate = `${Number(year) + 1}0301`;
                } else {
                    const weekNum = Number(week);
                    const weekStart = new Date(seasonStartDate);
                    weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7);
                    
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    
                    startDate = `${weekStart.getFullYear()}${String(weekStart.getMonth() + 1).padStart(2, '0')}${String(weekStart.getDate()).padStart(2, '0')}`;
                    endDate = `${weekEnd.getFullYear()}${String(weekEnd.getMonth() + 1).padStart(2, '0')}${String(weekEnd.getDate()).padStart(2, '0')}`;
                }
                
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
    }, [year, week, retryCount, seasonStartDate]);

   
    useEffect(() => {
        let filtered = [...allScores];

        filtered = filtered.filter(game => {
            const competition = game.competitions?.[0];
            const gameSeasonType = competition?.week?.seasonType;
            
            // Filter by season type
            if (seasonType !== 'all') {
                const typeMap = { preseason: 1, regular: 2, postseason: 3 };
                if (gameSeasonType !== typeMap[seasonType]) return false;
            }

            return true;
        });

        setScores(filtered);
    }, [seasonType, allScores]);

    const years = Array.from({ length: 12 }, (_, i) => defaultSeasonYear - i);

    

    if (loading) {
        return <div className="loading">Loading scores…</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={() => setRetryCount(retryCount + 1)}>Retry</button>
            </div>
        );
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
                    <option value="1">Week 1</option>
                    <option value="2">Week 2</option>
                    <option value="3">Week 3</option>
                    <option value="4">Week 4</option>
                    <option value="5">Week 5</option>
                    <option value="6">Week 6</option>
                    <option value="7">Week 7</option>
                    <option value="8">Week 8</option>
                    <option value="9">Week 9</option>
                    <option value="10">Week 10</option>
                    <option value="11">Week 11</option>
                    <option value="12">Week 12</option>
                    <option value="13">Week 13</option>
                    <option value="14">Week 14</option>
                    <option value="15">Week 15</option>
                    <option value="16">Week 16</option>
                    <option value="17">Week 17</option>
                    <option value="18">Week 18</option>
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