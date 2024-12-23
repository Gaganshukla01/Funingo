import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./styles.scss";
import { Cursor } from "react-simple-typewriter";
import Slide0 from "./images/slide-0.png";
import Slide1 from "./images/slide-1.png";
import Slide2 from "./images/slide-2.jpg";
import Slide3 from "./images/slide-3.jpg";
import { Box, Grid, Button } from "@mui/material";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { openPremiumSubscriptionModal } from "../../utils/store/slice/appSlice";
import { homeBookNow, mainBackground3 } from "../../assets";

const HomeCarousel = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    images: { banner },
  } = useSelector((state) => state.appSlice);

  function useTypewriter({ words, loop, autoPlay }) {
    const [textIndex, setTextIndex] = useState(0);
    const [text, setText] = useState("");

    useEffect(() => {
      const interval = setInterval(() => {
        setText(words[textIndex]);
        setTextIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, [words, loop]);

    return { text };
  }

  const { text } = useTypewriter({
    words: ["EXCITEMENT", "THRILL", "ENJOYMENT"],
    loop: {},
  });

  useEffect(() => {
    setTimeout(() => {
      setAutoPlay(true);
    }, 3500);
  }, []);

  return (
    <Grid position={"relative"}>
      {showText && currentSlide === 0 && (
        <Grid
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-70%)",
            zIndex: "10",
            left: "50px",
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Grid className="car-top-heading">Get Ready For</Grid>
          <span className="car-bottom-heading ">
            {text} <Cursor />
          </span>
        </Grid>
      )}
      <Grid
      // onClick={() =>
      //   currentSlide === 1 &&
      // }
      >
        <Carousel
          autoPlay={autoPlay}
          centerMode={true}
          centerSlidePercentage={100}
          emulateTouch={true}
          infiniteLoop={true}
          interval={2500}
          showArrows={false}
          showStatus={false}
          showIndicators={true}
          showThumbs={false}
          stopOnHover={false}
          onChange={(curr) => {
            setCurrentSlide(curr);
            if (curr === 1) {
              setShowText(false);
              setTimeout(() => {
                setCurrentSlide(curr);
              }, 500);
            } else {
              setTimeout(() => {
                setShowText(true);
              }, 500);
            }
          }}
        >
          <Box
            maxHeight={"calc(100vh - 84px)"}
            sx={{
              "-webkit-user-select": "none" /* Safari */,
              "-ms-user-select": "none" /* IE 10 and IE 11 */,
              "user-select": "none" /* Standard syntax */,
            }}
          >
            <img src={Slide0} alt={"slide 0"} />
          </Box>

          {/* <Box
            maxHeight={"calc(100vh - 84px)"}
            sx={{
              "-webkit-user-select": "none" ,
              "-ms-user-select": "none",
              "user-select": "none" ,
            }}
            onClick={() => dispatch(openPremiumSubscriptionModal())}
          >
            <img src={Slide1} alt={"slide 1"} />
          </Box> */}

          <Box
            maxHeight={"calc(100vh - 84px)"}
            sx={{
              "-webkit-user-select": "none" /* Safari */,
              "-ms-user-select": "none" /* IE 10 and IE 11 */,
              "user-select": "none" /* Standard syntax */,
            }}
          >
            <img src={Slide2} alt={"slide 2"} />
          </Box>
          <Box
            maxHeight={"calc(100vh - 84px)"}
            sx={{
              "-webkit-user-select": "none" /* Safari */,
              "-ms-user-select": "none" /* IE 10 and IE 11 */,
              "user-select": "none" /* Standard syntax */,
            }}
          >
            <img src={Slide3} alt={"slide 3"} />
          </Box>
          {banner?.map((img) => (
            <Box
              maxHeight={"calc(100vh - 84px)"}
              key={img._id}
              sx={{
                "-webkit-user-select": "none" /* Safari */,
                "-ms-user-select": "none" /* IE 10 and IE 11 */,
                "user-select": "none" /* Standard syntax */,
              }}
            >
              <img src={img.url} alt={"banner image"} />
            </Box>
          ))}
        </Carousel>
      </Grid>

      {showText && currentSlide === 0 && (
        <Grid className="car-bottom-wrapper">
          <Grid className="car-bottom-btn">
            <Button
              className="car-bottom-button"
              onClick={() => navigate("/book")}
            >
              <img src={homeBookNow} alt="" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default HomeCarousel;
