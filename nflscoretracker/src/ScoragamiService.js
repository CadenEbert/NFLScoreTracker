import axios from 'axios';


export const fetchScoragamiData = async (year) => {
    try {
        const startDate = `${year}0901`;
        const endDate = `${Number(year) + 1}0301`;
        const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=400&dates=${startDate}-${endDate}`;
        const { data } = await axios.get(url);
        return data.events || [];
    } catch (err) {
        console.error('Error fetching scoragami data:', err);
        throw err;
    }
};

export const buildScoragamiDict = (scores) => {
    const scoreDict = {};
    scores.forEach(game => {
        const competition = game.competitions?.[0];
        const homeTeam = competition?.competitors?.find(t => t.homeAway === 'home');
        const awayTeam = competition?.competitors?.find(t => t.homeAway === 'away');
        const homeScore = homeTeam?.score;
        const awayScore = awayTeam?.score;
        const scoreKey = `${awayScore}-${homeScore}`;
        if (!scoreDict[scoreKey]) {
            scoreDict[scoreKey] = [];
        }
        scoreDict[scoreKey].push(game);
    }   );                                  
    return scoreDict;
};