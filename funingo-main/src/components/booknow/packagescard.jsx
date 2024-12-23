import React from "react";
import { Grid, Typography } from "@mui/material";
// import { Tour } from "@mui/icons-material";
import Coin from "../admin/Coin.jsx";

const capitalizeFirstLetter = (inputString) => {
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  );
};

const Packagecard = ({ data, boolFlag }) => {
  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      sx={{
        transition: "background-color 0.3s",
        padding: "3px",
        borderRadius: "8px",
        cursor: "pointer",
        color: "black",
      }}
    >
      {boolFlag && (
        <Grid
          display={"flex"}
          justifyContent={"space-between"}
          paddingX={"4px"}
          alignItems={"center"}
        >
          <Typography fontWeight={"600"}>
            {capitalizeFirstLetter(data?.name)}
          </Typography>

          <Typography fontWeight={"600"}>Rs.{data?.price}</Typography>
        </Grid>
      )}
      <Grid display={"flex"} gap="10px" paddingX={"4px"} alignItems={"center"}>
        <Typography>Coins :-</Typography>
        <Typography
          fontWeight={"600"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {data?.coins}&nbsp; <Coin />
        </Typography>
      </Grid>
    </Grid>
  );
};
export default Packagecard;
