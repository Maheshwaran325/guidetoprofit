// import supabase from '../config/supabase.js';

// export const authenticateToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   try {
//     const { data: { user }, error } = await supabase.auth.getUser(token);

//     if (error || !user) {
//       return res.sendStatus(403);
//     }

//     // Fetch the project for this user
//     const { data: project, error: projectError } = await supabase
//       .from('Projects')
//       .select('id')
//       .eq('auth_user_id', user.id)
//       .single();

//     if (projectError) {
//       console.error('Error fetching project:', projectError);
//       return res.sendStatus(500);
//     }

//     if (!project) {
//       console.error('No project found for user');
//       return res.sendStatus(404);
//     }

//     req.user = user;
//     req.projectId = project.id;
//     next();
//   } catch (error) {
//     console.error('Error verifying token:', error.message);
//     return res.sendStatus(403);
//   }
// };

import supabase from '../config/supabase.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Supabase auth error:', error.message);
      return res.status(403).json({ error: 'Invalid token' });
    }

    if (!data.user) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = data.user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};