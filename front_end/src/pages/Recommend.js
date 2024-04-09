// RestaurantListPage.js
import React, { useState, useEffect, useContext } from "react";
import "./Recommend.css"; // Make sure to create a corresponding CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';


function Recommend() {
    const [recommend, setRecommend] = useState([]);
    const { user } = useContext(UserContext);
    const username = user?.username || localStorage.getItem('username'); // Fallback to local storage

    useEffect(() => {
        // Fetch restaurants from the Django backend
        const fetchRecommend = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/recommand/${username}/`);
            setRecommend(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
        };

        fetchRecommend();
    }, [username]);
    
    return (
        <div className="favorite-page"> {/* Use the class name as defined in your CSS */}
            <h1 className="favorite-title">Recommend for {username}</h1>
            <ul className="favorite-list">
                {recommend.map((item) => (
                    <li key={item.restaurantName} className="favorite-item">
                        <span className="favorite-item-name">{item.style}</span>
                        <span className="favorite-item-name">{item.price}</span>
                        <span className="favorite-item-name">{item.address}</span>
                        <span className="favorite-item-name">{item.zip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recommend;
