import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import { Circles } from 'react-loader-spinner';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setloading] = useState(false)

  async function handleSearch() {
    try {
      setloading(true)
      const response = await axios.post('http://localhost:4000/api/search', { query });
      setloading(false)
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleScrape() {
    try {
      setloading(true)
      const urls = searchResults.map(result => result.url);
      const response = await axios.post('http://localhost:4000/api/scrape', { urls });
      setloading(false)
      setScrapedData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <div>
        <input type="text" onChange={(event) => setQuery(event.target.value)} />
        <button onClick={handleSearch}>Search</button>

      </div>
      <div>

        <h2>Search Results:</h2>

        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleScrape}>Scrape</button>
        <h2>Scraped Data:</h2>
        {loading ? <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        /> : <ul>
          {scrapedData.map((data, index) => (
            <li key={index}>
              <h3>URL: {data.url}</h3>
              <p>{data.text}</p>
            </li>
          ))}
        </ul>}
      </div>
    </div>
  );
}

export default App;
