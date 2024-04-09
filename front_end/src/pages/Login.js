import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'; // Import the CSS file here
import { UserContext } from './UserContext';

function Login() {
    let navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    // const handleLogin = (e) => {
    //     // e.preventDefault();
    //     // Perform login logic here
    //     // ...

    //     // Navigate to another page on successful login
    //     navigate('/restaurants');
    // };

    const handleLogin = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        // Perform login logic here
        // ...

        setUser({ username });
        localStorage.setItem('username', username); // Optional: for persistence

        navigate('/restaurants');
    };
    
    return (
        <div className="login-page">
        <form className="login-form" onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="form-group">
            <label>Username:</label>
            <input type="text" name="username" />
            </div>
            <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" />
            </div>
            {/* <button type="submit" className="submit-button" onSubmit={handleLogin}>Login</button> */}
            <button type="submit" className="submit-button">Login</button>
            {/* <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
            </p> */}
        </form>
        </div>
  );
}

export default Login;