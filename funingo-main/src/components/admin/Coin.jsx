import React from 'react';
import coin from '../booknow/images/coin1.png';

const Coin = ({ size }) => {
  return (
    <div>
      <img src={coin} alt="coin" style={{ width: 25, height: 25, paddingTop: '3.4px', paddingLeft: '3px' }} />
    </div>
  );
};

export default Coin;
