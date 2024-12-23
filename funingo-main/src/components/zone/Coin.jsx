import React from "react";
import logo from "../../assets/money-logo-bg.png";

const Coin = ({ value }) => {
  return (
    <div className="coin" style={{ position: "relative" }}>
      <img
        src={logo}
        alt="coinphoto"
        style={{ width: "90px", height: "40px" }}
      />
      <p
        style={{
          position: "absolute",
          top: "45%",
          left: "65%",
          transform: "translate(-50%, -50%)",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
};

export default Coin;
