// src/modules/chatbot/chatbotRoutes.js

import express from 'express';
import axios from 'axios';

const router = express.Router();

// Replace these with your actual Dialogflow credentials
const DIALOGFLOW_PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID;
const DIALOGFLOW_API_KEY = process.env.DIALOGFLOW_API_KEY;

router.post('/chat', async (req, res) => {
  const { message, userInfo } = req.body;

  try {
    const response = await axios.post(
      `https://dialogflow.googleapis.com/v2/projects/${DIALOGFLOW_PROJECT_ID}/agent/sessions/123456789:detectIntent`,
      {
        queryInput: {
          text: {
            text: message,
            languageCode: 'en-US',
          },
        },
        queryParams: {
          contexts: [
            {
              name: 'user_info',
              lifespanCount: 5,
              parameters: userInfo,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DIALOGFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ message: response.data.queryResult.fulfillmentText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

export default router;