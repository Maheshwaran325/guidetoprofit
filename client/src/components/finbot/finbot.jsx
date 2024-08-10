import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.css';
import { SiChatbot } from "react-icons/si";
import { FaPaperPlane } from "react-icons/fa";

import './finbot.css';

const Finbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Welcome to the Finbot!', sender: 'bot' },
    { text: 'Before we start, I need to ask you 4 questions.', sender: 'bot' },
    { text: 'What is your startup stage?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({});

  const questions = [
    'What is your startup stage?',
    'What is your industry type?',
    'What is your business model?',
    'Describe your company/startup with some keywords for best results'
  ];

  const sendMessage = (message) => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    setInput('');
  };

  const handleFormSubmit = async () => {
    if (input.trim()) {
      sendMessage(input);
      
      if (questionIndex < 4) {
        setUserInfo(prev => ({ ...prev, [questionIndex]: input }));
        setQuestionIndex(questionIndex + 1);
        if (questionIndex < 3) {
          setTimeout(() => {
            setMessages(prev => [...prev, { text: questions[questionIndex + 1], sender: 'bot' }]);
          }, 500);
        } else {
          setTimeout(() => {
            setMessages(prev => [...prev, { text: 'Thank you! You can now ask your financial questions.', sender: 'bot' }]);
          }, 500);
        }
      } else {
        try {
          const response = await axios.post('/api/chat', { message: input, userInfo });
          setMessages(prev => [...prev, { text: response.data.message, sender: 'bot' }]);
        } catch (error) {
          console.error('Error fetching response:', error);
          setMessages(prev => [...prev, { text: 'Sorry, I encountered an error.', sender: 'bot' }]);
        }
      }
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFormSubmit();
    }
  };

  const renderInput = () => {
    if (questionIndex < 4) {
      return (
        <input
          list={`question-${questionIndex}`}
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      );
    }
    return (
      <input
        type="text"
        className="form-control"
        placeholder="Ask your financial question"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    );
  };

  return (
    <>
      <button
        className="btn shadow rounded-circle chatbot-button"
        onClick={() => setIsOpen(true)}
      >
        <SiChatbot />
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '20px',
            width: '80%',
            maxWidth: '600px',
            height: '80%',
            maxHeight: '700px',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Finbot:)</h5>
          <button 
            className="btn btn-close" 
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="chat-container mb-3 flex-grow-1 overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-auto d-flex">
          <div className="flex-grow-1 me-2">
            {renderInput()}
          </div>
          <button
            className="btn btn-custom-orange"
            onClick={handleFormSubmit}
            style={{ width: '40px', height: '40px', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <FaPaperPlane />
          </button>
        </div>
        <datalist id="question-0">
          <option value="Early Stage" />
          <option value="Growth Stage" />
          <option value="Mature Stage" />
        </datalist>
        <datalist id="question-1">
          <option value="Technology" />
          <option value="Healthcare" />
          <option value="Finance" />
          <option value="Education" />
          <option value="Retail" />
          <option value="Manufacturing" />
          <option value="Other" />
        </datalist>
        <datalist id="question-2">
          <option value="B2B" />
          <option value="B2C" />
          <option value="D2C" />
          <option value="SaaS" />
          <option value="Marketplace" />
          <option value="Other" />
        </datalist>
        {/* Optional: You can add a datalist for the fourth question if necessary */}
      </Modal>
    </>
  );
};

export default Finbot;
