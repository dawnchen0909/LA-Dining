// RestaurantListPage.js
import React, { useState, useEffect, useContext } from "react";
import "./Favorite.css"; // Make sure to create a corresponding CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';


function Favorite() {
    const [favorite, setFavorite] = useState([]);
    const { user } = useContext(UserContext);
    const username = user?.username || localStorage.getItem('username'); // Fallback to local storage

    useEffect(() => {
        // Fetch restaurants from the Django backend
        const fetchFavorite = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/favorites/${username}/`);
             // Filter favorites based on the isFavorite status in local storage
             const filteredFavorites = response.data.filter(item => 
                localStorage.getItem(`isFavorite_${item.restaurantName}`) === 'true'
            );
           
            // setFavorite(response.data);
            setFavorite(filteredFavorites);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
        };

        fetchFavorite();
    }, [username]);

    
    
    return (
        <div className="favorite-page"> {/* Use the class name as defined in your CSS */}
            <h1 className="favorite-title">Favorites of {username}</h1>
            <ul className="favorite-list">
                {favorite.map((item) => (
                    <li key={item.favoriteID} className="favorite-item">
                        <span className="favorite-item-name">{item.restaurantName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Favorite;
