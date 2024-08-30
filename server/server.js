import app from './app.js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const port = process.env.PORT || 8000;

// Add a root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
