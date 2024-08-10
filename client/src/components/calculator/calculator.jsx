import React, { useState } from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.css';
import { ImCalculator } from "react-icons/im";

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState('');

  const calculate = (expr) => {
    const tokens = expr.match(/(\d+\.?\d*|[+\-*/%])/g) || [];
    const output = [];
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };

    const applyOperator = () => {
      const operator = operators.pop();
      const b = parseFloat(output.pop());
      const a = parseFloat(output.pop());
      switch (operator) {
        case '+': output.push(a + b); break;
        case '-': output.push(a - b); break;
        case '*': output.push(a * b); break;
        case '/': output.push(a / b); break;
        case '%': output.push(a % b); break;
        default: throw new Error('Invalid operator');
      }
    };

    tokens.forEach(token => {
      if (!isNaN(token)) {
        output.push(token);
      } else {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          applyOperator();
        }
        operators.push(token);
      }
    });

    while (operators.length) {
      applyOperator();
    }

    return output[0];
  };

  const handleClick = (value) => {
    if (value === '=') {
      try {
        setResult(calculate(expression).toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === '⌫') {  // Backspace
      setExpression(prev => prev.slice(0, -1));
    } else {
      setExpression(prev => prev + value);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^[\d+\-*/%.]*$/.test(value)) {
      setExpression(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      try {
        setResult(calculate(expression).toString());
      } catch (error) {
        setResult('Error');
      }
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '%', '+',
    'C', '⌫', '='  // Added backspace button
  ];

  return (
    <>
      <button
        className="btn shadow rounded-circle"
        style={{
          width: '50px',
          height: '50px',
          fontSize: '19px',
          position: 'fixed',
          zIndex: 1000,
          bottom: '80px',
          right: '20px',
          backgroundColor:'#F16635',
          color:'#fff'
        }}
        onClick={() => setIsOpen(true)}
      >
        <ImCalculator />
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)',  // Semi-transparent background
          },
          content: {
            top: '50%',
            left: '50%',
            right: '20px',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(100%, -40%)',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            padding: '20px',
            maxWidth: '300px',
            boxShadow:' rgba(0, 0, 0, 0.35) 0px 5px 15px ',
          },
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="m-0"> </h2>
          <button 
            className="btn btn-close" 
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          ></button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          value={expression}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          className="form-control mb-3"
          value={result}
          readOnly
        />
        <div className="row g-2">
          {buttons.map((btn) => (
            <div key={btn} className={`col-${btn === '=' ? '6' : '3'}`}>
              <button
                className={`btn ${btn === '=' ? 'btn-custom-orange' : 'btn-secondary'} w-100`}
                onClick={() => handleClick(btn)}
                style={btn === '=' ? {backgroundColor: '#F16635', borderColor: '#F16635'} : {}}
              >
                {btn}
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Calculator;
