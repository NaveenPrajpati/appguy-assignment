const express = require('express');
const axios = require('axios');
const ScrapingBee = require('scrapingbee');
const cors=require('cors')
const dotevn=require('dotenv')
dotevn.config()
const app = express();
const port = 4000; // Set your desired port number
app.use(cors({
    origin:'http://localhost:3000'
}))
// ScrapingBee API Key
const SCRAPINGBEE_API_KEY = 'BQZ5TS5A7KES98PAI0C655XLNZAEC9KXBGBKL1FAPRV3N8G0HJV5SIB70KI1CCUYBZED6H1BDR9C9JAD';

// Middleware to enable JSON parsing for incoming requests
app.use(express.json());

// Endpoint to fetch search results from Custom Search API
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
   


    const googleResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: process.env.googleAPIKey,
        cx: process.env.googleCX,
        q: query,
      },
    });

    const searchResults = googleResponse.data.items.map(item => ({
      title: item.title,
      url: item.link,
    }));

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching search results.' });
  }
});

// Endpoint to scrape the URLs using ScrapingBee API
app.post('/api/scrape', async (req, res) => {
  try {
    const { urls } = req.body;

    const scrapedData = [];

    for (const url of urls) {
      try {


        var client = new ScrapingBee.ScrapingBeeClient(process.env.SCRAPINGBEE_API_KEY);
        var response = await client.get({
          url: url,
          params: {
            'extract_rules': {
              // Data extraction
              title: 'h1',
              desc: 'h2',
            },
          },
        });

        var decoder = new TextDecoder();
        var text = decoder.decode(response.data);
        console.log('Data is here:', text);

        scrapedData.push({ url, text });
      } catch (error) {
        console.error('An error occurred while scraping:', error);
        // If you want to handle the error for a specific URL,
        // you can push a partial result or skip the URL and continue with the loop.
      }
    }

    console.log('All data loaded successfully:', scrapedData);
    res.json(scrapedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping the URLs.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
