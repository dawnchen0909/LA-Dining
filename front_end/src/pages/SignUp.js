// LoginPage.js
import React from 'react';
import './SignUp.css'; // Make sure to create a corresponding CSS file

function SignUp() {
  const handleLogin = (event) => {
    event.preventDefault();
    // Logic for handling login
    // Redirect to Restaurant List Page upon successful login
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input type="text" id="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="userId">Your User-ID</label>
            <input type="text" id="userId" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Your password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" className="submit-button">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
