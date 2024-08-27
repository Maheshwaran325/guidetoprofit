import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../auth/supabaseClient';
import { ProjectContext } from '../../ProjectContext';
import './login.css';
import { Eye, EyeOff } from 'lucide-react';  
import loginimg from '../../components/assets/images/login.png';
import logo from '../../components/assets/images/guide2solve.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setProjectId } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    setError(null); // Reset error when email or password changes
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;

      if (!data || !data.user) {
        throw new Error('Sign-in successful, but user data is missing');
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        // Email not verified, send new OTP and redirect to verification page
        await supabase.auth.signOut(); // Sign out the unverified session
        const { error: otpError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        if (otpError) throw otpError;
        navigate('/signup', { state: { email } });
        return;
      }

      // Email verified, proceed with login
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('auth_user_id', data.user.id)
        .single();

      if (projectError) {
        if (projectError.code === 'PGRST116') {
          // Project doesn't exist, create a new one
          const { data: newProjectData, error: createProjectError } = await supabase
            .from('projects')
            .insert({ auth_user_id: data.user.id })
            .select()
            .single();

          if (createProjectError) throw createProjectError;
          setProjectId(newProjectData.id);
        } else {
          throw projectError;
        }
      } else {
        setProjectId(projectData.id);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={toggleShowPassword} className="show-password-button">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <br/>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p>New to this? <Link to="/signup">Signup</Link></p>
        </form>
      </div>
      <div className="right-panel">
        <img src={logo} alt="logo" style={{width:"300px", paddingBottom:"30px"}} />
        <p>Join the community! Create your account today.</p>
        <Link to="/signup"><button className="signup-button">Signup</button></Link>
        <div className="illustration">
          <img src={loginimg} alt="Illustration" />
        </div>
      </div>
    </div>
  );
}

export default Login;