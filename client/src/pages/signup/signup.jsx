import React, { useState, useEffect } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import signupimg from '../../components/assets/images/sign-up.png';
import logo from '../../components/assets/images/guide2solve.png';
import { supabase } from '../../auth/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signupStage, setSignupStage] = useState('initial');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  useEffect(() => {
    setError(null);
  }, [email, password, name, confirmPassword]);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
  
    try {
      const { data, error } = await signUp({ email, password, name });
      if (error) {
        if (error.message.includes('OTP')) {
          console.error('OTP-related error:', error);
          setError('There was an issue with the signup process. Please try again later.');
        } else {
          throw error;
        }
      } else if (data) {
        setSignupStage('otp');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    }finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) throw error;

      alert('Email verified successfully!');
      
      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="App">
      <div className="contain-panel">
        <div className="left-panel">
          {signupStage === 'initial' ? (
            <form onSubmit={handleInitialSubmit} className="signup-form">
              <h5 className='text-center'>Signup</h5>
              {error && <p className="error">{error}</p>}
              <br/>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button type="button" onClick={toggleShowPassword} className="show-password-button">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button type="button" onClick={toggleShowConfirmPassword} className="show-password-button">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <br/>
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
              <p>Already Registered? <Link to="/login">Login</Link></p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="signup-form">
              <h5 className='text-center'>Verify Email</h5>
              {error && <p className="error">{error}</p>}
              <br/>
              <p>Enter the OTP sent to {email}</p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <br/>
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}
        </div>
        <div className="right-panel">
          <img src={logo} alt="logo" style={{width:"300px", paddingBottom:"30px"}} />
          <p>Welcome! Already registered? Let's get started!</p>
          <Link to="/login"> <button className="login-button">Login</button> </Link>
          <div className="illustration">
            <img src={signupimg} alt="Illustration" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;