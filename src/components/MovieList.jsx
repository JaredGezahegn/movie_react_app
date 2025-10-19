import MovieCard from "./MovieCard";

const MovieList = ({ movieList, isLoading }) => {
  if (isLoading) return <p className="text-white text-xl mt-8">Loading...</p>;
  if (!movieList.length)
    return <h2 className="text-white text-xl mt-8">No movies found</h2>;

  return (
    <ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {movieList.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
};

export default MovieList;
