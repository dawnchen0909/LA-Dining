import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';
import "./RestaurantDetailPage.css";

function RestaurantDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const username = user?.username || localStorage.getItem('username');
  const { state: restaurant } = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  function addFavorite() {
    axios.post(`http://localhost:8000/api/add/${username}/`, {
      restaurantName: restaurant.restaurantName
    })
    .then(response => {
      setIsFavorite(true);
      localStorage.setItem(`isFavorite_${restaurant.restaurantName}`, true);
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error adding to favorite: ', error);
    });
  }

  function removeFavorite() {
    axios.delete(`http://localhost:8000/api/delete/${username}/`, {
      data: { restaurantName: restaurant.restaurantName }
    })
    .then(response => {
      setIsFavorite(false);
      localStorage.setItem(`isFavorite_${restaurant.restaurantName}`, false);
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error removing from favorite: ', error);
    });
    localStorage.setItem(`isFavorite_${restaurant.restaurantName}`, false);
    console.log('unfavorite',isFavorite)
  }

  function toggleFavorite() {
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  }

  const [ratings, setRatings] = useState([]);
  const [allrate, setAllRate] = useState([]);
  const encodedRestaurantName = encodeURIComponent(restaurant.restaurantName);

  useEffect(() => {
    const favoriteStatus = localStorage.getItem(`isFavorite_${restaurant.restaurantName}`);
    console.log('useeffect: ',favoriteStatus)
    setIsFavorite(favoriteStatus === 'true');
    // setIsFavorite(favoriteStatus);
  }, [restaurant]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/ratings/${encodedRestaurantName}/`);
        setRatings(response.data[0].score);
        setAllRate(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    

    fetchRatings();
  }, [encodedRestaurantName]);

  // You can include another useEffect here to fetch the favorite status when the component mounts
  // This is left as a placeholder since the exact implementation depends on your backend API
  useEffect(() => {
    // Fetch the initial favorite status...
  }, [username, restaurant]);

  return (
    <div className="restaurantDetailPage">
      <div className="container">
        <div className="pageTitle">
          <h1>{restaurant.restaurantName}</h1>
          <button
            className={`favoriteButton${isFavorite ? " isFavorite" : ""}`}
            onClick={toggleFavorite}
          >
            <img src="./../../star.jpg" alt="star" />
          </button>
        </div>
        <div className="restaurantDetails">
          <div>
            <label>Rating:</label>
            <span>{ratings}</span>
          </div>
          <div>
            <label>Style:</label>
            <span>{restaurant.style}</span>
          </div>
          <div>
            <label>Price:</label>
            <span>{restaurant.price}</span>
          </div>
          <div>
            <label>Address:</label>
            <span>{restaurant.address}</span>
          </div>
        </div>
        <div className="restaurantComments">
          {allrate.map((rating) => (
            <div key={rating.ratingID}>
              <p><strong>Comment:</strong> {rating.comment}</p>
            </div>
          ))}
        </div>
        <button className="backButton" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
}

export default RestaurantDetailPage;
