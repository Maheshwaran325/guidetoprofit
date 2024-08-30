// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const corsOptions = {
//   origin: [
//     process.env.FRONTEND_URL,
//     'https://cashcompassclient-maheshwaran325s-projects.vercel.app',
//     'http://localhost:3000'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// export default corsOptions;

import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://cashcompassclient-maheshwaran325s-projects.vercel.app',
      'http://localhost:3000'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

export default corsOptions;