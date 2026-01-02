import React, { useEffect, useState } from 'react';
import './styles/Scorigami.css';
import { fetchScorigamiData, updateScorigamiData } from './ScorigamiService';


function Scorigami() {
    const [scoreDict, setScoreDict] = useState({});
    const [filterYear, setFilterYear] = useState('all');
    const [filterTeam, setFilterTeam] = useState('all');
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchScorigamiData().then(setScoreDict).catch(err => console.error(err));
    }, []);

    const handleUpdateData = async () => {
        setLoading(true);
        try {
            const result = await updateScorigamiData();
            alert(`Updated! ${result.count} games saved.`);
            setLastUpdated(new Date().toLocaleString());
            const data = await fetchScorigamiData();
            setScoreDict(data);
        } catch (err) {
            alert('Error updating data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scorigami">
            <h1>Scorigami Tracker</h1>
            <button onClick={handleUpdateData} disabled={loading} className="update-btn">
                {loading ? 'Updating...' : 'Update Data'}
            </button>
            {lastUpdated && <p className="last-updated">Last updated: {lastUpdated}</p>}
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="year-selector">
                <option value="all">All Years</option>
                {Array.from({ length: 56 }, (_, i) => 1970 + i).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                ))}
            </select>
            <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} className ="team-selector">
                <option value="all">All Teams</option>
                <option value="ARI">Arizona Cardinals</option>
                <option value="ATL">Atlanta Falcons</option>
                <option value="BAL">Baltimore Ravens</option>
                <option value="BUF">Buffalo Bills</option>
                <option value="CAR">Carolina Panthers</option>
                <option value="CHI">Chicago Bears</option>
                <option value="CIN">Cincinnati Bengals</option>
                <option value="CLE">Cleveland Browns</option>
                <option value="DAL">Dallas Cowboys</option>
                <option value="DEN">Denver Broncos</option>
                <option value="DET">Detroit Lions</option>
                <option value="GB">Green Bay Packers</option>
                <option value="HOU">Houston Texans</option>
                <option value="IND">Indianapolis Colts</option>
                <option value="JAX">Jacksonville Jaguars</option>
                <option value="KC">Kansas City Chiefs</option>
                <option value="LAC">Los Angeles Chargers</option>
                <option value="LAR">Los Angeles Rams</option>
                <option value="LV">Las Vegas Raiders</option>
                <option value="MIA">Miami Dolphins</option>
                <option value="MIN">Minnesota Vikings</option>
                <option value="NE">New England Patriots</option>
                <option value="NO">New Orleans Saints</option>
                <option value="NYG">New York Giants</option>
                <option value="NYJ">New York Jets</option>
                <option value="PHI">Philadelphia Eagles</option>
                <option value="PIT">Pittsburgh Steelers</option>
                <option value="SEA">Seattle Seahawks</option>
                <option value="SF">San Francisco 49ers</option>
                <option value="TB">Tampa Bay Buccaneers</option>
                <option value="TEN">Tennessee Titans</option>
                <option value="WAS">Washington Commanders</option>
            </select>

            <table className="scorigami-table">
                <thead>
                    <tr>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody className='scorigami-tbody'>
                    {Object.entries(scoreDict)
                        .filter(([score, games]) => {
                            if (!games || games.length === 0) return false;
                            const gameYear = new Date(games[0].date).getFullYear().toString();
                            if (filterTeam !== 'all') {
                                const homeTeam = games[0].competitions?.[0]?.competitors?.find(t => t.homeAway === 'home')?.team?.abbreviation;
                                const awayTeam = games[0].competitions?.[0]?.competitors?.find(t => t.homeAway === 'away')?.team?.abbreviation;
                                if (filterYear === 'all') {
                                    return homeTeam === filterTeam || awayTeam === filterTeam;
                                }
                                return gameYear === filterYear && (homeTeam === filterTeam || awayTeam === filterTeam);
                            }
                            if (filterYear === 'all') {
                                return true;
                            }
                            return gameYear === filterYear;
                        })
                        .map(([score, games]) => (
                            <tr key={score}>
                                <td>{games[0].competitions[0].competitors.find(t => t.homeAway === 'home').team.displayName}</td>
                                <td>{games[0].competitions[0].competitors.find(t => t.homeAway === 'away').team.displayName}</td>
                                <td>{score}</td>
                                <td>{new Date(games[0].date).toLocaleDateString('en-US')}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            
        </div>
    );
}
export default Scorigami;