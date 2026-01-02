import React from 'react';
import './styles/Scoragami.css';


function Scoragami() {
    const scoreDict = {};

    const competition = game.competitions?.[0];
    const homeTeam = competition?.competitors?.find(t => t.homeAway === 'home');
    const awayTeam = competition?.competitors?.find(t => t.homeAway === 'away');

    const homeScore = homeTeam?.score;
    const awayScore = awayTeam?.score;

    const scoreKey = `${awayScore}-${homeScore}`;
    if (!scoreDict[scoreKey]) {
        scoreDict[scoreKey] = [];
    }
    useEffect(() => {
        fetchAllScores(2014, 2025).then(setScoreDict);
    }, []);

    return (
        <div className="scoragami">

            <h2>Scoragami Feature Coming Soon!</h2>
            <p>Stay tuned for updates on the Scoragami feature, where you can track unique NFL score combinations!</p>
        </div>
    );
}
export default Scoragami;