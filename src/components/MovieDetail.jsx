import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2 className="text-white text-xl">Loading...</h2>;
  if (!movie || movie.Response === "False")
    return <h2 className="text-white text-xl">Movie not found</h2>;

  return (
    <div className="p-6 text-white">
      <Link to="/" className="text-light-100 hover:underline mb-6 inline-block">
        ⬅ Back to Movies
      </Link>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Poster */}
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
          alt={movie.Title}
          className="w-64 rounded-lg shadow-lg"
        />

        {/* Movie details */}
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-bold">{movie.Title}</h1>
          <p><span className="font-semibold">Year:</span> {movie.Year}</p>
          <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
          <p><span className="font-semibold">Director:</span> {movie.Director}</p>
          <p><span className="font-semibold">Actors:</span> {movie.Actors}</p>
          <p><span className="font-semibold">Plot:</span> {movie.Plot}</p>
          <p><span className="font-semibold">IMDB Rating:</span> {movie.imdbRating}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
