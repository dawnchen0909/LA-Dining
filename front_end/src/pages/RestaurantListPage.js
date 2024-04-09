// RestaurantListPage.js
import React, { useState, useEffect } from "react";
import "./RestaurantListPage.css"; // Make sure to create a corresponding CSS file
import { useNavigate } from "react-router-dom";
import RestaurantItem from "../Components/RestaurantItem";
import axios from "axios";

function RestaurantListPage() {
  const [recommends, setRecommends] = useState([]); // This should be your actual restaurant data
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTag, setCurrentTag] = useState("recommend");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurants from the Django backend
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Restaurant/');
        setRecommends(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchRestaurants();
  }, []);

  // 这俩做对接
  const [histories, setHistories] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Handle search functionality
  const handleSearch = (e) => {
    if (e.key === "Enter") setSearchTerm(e.target.value);
    // Filter restaurant list based on search term
  };

  function filterRestaurants(restaurants) {
    return restaurants.filter(
      (restaurant) =>
        restaurant.restaurantName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const restaurants =
    currentTag === "recommend"
      ? filterRestaurants(recommends)
      : currentTag === "history"
      ? filterRestaurants(histories)
      : currentTag === "favorite"
      ? filterRestaurants(favorites)
      : recommends;
  // Rendered list based on search term

  return (
    <div className="restaurant-list-page">
      {/* Tabs and Search Bar */}
      <div className="top-bar">
        <div className="tabs">
          <button
            className={currentTag === "recommend" ? "active" : ""}
            onClick={() => setCurrentTag("recommend")}
          >
            All Restaurants
          </button>
          <button
            className={currentTag === "favorite" ? "active" : ""}
            onClick={() => navigate('/recommend')}
          >
            Recommend
          </button>
          <button
            className={currentTag === "history" ? "active" : ""}
            onClick={() => navigate('/history')}
          >
            History
          </button>
          <button
            className={currentTag === "favorite" ? "active" : ""}
            onClick={() => navigate('/favorite')}
          >
            Favorite
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            if (!e.target.value) {
              setSearchTerm(e.target.value);
            }
          }}
          onKeyUp={handleSearch}
        />
      </div>
      {/* Restaurant List */}
      <div className="restaurant-list">
        {currentTag === "recommend" &&
          filterRestaurants(restaurants).map((restaurant) => (
            <RestaurantItem restaurant={restaurant} key={restaurant.restaurantName} />
          ))}
      </div>
    </div>
  );
}

export default RestaurantListPage;

