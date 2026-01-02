import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchScorigamiData = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/scorigami-data`);
        return data.scoreDict || {};
    } catch (err) {
        console.error('Error fetching scorigami data:', err);
        throw err;
    }
};

export const updateScorigamiData = async () => {
    try {
        const response = await axios.post(`${API_URL}/update-data`);
        return response.data;
    } catch (err) {
        console.error('Error updating scorigami data:', err);
        throw err;
    }
};

export const buildScorigamiDict = (scores) => {
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
    });
    return scoreDict;
};