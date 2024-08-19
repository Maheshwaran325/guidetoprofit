import app from './app.js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
