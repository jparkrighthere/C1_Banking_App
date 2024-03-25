import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Form.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    // error checking
    e.preventDefault();
    if (username == '') {
        setErrorMessage("Username not entered");
        return;
    }
    if (password == '') {
        setErrorMessage("Password not entered");
        return;
    }
    setErrorMessage("");

    // call backend api's to check if user is valid and then sign in
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
       
            body: JSON.stringify({ username: username, password: password }),
          });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error with login');
        }
        
        const responseData = await response.json();
        const { access_token } = responseData;
        // Handle successful registration, e.g., store access token in local storage
        console.log('Login successful. Access token:', access_token);
        navigate("/");
    } catch (error) {
        console.error('Login failed: ', error.message);
    }
    return;
    //navigate("/");
  };

  return (
    <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
        <div className="form-container">
        <form className="form" onSubmit={handleSignIn}>
            <h2>Sign In</h2>
            <div className="input-container">
                <label>Username: </label>
                <input placeholder="Username" className={'inputBox'} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-container">
                <label>Password: </label>
                <input placeholder="Password" className={'inputBox'} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register Here</Link></p>
        </div>
    </div>
  );
};

export default SignIn;
