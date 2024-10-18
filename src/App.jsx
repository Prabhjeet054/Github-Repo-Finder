import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');            
  const [repos, setRepos] = useState([]);          
  const [loading, setLoading] = useState(false);    
  const [error, setError] = useState('');        
  const [sort, setSort] = useState('');          

  const searchRepositories = async () => {
    setLoading(true);
    setError('');  

    try {
      const sortQuery = sort ? `&sort=${sort}` : '';  
      const response = await fetch(`https://api.github.com/search/repositories?q=${query}${sortQuery}`);
      const data = await response.json();

      if (response.ok) {
        setRepos(data.items); 
      } else {
        setError('Error fetching data.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);  
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      searchRepositories();
    }
  };

  return (
    <div className="container">
      <h1>GitHub Repository Search</h1>
      <div className="search-form">
        <input
          type="text"
          placeholder="Enter a keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
          <option value="updated">Latest Activity</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="error">{error}</p>}

      <div className="repo-list">
        {repos.map((repo) => (
          <div key={repo.id} className="repo">
            <h3>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h3>
            <p>{repo.description || 'No description available'}</p>
            <p>⭐ Stars: {repo.stargazers_count} | 🍴 Forks: {repo.forks_count}</p>
            <p>Last Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
