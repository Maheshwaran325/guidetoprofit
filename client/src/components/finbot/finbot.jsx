import React, { useState, useEffect, useRef, useCallback } from 'react';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility'; 
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.css';
import { SiChatbot } from "react-icons/si";
import { FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './finbot.css';

const MAX_MESSAGES_PER_DAY = 24;

const Finbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Welcome to the Finbot!', sender: 'bot' },
    { text: 'Before we start, I need to ask you 4 questions.', sender: 'bot' },
    { text: 'What is your startup stage?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [, setIsInitialQuestionsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [, setLastResetDate] = useState(null);

  const chatContainerRef = useRef(null);

  const questions = [
    'What is your startup stage?',
    'What is your industry type?',
    'What is your business model?',
    'Describe your company/startup with some keywords for best results'
  ];

  useEffect(() => {
    const fetchMessageCount = async () => {
      try {
        const response = await authenticatedRequest('http://localhost:8000/api/chat/count', 'GET');
        setMessageCount(response.data.count);
        setLastResetDate(response.data.lastResetDate);
      } catch (error) {
        console.error('Error fetching message count:', error);
      }
    };

    fetchMessageCount();
  }, []);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const sendMessage = useCallback((message, isUser = true) => {
    if (messageCount >= MAX_MESSAGES_PER_DAY) {
      alert("You've reached the maximum number of messages for today. Please try again tomorrow.");
      return;
    }

    setMessages(prev => [...prev, { text: message, sender: isUser ? 'user' : 'bot' }]);
    setMessageCount(prevCount => prevCount + 1);
    setInput('');
  }, [messageCount]);

  const handleFormSubmit = async () => {
    if (input.trim()) {
      sendMessage(input);
      
      if (questionIndex < 4) {
        setUserInfo(prev => [...prev, input]);
        setQuestionIndex(prevIndex => prevIndex + 1);
        if (questionIndex < 3) {
          setIsTyping(true);
          setTimeout(() => {
            sendMessage(questions[questionIndex + 1], false);
            setIsTyping(false);
          }, 1000);
        } else {
          setIsInitialQuestionsComplete(true);
          setIsTyping(true);
          setTimeout(() => {
            sendMessage('Thank you! You can now ask your financial questions.', false);
            setIsTyping(false);
          }, 1000);
        }
      } else {
        try {
          setIsTyping(true);
          const response = await authenticatedRequest('http://localhost:8000/api/chat', 'POST', { message: input, userInfo });
          setIsTyping(false);
          sendMessage(response.data.message, false);
        } catch (error) {
          console.error('Error fetching response:', error);
          setIsTyping(false);
          sendMessage('Sorry, I encountered an error.', false);
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
        <div 
          className="chat-container mb-3 flex-grow-1 overflow-auto"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>           
         </div>
          ))}
          {isTyping && (
            <div className="chat-message bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
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
      </Modal>
    </>
  );
};

export default Finbot;