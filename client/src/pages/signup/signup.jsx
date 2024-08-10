import React, { useState, useEffect, useContext } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../auth/supabaseClient';
import { ProjectContext } from '../../ProjectContext';
import signupimg from '../../components/assets/images/sign-up.png';
import logo from '../../components/assets/images/guide2solve.png';

function Signup() {
  const { setProjectId } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  useEffect(() => {
    setError(null); // Reset error when any input changes
  }, [name, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign up the user
      const { data, error } = await signUp({ email, password });
      if (error) throw error;
  
      if (data && data.user) {
        // Update user's display name
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: name }
        });
  
        if (updateError) throw updateError;
  
        try {
          // Attempt to create a new project for the user
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .insert({ auth_user_id: data.user.id })
            .single();
  
          if (projectError) {
            console.error('Error creating project:', projectError);
          } else {
            console.log('Project created successfully:', projectData);
            // Store projectId in state
            setProjectId(projectData.id);
          }
        } catch (projectError) {
          console.error('Error in project creation:', projectError);
          // Continue with signup process even if project creation fails
        }
        
        alert('Signup successful!');
        navigate('/login');
      } else {
        throw new Error('User data not available after signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    }
  };
    return (
        <div className="App">
          <div className="contain-panel">
            <div className="left-panel">
              <form onSubmit={handleSubmit} className="signup-form">
                <h5 className='text-center'>Signup</h5>
                {error && <p className="error">{error}</p>}
                <br/>
                <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />                <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />                
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />                <br/>
                <button type="submit" className="signup-button">Sign Up</button>
                <p>Already Registered? <Link to="/login">Login</Link></p>
              </form>
            </div>
            <div className="right-panel">
              <img src={logo} alt="logo" style={{width:"300px", paddingBottom:"30px"}} />

              {/* <h2></h2> */}
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
