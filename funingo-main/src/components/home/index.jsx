import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import HomeCarousel from "../home-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import FranchiseBackground from "./images/franchise-background.png";
import stroke from "./images/paint-stroke.png";
import Gallery from "./carousel";
import "./styles.scss";
import FranchiseDataForm from "../franchise/franchise-data-form";
import { Link, useNavigate } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Importing the icon
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"; // Importing the icon
import {
  homeBG,
  mobileHomeBG,
  zone1,
  zone2,
  zone3,
  zone4,
  zone5,
  zone6,
  zone7,
  zone8,
} from "../../assets";

function Home({}) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [showAllZones, setShowAllZones] = useState(false);

  const handleZoneClick = (zoneTitle) => {
    navigate(`/zone/${zoneTitle.toLowerCase().replace(" ", "-")}`);
  };

  const zones = [
    { img: zone1, title: "Zone 1", id: "zone1" },
    { img: zone2, title: "Zone 2", id: "zone2" },
    { img: zone3, title: "Zone 3", id: "zone3" },
    { img: zone4, title: "Zone 4", id: "zone4" },
    { img: zone5, title: "Zone 5", id: "zone5" },
    { img: zone6, title: "Zone 6", id: "zone6" },
    { img: zone7, title: "Zone 7", id: "zone7" },
    { img: zone8, title: "Zone 8", id: "zone8" },
  ];

  const displayedZones = showAllZones ? zones : zones.slice(0, 4);

  return (
    <Grid className="home">
      <HomeCarousel />
      <Grid className="zones">
        <img
          src={homeBG}
          alt="background-img"
          className="background-event max-sm:hidden"
        />
        <img
          src={mobileHomeBG}
          alt="background-img"
          className="background-event lg:hidden"
        />
        <Grid>
          <Grid className="data">
            <div id="combinediv">
              <h1 className="headmain">Activity Zones</h1>

              <Grid
                sx={{
                  display: { xs: "grid", md: "grid" },
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)", // one column on small screens
                    sm: "repeat(2, 1fr)", // two columns on medium screens
                    md: "repeat(2, 1fr)",
                  }, // four columns on large screens },
                  gap: { xs: "15px", md: "50px" },
                  justifyItems: "center",
                  maxWidth: "100vw",
                  p: "0px 10px",
                }}
              >
                {displayedZones.map((zone, index) => (
                  <Link to={"/zone"} state={{ zoneId: zone.id }}>
                    <div
                      key={index}
                      className="example"
                      onClick={() => handleZoneClick(zone.title)}
                    >
                      <img src={zone.img} alt="house" />
                      <h1>{zone.title}</h1>
                    </div>
                  </Link>
                ))}
              </Grid>

              <Button
                variant="contained"
                sx={{
                  background: "#2474d2",
                  boxShadow: "0px 2.5 9 0px rgba(0, 0, 0, 0.25)",
                  borderRadius: "50px",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "22px",
                  mt: "50px",
                  width: "150px",

                  "&:hover": {
                    background: "#1e62ba",
                  },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllZones(!showAllZones);
                }}
              >
                {showAllZones ? <ArrowUpwardIcon /> : "View All"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid mt={{ xs: "30px", sm: "75px" }}>
        <Gallery />
      </Grid>

      <Grid className="franchise">
        <img
          src={FranchiseBackground}
          alt="background-img"
          className="background"
        />
        <Typography className="heading">Franchise</Typography>
        <Divider
          sx={{
            borderColor: "#D9D9D9",
            borderWidth: "5px",
            borderRadius: "5px",
            width: "250px",
          }}
        />

        <FranchiseDataForm />
      </Grid>
    </Grid>
  );
}

export default Home;
