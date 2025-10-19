import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import BG from './assets/BG.png';
import heroImg from './assets/hero-img.png';



import "./App.css";
import Search from "./components/Search";
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch movies function
  const fetchMovies = async (query = "movie") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      let allMovies = [];
      let page = 1;
      let totalResults = 0;

      do {
        const formattedQuery =
          query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
        const response = await fetch(
          `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
            formattedQuery
          )}&page=${page}`
        );
        const data = await response.json();

        if (data.Response === "False") {
          if (page === 1) setErrorMessage(data.Error || "No movies found");
          break;
        }

        allMovies = [...allMovies, ...(data.Search || [])];
        totalResults = parseInt(data.totalResults);
        page++;
      } while (allMovies.length < totalResults && page <= 5);

      // Remove duplicate movies by imdbID
      const uniqueMovies = Array.from(
        new Map(allMovies.map((movie) => [movie.imdbID, movie])).values()
      );

      setMovieList(uniqueMovies);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch movies. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMovies();
  }, []);

  // Fetch when search changes
  useEffect(() => {
    if (debouncedTerm.trim() !== "") {
      fetchMovies(debouncedTerm);
    }
  }, [debouncedTerm]);

  return (
    <Router>
      <div  className="pattern w-full max-w-full object-cover  relative z-0" style={{ backgroundImage: `url(${BG})`}}>
        <div className="wrapper">
          <header>
            <img src={heroImg} alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          <Routes>
            {/* Home page */}
            <Route
              path="/"
              element={<MovieList movieList={movieList} isLoading={isLoading} />}
            />

            {/* Movie detail page */}
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
