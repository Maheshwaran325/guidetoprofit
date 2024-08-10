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

  if (token == null) return res.sendStatus(401);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.sendStatus(403);
  }
};