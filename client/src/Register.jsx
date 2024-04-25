import { useState,useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Form.css';
import AuthContext from './AuthContext';



const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    // error checking
    if (username == '') {
        setErrorMessage("Username not entered");
        return;
    }
    if (password == '') {
        setErrorMessage("Password not entered");
        return;
    }
    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
    }
    setErrorMessage("");

    // create user using backend api and then go to main page
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
       
            body: JSON.stringify({ username: username, password: password }),
          });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error with registration');
        }
        
        const responseData = await response.json();
        const { access_token } = responseData;
        localStorage.setItem('access_token', access_token);
        // Handle successful registration, e.g., store access token in local storage
        console.log('Registration successful. Access token:', access_token);
        login(access_token);
        navigate("/");
    } catch (error) {
        console.error('Registration failed: ', error.message);
    }
    navigate("/");
    return;
  };

  return (
    <div style={{
        position: 'absolute',
        left: '50%',
        top: '45%',
        transform: 'translate(-50%, -50%)'
    }}>
        <div className="form-container">
        <form className="form">
        <img src="/Images/logo.png" alt="Capital One Logo" className="formLogo"/>
            <h2> Create an Account </h2>
            <div className="input-container">
                <label>Username: </label>
                <input placeholder="Username" className={'inputBox'} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-container">
                <label>Password: </label>
                <input placeholder="Password" className={'inputBox'} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input-container">
                <label>Confirm Password: </label>
                <input placeholder="Confirm Password" className={'inputBox'} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button onClick={handleCreateAccount}>Create Account</button>
        </form>
        <p className="pageNav">Already have an account? <Link to="/signin">Sign In</Link></p>
        </div>
        </div>
  );
};

export default Register;
