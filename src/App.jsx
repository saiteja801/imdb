import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "552fba20";

const Imdb = () => {
  const [searchTerm, setSearchTerm] = useState("Avengers");
  const [movies, setMovies] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const fetchMovies = async (query) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=movie`
      );
      const data = await response.json();

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailsResponse = await fetch(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
            );
            const details = await detailsResponse.json();
            return {
              ...movie,
              imdbRating: details.imdbRating,
              plot: details.Plot,
              genre: details.Genre,
            };
          })
        );
        setMovies(detailedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const addToCart = (movie) => {
    setCart((prevCart) =>
      prevCart.some((item) => item.imdbID === movie.imdbID)
        ? prevCart
        : [...prevCart, movie]
    );
  };

  const removeFromCart = (imdbID) => {
    setCart(cart.filter((movie) => movie.imdbID !== imdbID));
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo" onClick={() => setSearchTerm("Avengers")}>IMDB</h1>
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒<span className="cart-count">{cart.length}</span>
        </div>
      </header>
      <main>
        <h2 className="section-title">Movie Listings</h2>
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
              <div className="movie-info">
                <h3>{movie.Title}</h3>
                <p>Year: {movie.Year}</p>
                <p>IMDb Rating: ⭐ {movie.imdbRating}</p>
                <p>Genre: {movie.genre}</p>
                <p className="plot">{movie.plot}</p>
                <button className="add-to-cart" onClick={() => addToCart(movie)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <h2>Your Cart</h2>
            <button className="close-cart" onClick={() => setIsCartOpen(false)}>Close</button>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.map((movie) => (
                <div key={movie.imdbID} className="cart-item">
                  <img src={movie.Poster} alt={movie.Title} className="cart-item-poster" />
                  <div>
                    <h3>{movie.Title}</h3>
                    <p>Year: {movie.Year}</p>
                    <p>IMDb Rating: ⭐ {movie.imdbRating}</p>
                    <p>Genre: {movie.genre}</p>
                    <button className="remove-from-cart" onClick={() => removeFromCart(movie.imdbID)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Imdb;
