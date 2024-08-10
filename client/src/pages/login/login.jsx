import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../auth/supabaseClient';
import './login.css';
import loginimg from '../../components/assets/images/login.png';
import logo from '../../components/assets/images/guide2solve.png';
import { ProjectContext } from '../../ProjectContext';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setProjectId } = useContext(ProjectContext); 
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    setError(null); // Reset error when email or password changes
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
  
      // Retrieve project data for the logged-in user
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('auth_user_id', data.user.id)
        .single();
  
      if (projectError) {
        console.error('Error retrieving project:', projectError);
        throw projectError;
      }
  
      // Store projectId in state
      setProjectId(projectData.id);
  
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };
  
  return (
      <div className="contain-panel">
        <div className="left-panel">
        <form onSubmit={handleSubmit} className="login-form">
          <h5 className='text-center'>Login</h5>
          {error && <p className="error">{error}</p>}
          <br/>
          <input
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
        />
                    <br/>
            <button type="submit" className="login-button">Login</button>
            <p>New to this?  <Link to="/signup">Signup</Link> </p>
          </form>
        </div>
        <div className="right-panel">
        <img src={logo} alt="logo" style={{width:"300px", paddingBottom:"30px"}} />
          <p>Join the community! Create your account today.</p>
          <Link to="/signup"><button className="signup-button">Signup</button> </Link>
          <div className="illustration">
          <img src={loginimg} alt="Illustration" />
          </div>
        </div>
      </div>
  );
}
export default Login;



