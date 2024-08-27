import React, { useState, useEffect } from 'react';
import './backtotop.css'
import 'bootstrap/dist/css/bootstrap.css';
import { IoIosArrowUp } from "react-icons/io";


function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100); // Show button after 100px scroll
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className= {`back-to-top ${isVisible ? 'visible' : ''} btn shadow rounded-circle`} // Add CSS classes
      onClick={scrollToTop} id='backtotop' style={{
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
    >
      <IoIosArrowUp />
    </button>
  );
}

export default BackToTopButton;
