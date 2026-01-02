const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'scorigami-data.json');

app.use(cors());
app.use(express.json());


app.post('/api/update-data', async (req, res) => {
    try {
        console.log('Fetching data from ESPN API...');
        const allGames = [];
        
        for (let year = 1970; year <= 2025; year++) {
            const startDate = `${year}0901`;
            const endDate = `${Number(year) + 1}0301`;
            const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=400&dates=${startDate}-${endDate}`;
            
            try {
                const { data } = await axios.get(url);
                allGames.push(...(data.events || []));
                console.log(`Fetched data for year ${year}`);
            } catch (err) {
                console.error(`Error fetching year ${year}:`, err.message);
            }
        }
        
      
        fs.writeFileSync(DATA_FILE, JSON.stringify(allGames, null, 2));
        console.log(`Saved ${allGames.length} games to file`);
        
        res.json({ success: true, count: allGames.length, message: 'Data updated successfully' });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});


const buildScorigamiDict = (scores) => {
    const scoreDict = {};
    scores.forEach(game => {
        const competition = game.competitions?.[0];
        const homeTeam = competition?.competitors?.find(t => t.homeAway === 'home');
        const awayTeam = competition?.competitors?.find(t => t.homeAway === 'away');
        const homeScore = homeTeam?.score;
        const awayScore = awayTeam?.score;
        if (homeScore !== undefined && awayScore !== undefined) {
            // Normalize score so lower comes first (24-21 and 21-24 both become 21-24)
            const sortedScores = [homeScore, awayScore].sort((a, b) => a - b);
            const scoreKey = `${sortedScores[0]}-${sortedScores[1]}`;
            if (!scoreDict[scoreKey]) {
                scoreDict[scoreKey] = [];
            }
            scoreDict[scoreKey].push(game);
        }
    });
    return scoreDict;
};

app.get('/api/scorigami-data', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.status(404).json({ success: false, error: 'Data file not found. Please click Update Data first.' });
        }
        
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        const games = JSON.parse(rawData);
        const scoreDict = buildScorigamiDict(games);
        res.json({ success: true, scoreDict });
    } catch (err) {
        console.error('Error reading data:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
