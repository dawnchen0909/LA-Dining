import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function RestaurantItem({ restaurant, onClick: setHistories }) {
  const navigate = useNavigate();

  return (
    <div
      className="restaurant-item"
      onClick={() =>
        navigate(`/restaurants/${restaurant.restaurantName}`, { state: restaurant })
      }
    >
      <div className="restaurant-details">
        <span className="restaurant-name">{restaurant.restaurantName}</span>
        <div className="restaurant-meta">
          {/* <span className="restaurant-rating">Rating: {ratings.length > 0 ? ratings[0].score : 'Loading...'}</span> */}
          <span className="restaurant-style">Style: {restaurant.style}</span>
          <span className="restaurant-price">Price: {restaurant.price}</span>
        </div>
      </div>
      <span className="restaurant-address">{restaurant.address}</span>
    </div>
  );
}

export default RestaurantItem;
