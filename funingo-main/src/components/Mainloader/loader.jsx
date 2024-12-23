import React, { useState, useEffect } from 'react';
import './style.scss';
import { Cursor } from 'react-simple-typewriter';
import { Grid } from '@mui/material';
import Logo from '../../assets/logo.svg';

const Loader = () => {
  function useTypewriter({ words, loop }) {
    const [textIndex, setTextIndex] = useState(0);
    const [text, setText] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setText(words[textIndex]);
        setTextIndex(prevIndex => (prevIndex + 1) % words.length);
      }, 700);

      return () => {
        clearInterval(interval);
      };
    }, [words, loop]);

    return { text };
  }

  const { text } = useTypewriter({
    words: [
      'Want Fun In',
      'A Go',
      'Go',
      <span className='logo-wrapper'>
        <img className='mainimg' src={Logo} alt={'main-img'}></img>
      </span>
    ],
    loop: {}
  });

  return (
    <Grid
      sx={{
        position: 'absolute',
        top: '-90px',
        height: 'calc(100vh + 90px)',
        width: '100vw',
        zIndex: '10000',
        background: 'white'
      }}
    >
      <div className='load'>
        <Grid
          sx={{
            margin: 'auto'
          }}
        >
          <div className='car-bottom-heading '>
            {text} <Cursor />
          </div>
        </Grid>
      </div>
    </Grid>
  );
};

export default Loader;
