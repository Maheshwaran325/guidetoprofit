import React, { useState, useEffect } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import signupimg from '../../components/assets/images/sign-up.png';
import logo from '../../components/assets/images/guide2solve.png';
import { supabase } from '../../auth/supabaseClient';
import { Eye, EyeOff, Info } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const { signUp, businessVertical } = useAuth();
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
  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'Weak',
    requirements: {
      hasLetter: false,
      hasCapital: false,
      hasNumber: false,
      hasMinLength: false
    }
  });


  useEffect(() => {
    setError(null);
  }, [email, password, name, confirmPassword]);

  useEffect(() => {
    evaluatePasswordStrength(password);
  }, [password]);


  const evaluatePasswordStrength = (password) => {
    let score = 0;
    const requirements = {
      hasLetter: /[a-z]/.test(password),
      hasCapital: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 8
    };

    if (requirements.hasLetter) score++;
    if (requirements.hasCapital) score++;
    if (requirements.hasNumber) score++;
    if (requirements.hasMinLength) score++;

    let label = 'Weak';
    if (score === 2) label = 'Fair';
    else if (score === 3) label = 'Good';
    else if (score === 4) label = 'Strong';

    setPasswordStrength({ score, label, requirements });
  };
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
      const { data, error } = await signUp({ email, password, name, businessVertical });
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
    } finally {
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

  const [vertical, setVertical] = useState('');
  const verticalOptions = [
    "Healthcare",
    "Education",
    "Finance",
    "Retail",
    "Technology",
    "Manufacturing",
    "Energy",
    "Media and Entertainment",
    "Professional Services",
    "Telecommunications",
    "Automotive",
    "Aerospace",
    "Heavy Machinery",
    "Consumer Goods",
    "Oil and Gas",
    "Renewable Energy",
    "Utilities",
    "Primary Education",
    "Higher Education",
    "Online Education",
    "Educational Technology",
    "Publishing",
    "Film and Television",
    "Music",
    "Gaming",
    "Legal",
    "Accounting",
    "Consulting",
    "Marketing",
    "Software Development",
    "Hardware Manufacturing",
    "IT Services",
    "Pharmaceuticals",
    "Medical Devices",
    "Healthcare Services",
    "Biotechnology",
    "Banking",
    "Insurance",
    "Financial Services",
    "Fintech",
    "E-commerce",
    "Brick-and-Mortar",
    "Retail Technology"
  ];


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
          
            {/* Vertical Dropdown */}
            <div className="dropdown-container">
              <input
                list="verticals"
                id="vertical"
                placeholder="Business vertical"
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                required
              />
              <datalist id="verticals">
                {verticalOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>

            {/* Password Input */}
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button type="button" onClick={toggleShowPassword} className="show-password-button">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div 
                  className="password-info-icon"
                  onMouseEnter={() => setShowRequirements(true)}
                  onMouseLeave={() => setShowRequirements(false)}
                >
                  <Info size={16} />
                </div>
              </div>
              
              {/* Password Strength Meter */}
              <div className="password-strength-meter">
                <div className="strength-bars">
                  {[...Array(4)].map((_, index) => (
                    <div 
                      key={index} 
                      className={`strength-bar ${index < passwordStrength.score ? 'filled' : ''}`}
                    ></div>
                  ))}
                </div>
                <div className="strength-text">
                  Password Strength: {passwordStrength.label}
                </div>
              </div>

              {/* Password Requirements Tooltip */}
              {showRequirements && (
                <div className="password-requirements-tooltip">
                  <p className={passwordStrength.requirements.hasLetter ? 'met' : ''}>
                    {passwordStrength.requirements.hasLetter ? '✓' : '✗'} At least one letter
                  </p>
                  <p className={passwordStrength.requirements.hasCapital ? 'met' : ''}>
                    {passwordStrength.requirements.hasCapital ? '✓' : '✗'} At least one capital letter
                  </p>
                  <p className={passwordStrength.requirements.hasNumber ? 'met' : ''}>
                    {passwordStrength.requirements.hasNumber ? '✓' : '✗'} At least one number
                  </p>
                  <p className={passwordStrength.requirements.hasMinLength ? 'met' : ''}>
                    {passwordStrength.requirements.hasMinLength ? '✓' : '✗'} Be at least 8 characters
                  </p>
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button type="button" onClick={toggleShowConfirmPassword} className="show-password-button">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            
              {/* Submit Button */}
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
