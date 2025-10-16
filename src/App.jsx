import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import debounce from "lodash/debounce";


 

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   
    useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000); // waits 1000ms after user stops typing

    return () => clearTimeout(timer); // cleanup on every keystroke
  }, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let allMovies = [];
      let page = 1;
      let totalResults = 0;

      do {
        const formattedQuery =
          query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
        const endpoint = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
          formattedQuery
        )}&page=${page}`;

        const response = await fetch(endpoint);

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();

        if (data.Response === "False") {
          if (page === 1) {
            setErrorMessage(data.Error || "No movies found");
            setMovieList([]);
          }
          break;
        }

        allMovies = [...allMovies, ...(data.Search || [])];
        totalResults = parseInt(data.totalResults);
        page++;
      } while (allMovies.length < totalResults && page <= 5);

      setMovieList(allMovies);

    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies("movie");
  }, []); // Fetch default movies on initial load

  useEffect(() => {
    if (debouncedTerm.trim() !== "") {
      fetchMovies(debouncedTerm);
    } 
  }, [debouncedTerm]);

 

  return (
    <main>
      <div className="pattern" style={{ backgroundImage: "url('/BG.png')" }}>
        <div className="wrapper">
          <header>
            <img src="/hero-img.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

    
          
          <section className="all-movies">
            <h2 className='mt-8 mb-1 text-left'>All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4">
                {movieList.map((movie) => (
                  <MovieCard key={`${movie.imdbID}-${Math.random()}`} movie={movie} />

                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
