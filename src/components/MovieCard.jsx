import React from "react";

const MovieCard = ({ movie}) => {
 
const { Title, Poster, Year } = movie;

  return (
    <div className="movie-card">
      <img
        src={Poster !== "N/A" ? Poster : "/no-image.png"}
        alt={Title}
        className="w-full h-48 object-cover rounded"
      />
      <div className="mt-4">
        <h3>{Title}</h3>
      </div>
      <div className="content">
        <div className="rating">
          <img src="/Rating.svg" alt="star" />
          <p className='lang'> N/A</p>
        </div>{" "}
        <span>•</span>
        <p className="year">{Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
