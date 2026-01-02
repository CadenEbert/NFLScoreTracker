import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/BoxScore.css';

function BoxScore({ gameId, onClose }) {
    const [boxScore, setBoxScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoxScore = async () => {
            try {
                const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
                const { data } = await axios.get(url);
                setBoxScore(data);
                console.log('Box score data:', data);
            } catch (err) {
                console.error('Error fetching box score:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBoxScore();
    }, [gameId]);

    if (loading) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="box-score-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="loading">Loading box score...</div>
                </div>
            </div>
        );
    }

    if (!boxScore) {
        return (
            <div className="modal-backdrop" onClick={onClose}>
                <div className="box-score-modal" onClick={(e) => e.stopPropagation()}>
                    <div>No data available</div>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    const homeTeam = boxScore.boxscore?.teams?.[1];
    const awayTeam = boxScore.boxscore?.teams?.[0];
    const homeStats = homeTeam?.statistics || [];
    const awayStats = awayTeam?.statistics || [];

    const awayStatsMap = {};
    awayStats.forEach(stat => {
        awayStatsMap[stat.name] = stat;
    });

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="box-score-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Box Score</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="teams-header">
                    <div className="team-header">
                        <img src={awayTeam?.team?.logo} alt={awayTeam?.team?.displayName} />
                        <span>{awayTeam?.team?.displayName}</span>
                    </div>
                    <div className="team-header">
                        <img src={homeTeam?.team?.logo} alt={homeTeam?.team?.displayName} />
                        <span>{homeTeam?.team?.displayName}</span>
                    </div>
                </div>

                <div className="stats-table">
                    {homeStats.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Stat</th>
                                    <th>{awayTeam?.team?.abbreviation}</th>
                                    <th>{homeTeam?.team?.abbreviation}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {homeStats.map((homeStat) => {
                                    const awayStat = awayStatsMap[homeStat.name];
                                    return (
                                        <tr key={homeStat.name}>
                                            <td className="stat-name">{homeStat.label || homeStat.displayName || homeStat.name}</td>
                                            <td>{awayStat?.displayValue || '-'}</td>
                                            <td>{homeStat.displayValue || '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                            No statistics available for this game
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BoxScore;