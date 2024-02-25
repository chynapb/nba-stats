import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Serve files from public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

// Fetch player data
app.get('/api/players', async (req, res) => {
  const { first, last } = req.query;

  try {
    const response = await fetch(
      `${process.env.API_PLAYER_URL}?first_name=${first}&last_name=${last}`,
      {
        headers: {
          Authorization: `${process.env.API_KEY}`,
        },
      }
    );
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(data.data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching player data' });
  }
});

// Fetch player stats
app.get('/api/stats', async (req, res) => {
  const { playerId, selectedSeason } = req.query;

  try {
    const response = await fetch(
      `${process.env.API_STATS_URL}?season=${selectedSeason}&player_ids[]=${playerId}`,
      {
        headers: {
          Authorization: '3b1beaad-9502-41a1-b20c-355457b8342b',
        },
      }
    );
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'Player stats not found' });
    }

    res.json(data.data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching player stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
