import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const { Title, Poster, Year, imdbID } = movie;

  return (
    <li className="movie-card">
      <Link to={`/movie/${imdbID}`}>
        <img
          src={Poster !== "N/A" ? Poster : "/no-image.png"}
          alt={Title}
          className="rounded-lg h-64 w-full object-cover"
        />
        <h3 className="mt-2">{Title}</h3>
        <p className="text-gray-100 mt-1">{Year}</p>
      </Link>
    </li>
  );
};

export default MovieCard;
