import React from "react";
import { useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import playerImg from "../../utils/images/player.png";
import FuningoStrip from "./images/funingo-strip.png";

import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import "./styles.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import FreebiesMascot from "../freebies-modal/freebies-mascot";

const Footer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();

  return (
    <Grid
      className="footer"
      m={{ xs: "70px 20px", lg: "70px 220px" }}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      {/* section 1 */}
      <Grid
        className="footer-top-box"
        display={{ xs: "flex" }}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={"center"}
      >
        <Grid
          className="container-footer"
          display={"flex"}
          textAlign={"center"}
        >
          <Typography className="heading">Contact Us</Typography>
          <a href="tel:+917879333731">
            <Typography>+91 787-9333-731</Typography>
          </a>
          <a href="tel:+919425850422">
            <Typography>+91 942-5850-422</Typography>
          </a>
          <Typography>Funingo Adventure Park, 83/2/2,</Typography>
          <Typography>Manegaon, Nagpur Road, Jabalpur</Typography>
        </Grid>
        <Grid className="container-footer" display={"flex"}>
          <Typography className="heading">Policies</Typography>
          <a href="/policies">
            <Typography>Terms and Conditions</Typography>
          </a>
          <HashLink to="/policies/#privacy-policy">
            <Typography>Privacy Policy</Typography>
          </HashLink>
          <HashLink to="/policies/#refund-policy">
            <Typography>Refund Policy</Typography>
          </HashLink>
        </Grid>
        <Grid className="container-footer" display={{ xs: "none", md: "flex" }}>
          <Typography className="heading">Events</Typography>
          <Typography>Birthday </Typography>
          <Typography>Baby Shower </Typography>
          <Typography>Pre Wedding</Typography>
          <Typography>Kitty Party</Typography>
        </Grid>
        <Grid className="container-footer" display={{ xs: "none", md: "flex" }}>
          <Typography className="heading">Corporate</Typography>
          <Typography>Meetings</Typography>
          <Typography>Incentives</Typography>
          <Typography>Corporate Game </Typography>
        </Grid>
      </Grid>

      {/* <Divider
        sx={{
          borderWidth: '1px',
          width: '100%',
          my: '20px'
        }}
      /> */}
      <Box
        component={"img"}
        src={FuningoStrip}
        width={{ xs: "100vw", sm: "100%" }}
        height={{ md: "auto" }}
        mt="20px"
      />
      <Divider
        sx={{
          borderWidth: "1px",
          width: "100%",
          mt: "20px",
        }}
      />
      <Grid
        display={"flex"}
        alignItems={"center"}
        minWidth={"300px"}
        justifyContent={"center"}
        py="10px"
      >
        <Typography>Follow Us:</Typography>
        <IconButton>
          <a href="">
            <FacebookIcon />
          </a>
        </IconButton>
        <IconButton>
          <a
            target="_"
            href="https://www.instagram.com/funingo.fun?igsh=eG01azR6ZGY2ZXEw"
          >
            <InstagramIcon />
          </a>
        </IconButton>
        <IconButton>
          <a
            target="_"
            href="https://youtube.com/@funingoadventurearena-0761?si=yy9N-RwCDKdStDgM"
          >
            <YouTubeIcon />
          </a>
        </IconButton>
        <IconButton>
          <a href="">
            <LinkedInIcon />
          </a>
        </IconButton>

        <Divider orientation="vertical" sx={{ mx: "20px" }} />
        <Typography
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/careers")}
        >
          Careers
        </Typography>
      </Grid>
      <Divider
        sx={{
          borderWidth: "1px",
          width: "100%",
        }}
      />
      <Grid mt="10px">
        <Typography
          variant="subtitle1"
          fontWeight={"600"}
          color="#555F68"
          fontSize={"12px"}
        >
          Copyright &nbsp;
          {/* &#169; */}
          2023 Funingo Limited | All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
