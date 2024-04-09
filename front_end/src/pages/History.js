// RestaurantListPage.js
import React, { useState, useEffect, useContext } from "react";
import "./History.css"; // Make sure to create a corresponding CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from './UserContext';


function History() {
    const [history, setHistory] = useState([]);
    const { user } = useContext(UserContext);
    const username = user?.username || localStorage.getItem('username'); // Fallback to local storage

    useEffect(() => {
        // Fetch restaurants from the Django backend
        const fetchHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/user/history/${username}/`);
            setHistory(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
        };

        fetchHistory();
    }, [username]);
    
    return (
        <div className="favorite-page"> {/* Use the class name as defined in your CSS */}
            <h1 className="favorite-title">History of {username}</h1>
            <ul className="favorite-list">
                {history.map((item) => (
                    <li key={item.historyID} className="favorite-item">
                        <span className="favorite-item-name">{item.input}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default History;
