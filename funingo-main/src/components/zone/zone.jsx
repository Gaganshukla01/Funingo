import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import "./pages.css";

import {
  perRide2500,
  P1000,
  P1500,
  P2000,
  P2500,
  P3000,
  P500,
  P5000,
  activityZoneMobileText,
  activityZoneText,
  bookNow,
  heart,
  keyIcon,
  loaderGif,
  sec11,
  sec12,
  sec21,
  sec22,
  sec31,
  sec32,
  sec41,
  sec42,
  sec43,
  sec44,
  sec45,
  sec46,
  sec51,
  sec52,
  sec53,
  sec54,
  sec55,
  sec61,
  sec62,
  sec71,
  sec81,
  sec82,
  sec83,
  unload,
  zone1Point,
  zone21Point,
  zone22Point,
  zone31Point,
  zone32Point,
  zone41Point,
  zone42Point,
  zone43Point,
  zone44Point,
  zone45Point,
  zone46Point,
  zone51Point,
  zone52Point,
  zone53Point,
  zone54Point,
  zone55Point,
  zone61Point,
  zone62Point,
  zone7,
  zone7Point,
  zone81Point,
  zone82Point,
  zone83Point,
  zone1,
} from "../../assets";
import MoneyBg from "../../assets/money-logo-bg.svg";

import { useLocation, useNavigate } from "react-router-dom";

import { scrollToTop } from "../../utils/index";
const Zone = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const navigate = useNavigate(false);
  const { state } = useLocation();

  const renderButton = () => (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        navigate("/book");
        scrollToTop();
      }}
      style={{ position: "relative" }}
      className="mt-8 flex max-sm:justify-center max-sm:mt-2"
    >
      <img src={bookNow} className="commonButton" alt="Book Now" />
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "80%",
            transform: "translateX(-50%)",
            marginTop: "0px",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "grab",
            color: "red",
            fontSize: "20px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            backgroundColor: "transparent",
            zIndex: "1",
          }}
        >
          <img
            src={loaderGif}
            className="h-20 w-20"
            alt="Loader"
            style={{ marginRight: "-5px" }}
          />
          <img
            src={heart}
            alt="Heart"
            style={{
              width: "15px",
              height: "15px",
              position: "absolute",
              top: "50%",
              left: "26%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <span style={{ marginLeft: "0px" }}>Unload Ultimate Fun</span>
        </div>
      )}
    </button>
  );

  useEffect(() => {
    const zone = document.getElementById(state?.zoneId);
    if (zone) {
      zone.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state?.zoneId]);

  return (
    <div className=" overflow-hidden">
      <section className="section0 w-full">
        <div className="div1 flex justify-center items-center">
          <div className=" lg:mb-36 max-md:mb-10">
            {/* for Desktop View  */}
            <img
              className="azImage max-sm:hidden"
              src={activityZoneText}
              alt=""
            />
            {/* for Mobile View  */}
            <h1 className="text-center azText lg:hidden">
              ACTIVITY <br /> ZONES
            </h1>
          </div>
        </div>
      </section>

      {/* Zone 1  */}
      <section id="zone1">
        <div className="zone1 flex justify-between lg:p-28 items-center max-sm:flex-col max-sm:p-20 max-sm:space-y-20">
          <div className="block text-left">
            <h3 className="text-primary max-md:text-center">Zone 1</h3>
            <h4 className="text-secondary text-[30px] max-md:text-center ">
              Bounce&nbsp;Harbor
            </h4>
            <div className="flex mt-3 items-center max-sm:justify-center">
              <img src={keyIcon} alt="" className="mr-2 max-sm:w-8" />
              <p className="text-2xl max-md:hidden keys">
                Trampoline Treasure <br />
                Island <span className="spanHeading ml-5">
                  [ Age- 4+ ]
                </span>{" "}
              </p>
              <p className="text-2xl lg:hidden keys whitespace-nowrap">
                Trampoline&nbsp;Treasure&nbsp;Island{" "}
                <span className="spanHeadingMobile">[ Age- 4+ ]</span>{" "}
              </p>
            </div>

            <div className="mt-8 mb-10 max-sm:mt-2 flex max-sm:justify-center">
              {/* <img src={zone1Point} className="pointIcon" alt="Logo" /> */}
              <CoinsBox text="2500 Coins" />
            </div>

            <div className="flex max-sm:justify-center">{renderButton()}</div>
          </div>

          <div className="block max-sm:hidden">
            <div className="sec11">{/* Image for sec11 */}</div>
            <div className="sec12 w-[500px]">{/* Image for sec12 */}</div>
          </div>
          <div className=" lg:hidden zone1MobileImages">
            <div className="flex flex-col items-center justify-center">
              <img src={sec11} alt="" className="sec11-mobile " />
              <img src={sec12} alt="" className="sec12-mobile" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 2  */}
      <section id="zone2">
        <div className="zone2 flex flex-col lg:flex-row items-center justify-between lg:p-28 max-sm:p-20 max-sm:space-y-5">
          <div className="block text-center lg:text-left">
            <h3 className="text-primary">Zone 2</h3>
            <h4 className="text-secondary">Battlefront&nbsp;Bay</h4>

            <div className="flex flex-col lg:w-[500px] lg:mt-20 max-sm:mt-10 max-sm:justify-center">
              <div
                className="flex flex-col md:flex-row justify-between items-center max-sm:justify-center"
                id="firstContainer"
              >
                <div className="flex flex-row justify-start items-center max-sm:justify-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-md:hidden text-left">
                    Paintball Arena <br />{" "}
                    <span className="spanHeading">[ Age- 14+ ]</span>
                  </p>
                  <p className="keys lg:hidden whitespace-nowrap">
                    Paintball&nbsp;Arena{" "}
                    <span className="spanHeadingMobile">[ Age- 14+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="flex lg:self-center max-sm:justify-end pointIcon"
                  src={zone21Point}
                  alt=""
                /> */}
                <CoinsBox text="2500 Coins" subText="[30 Shots]" />
              </div>
              <div
                className="flex flex-col md:flex-row justify-between items-center max-sm:justify-center"
                id="secondContainer"
              >
                <div className="flex flex-row justify-start items-center max-sm:justify-center">
                  <img src={keyIcon} alt="" className="mr-0 lg:mr-2" />
                  <p className="text-2xl keys max-md:hidden">
                    Gel Blast Arena <br />{" "}
                    <span className="spanHeading">[ Age- 4+ ]</span>
                  </p>
                  <p className="keys lg:hidden whitespace-nowrap">
                    Gel&nbsp;Blast&nbsp;Arena{" "}
                    <span className="spanHeadingMobile">[ Age- 4+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="flex lg:self-center max-sm:justify-end pointIcon"
                  src={zone22Point}
                  alt=""
                /> */}
                <CoinsBox text="1500 Coins" subText="[30 Shots]" />
              </div>
            </div>

            <div className="lg:mt-28 flex max-sm:justify-center">
              {renderButton()}
            </div>
          </div>

          {/* For Desktop Images */}
          <div className="flex flex-row space-x-8 justify-center items-center">
            <div className="sec21 ml-40 max-sm:hidden"></div>
            <div className="sec22 max-sm:hidden"></div>
          </div>

          {/* For Mobile Images */}
          <div className="flex justify-center mt">
            <div className="flex flex-row justify-center items-center">
              <img src={sec21} className="w-44 h-44 lg:hidden" alt="" />
              <img src={sec22} className="w-44 h-44 lg:hidden" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 3  */}

      <section id="zone3">
        <div className="zone3 flex flex-col lg:flex-row items-center justify-between lg:p-28 max-sm:p-20 max-sm:space-y-5">
          <div className="block text-center lg:text-left">
            <h3 className="text-primary max-sm:text-center">Zone 3</h3>
            <h4 className="text-secondary max-sm:text-center">
              Ropes & Ridges
            </h4>

            <div className="flex-col max-md:hidden w-[600px] mt-20">
              <div
                className="flex flex-row justify-between items-center"
                id="firstContainer"
              >
                <div className="flex flex-row items-center mr-10">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    Low Ropes <br /> Challenge{" "}
                    <span className="spanHeading">[ Age- 5+ ]</span>{" "}
                  </p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone31Point}
                  alt=""
                /> */}
                <CoinsBox text="1500 Coins" subText="[Per Round]" />
              </div>
              <div
                className="flex flex-row justify-between items-center"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    High Ropes <br /> Haven{" "}
                    <span className="spanHeading">[ Age- 7+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone32Point}
                  alt=""
                /> */}
                <CoinsBox text="1500 Coins" subText="[Per Round]" />
              </div>
            </div>

            {/* For Mobile View  */}
            <div className="flex-col lg:hidden w-[500px] mt-5">
              <div
                className="flex flex-col items-center justify-between px-20"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Low&nbsp;Ropes&nbsp;Challenge <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 5+ ]</span>
                  </p>
                </div>
                {/* <img className="pointIcon" src={zone31Point} alt="" /> */}
                <CoinsBox text="1500 Coins" subText="[Per Round]" />
              </div>
              <div
                className="flex flex-col items-center justify-between px-20"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    High&nbsp;Ropes&nbsp;Haven <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 7+ ]</span>
                  </p>
                </div>

                <div className=" flex">
                  {/* <img className="pointIcon" src={zone32Point} alt="" /> */}
                  <CoinsBox text="1500 Coins" subText="[Per Round]" />
                </div>
              </div>
            </div>

            <div className="flex lg:mt-28 max-sm:mt-10 max-sm:justify-center">
              {renderButton()}
            </div>
          </div>

          {/* For Desktop Images */}
          <div className="flex flex-row space-x-8 justify-center items-center">
            <div className="sec31 ml-40 max-sm:hidden"></div>
            <div className="sec32 max-sm:hidden"></div>
          </div>

          {/* For Mobile Images */}
          <div className="flex justify-center">
            <div className="flex flex-row justify-center items-center">
              <img src={sec31} className="w-44 h-44 lg:hidden" alt="" />
              <img src={sec32} className="w-44 h-44 lg:hidden" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 4  */}

      <section className="section4" id="zone4">
        <div className="zone4 flex flex-col lg:flex-row justify-between p-28 pb-20 items-center">
          <div className="block text-center lg:text-left">
            <h3 className="text-primary">Zone 4</h3>
            <h4 className="text-secondary">Thrill Peaks</h4>

            {/* Desktop View Information  */}
            <div className=" max-sm:hidden">
              <div className="flex flex-row items-center mt-10 space-x-2">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys max-sm:hidden">
                    Giant Swing <br /> Skybound{" "}
                    <span className="spanHeading">[ Age- 11+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone42Point}
                  alt=""
                /> */}
                <CoinsBox text="3000 Coins" subText="[Per Ride]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys">
                    Sky Cyclist's <br /> Trail{" "}
                    <span className="spanHeading">[ Age- 7+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone43Point}
                  alt=""
                /> */}
                <CoinsBox text="2500 Coins" subText="[Per Ride]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys max-sm:hidden">
                    Zipline <span className="spanHeading">[ Age- 10+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone43Point}
                  alt=""
                /> */}
                <CoinsBox text="2500 Coins" subText="[Per Ride]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys">
                    Burma Bridge <br />{" "}
                    <span className="spanHeading">[ Age- 6+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone32Point}
                  alt=""
                /> */}
                <CoinsBox text="1500 Coins" subText="[Per Round]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys">
                    Peak Rock Climb <br />{" "}
                    <span className="spanHeading">[ Age- 7+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone45Point}
                  alt=""
                /> */}
                <CoinsBox text="2000 Coins" subText="[2 Rounds]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys">
                    Commando Climb <br /> Net{" "}
                    <span className="spanHeading">[ Age- 2+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone46Point}
                  alt=""
                /> */}
                <CoinsBox text="500 Coins" subText="[15 Mins]" />
              </div>
            </div>

            {/* Mobile View Information  */}

            <div className="flex-col lg:hidden w-[530px] mt-5">
              <div
                className="flex flex-row gap-5 items-center justify-between px-20"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Giant&nbsp;Swing&nbsp;Skybound <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 11+ ]</span>
                  </p>
                </div>
                {/* <img className="pointIcon" src={zone42Point} alt="" /> */}
                <CoinsBox text="3000 Coins" subText="[Per Ride]" />
              </div>
              <div
                className="flex flex-row gap-5 items-center justify-between px-20"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Sky&nbsp;Cyclist's&nbsp;Trail <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 7+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone43Point} alt="" /> */}
                  <CoinsBox text="2500 Coins" subText="[Per Ride]" />
                </div>
              </div>
              <div
                className="flex flex-row gap-5 items-center justify-between px-20"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Zipline <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 10+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  <CoinsBox text="2500 Coins" subText="[Per Ride]" />
                  {/* <img className="pointIcon" src={zone43Point} alt="" /> */}
                </div>
              </div>
              <div
                className="flex flex-row gap-5 items-center justify-between px-20"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Burma&nbsp;Bridge <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 6+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone32Point} alt="" /> */}
                  <CoinsBox text="1500 Coins" subText="[Per Round]" />
                </div>
              </div>
              <div
                className="flex flex-row gap-5 items-center justify-between px-20"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Peak&nbsp;Rock&nbsp;Climb <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 7+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone45Point} alt="" /> */}
                  <CoinsBox text="2000 Coins" subText="[2 Rounds]" />
                </div>
              </div>
              <div
                className="flex flex-row gap-5 items-center justify-between px-20"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Commando&nbsp;Climb&nbsp;Net <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 2+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone46Point} alt="" /> */}
                  <CoinsBox text="500 Coins" subText="[15 Mins]" />
                </div>
              </div>
            </div>

            <div className="flex max-sm:mt-10 max-sm:justify-center">
              {renderButton()}
            </div>
          </div>

          {/* Desktop Images  */}
          <div className=" max-sm:hidden">
            <div className="flex flex-col space-y-5">
              <div className="flex justify-center items-center space-x-8 space-y-0">
                <img
                  src={sec41}
                  className="h-[200px] w-[200px] zone4Image"
                  alt="zone4FirstImage"
                />
                <img
                  src={sec42}
                  className="h-[200px] w-[200px] zone4Image"
                  alt="zone4SecondImage"
                />
                <img
                  src={sec43}
                  className="h-[200px] w-[200px] zone4Image"
                  alt="zone4ThirdImage"
                />
              </div>
              <div className="flex justify-center items-center space-x-8 space-y-0">
                <img
                  src={sec44}
                  className="h-[200px] w-[200px] zone4Image"
                  alt="zone4FourthImage"
                />
                <img
                  src={sec45}
                  className="h-[200px] w-[200px] zone4Image"
                  alt="zone4FifthImage"
                />
                <img
                  src={sec46}
                  className="h-[200px] w-[200px] zone4Image"
                  alt="zone4SixthImage"
                />
              </div>
            </div>
          </div>

          {/* Mobile Images  */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-row justify-center items-center">
              <img src={sec41} className="lg:hidden zone4MobileImage" alt="" />
              <img src={sec42} className="lg:hidden zone4MobileImage" alt="" />
            </div>
            <div className="flex flex-row justify-center items-center">
              <img src={sec43} className="lg:hidden zone4MobileImage" alt="" />
              <img src={sec44} className="lg:hidden zone4MobileImage" alt="" />
            </div>
            <div className="flex flex-row justify-center items-center">
              <img src={sec45} className="lg:hidden zone4MobileImage" alt="" />
              <img src={sec46} className="lg:hidden zone4MobileImage" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 5  */}

      <section className="section5" id="zone5">
        <div className="zone5 flex flex-col lg:flex-row items-center justify-between lg:p-28 max-sm:p-20 max-sm:space-y-5">
          <div className="block text-center lg:text-left max-sm:mt-10 lg:mt-40">
            <h3 className="text-primary">Zone 5</h3>
            <h4 className="text-secondary">Inflatable Isle</h4>

            {/* Desktop View Information  */}
            <div className=" max-sm:hidden">
              <div className="flex flex-row items-center mt-10 space-x-2">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys max-sm:hidden">
                    Meltdown <br /> Madness{" "}
                    <span className="spanHeading">[ Age- 5+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone51Point}
                  alt=""
                /> */}
                <CoinsBox text="1000 Coins" subText="[10 Mins]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys max-sm:hidden">
                    Bucking Bull <br /> Arena{" "}
                    <span className="spanHeading">[ Age- 5+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone52Point}
                  alt=""
                /> */}
                <CoinsBox text="1000 Coins" subText="[Per Ride]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys max-sm:hidden">
                    Zorbie Fight <br />{" "}
                    <span className="spanHeading">[ Age- 10+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone53Point}
                  alt=""
                /> */}
                <CoinsBox text="1000 Coins" subText="3 Fights" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys max-sm:hidden">
                    Kid's Obstacle <br /> Odyssey{" "}
                    <span className="spanHeading">[ Age- 1+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone54Point}
                  alt=""
                /> */}
                <CoinsBox text="500 Coins" subText="[20 Mins]" />
              </div>
              <div className="flex flex-row items-center space-x-2 mt-4">
                <img src={keyIcon} alt="" className="mr-2" />
                <div className="flex-grow">
                  <p className="text-2xl keys">
                    Sumo Showdown <br />{" "}
                    <span className="spanHeading">[ Age- 5+ ]</span>
                  </p>
                </div>
                {/* <img
                  className="self-start lg:self-center pointIcon"
                  src={zone55Point}
                  alt=""
                /> */}
                <CoinsBox text="500 Coins" subText="[3 Fights]" />
              </div>
            </div>

            {/* For Mobile View */}
            <div className="flex-col lg:hidden w-[530px] mt-5">
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Meltdown&nbsp;Madness <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 5+ ]</span>
                  </p>
                </div>
                {/* <img className="pointIcon" src={zone51Point} alt="" /> */}
                <CoinsBox text="1000 Coins" subText="[10 Mins]" />
              </div>
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Bucking&nbsp;Bull&nbsp;Arena <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 5+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone52Point} alt="" /> */}
                  <CoinsBox text="1000 Coins" subText="[Per Ride]" />
                </div>
              </div>
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Zorbie&nbsp;Fight <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 10+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone53Point} alt="" /> */}
                  <CoinsBox text="1000 Coins" subText="3 Fights" />
                </div>
              </div>
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Kids&nbsp;Obstacle&nbsp;Odyssey <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 1+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone54Point} alt="" /> */}
                  <CoinsBox text="500 Coins" subText="[20 Mins]" />
                </div>
              </div>
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Sumo&nbsp;Showdown <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 5+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone55Point} alt="" /> */}
                  <CoinsBox text="500 Coins" subText="[3 Fights]" />
                </div>
              </div>
            </div>

            <div className="flex lg:mt-2 max-sm:mt-10 max-sm:justify-center">
              {renderButton()}
            </div>
          </div>

          {/* For Desktop Images */}
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-row justify-center items-center space-x-8">
              <div className="sec51 max-sm:hidden"></div>
              <div className="sec52 max-sm:hidden"></div>
              <div className="sec55 max-sm:hidden"></div>
            </div>
            <div className="flex flex-row justify-center items-center space-x-8">
              <div className="sec53 max-sm:hidden"></div>
              <div className="sec54 max-sm:hidden"></div>
            </div>
          </div>

          {/* For Mobile Images */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-row justify-center items-center">
              <img src={sec51} className="lg:hidden zone5MobileImage" alt="" />
              <img src={sec52} className="lg:hidden zone5MobileImage" alt="" />
            </div>
            <div className="flex flex-row justify-center items-center">
              <img src={sec55} className="lg:hidden zone5MobileImage" alt="" />
              <img src={sec53} className="lg:hidden zone5MobileImage" alt="" />
            </div>
            <div className="flex flex-row justify-center items-center">
              <img src={sec54} className="lg:hidden zone5MobileImage" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 6  */}

      <section className="section6" id="zone6">
        <div className="zone6 flex flex-col lg:flex-row items-center justify-between lg:p-28 max-sm:p-20 max-sm:space-y-5">
          <div className="block text-center lg:text-left">
            <h3 className="text-primary max-sm:text-center">Zone 6</h3>
            <h4 className="text-secondary max-sm:text-center">
              Marksman's Meadow
            </h4>

            <div className="flex-col max-md:hidden w-[500px] mt-20">
              <div
                className="flex flex-row justify-between items-center"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    Archery Alley <br />{" "}
                    <span className="spanHeading">[ Age- 5+ ]</span>
                  </p>
                  <p className="keys lg:hidden">Archery&nbsp;Alley</p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone61Point}
                  alt=""
                /> */}
                <CoinsBox text="500 Coins" subText="[6 Shots]" />
              </div>
              <div
                className="flex flex-row justify-between items-center"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    Shooter's Range <br />{" "}
                    <span className="spanHeading">[ Age- 7+ ]</span>
                  </p>
                  <p className="keys lg:hidden">Shooter's&nbsp;Range</p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone62Point}
                  alt=""
                /> */}
                <CoinsBox text="1000 Coins" subText="[20 Shots]" />
              </div>
            </div>

            {/* For Mobile View */}
            <div className="flex-col lg:hidden w-[530px] mt-5">
              <div
                className="flex flex-row items-center justify-between px-24 gap-5"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Archery&nbsp;Alley <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 5+ ]</span>
                  </p>
                </div>
                {/* <img className="pointIcon" src={zone61Point} alt="" /> */}
                <CoinsBox text="500 Coins" subText="[6 Shots]" />
              </div>
              <div
                className="flex flex-row items-center justify-between px-24 gap-5"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Shooter's&nbsp;Range <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 7+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone62Point} alt="" /> */}
                  <CoinsBox text="1000 Coins" subText="[20 Shots]" />
                </div>
              </div>
            </div>

            <div className="flex lg:mt-28 max-sm:mt-10 max-sm:justify-center">
              {renderButton()}
            </div>
          </div>

          {/* For Desktop Images */}
          <div className="flex flex-row space-x-8 justify-center items-center">
            <div className="sec61 ml-40 max-sm:hidden"></div>
            <div className="sec62 max-sm:hidden"></div>
          </div>

          {/* For Mobile Images */}
          <div className="flex justify-center">
            <div className="flex flex-row justify-center items-center">
              <img src={sec61} className="w-44 h-44 lg:hidden" alt="" />
              <img src={sec62} className="w-44 h-44 lg:hidden" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 7  */}

      <section className="section7" id="zone7">
        <div className="zone7 flex flex-col lg:flex-row justify-between items-center lg:p-28 max-sm:p-20 max-sm:space-y-5">
          <div className="block text-center lg:text-left">
            <h3 className="text-primary">Zone 7</h3>
            <h4 className="text-secondary">Speedster's&nbsp;Circuit </h4>

            <div className="flex flex-row items-center justify-start mt-10 space-x-2">
              <img src={keyIcon} alt="" className="mr-2 max-md:hidden" />
              <p className="text-2xl keys max-md:hidden">
                Pedal Power Go Kart{" "}
                <span className="spanHeading ml-5">[ Age- 5+ ]</span>
              </p>
              <p className="text-2xl keys lg:hidden">
                Pedal Power Go Kart{" "}
                <span className="spanHeadingMobile">[ Age- 5+ ]</span>
              </p>
            </div>
            {/* <img
              className="pointIcon max-sm:hidden mt-10"
              src={zone7Point}
              alt=""
            /> */}
            {/* <CoinsBox text="1000 Coins" subText="[Per Ride]" /> */}

            <div className="flex justify-center items-center space-x-2">
              {/* <img
                className="pointIcon mt-5 lg:hidden"
                src={zone7Point}
                alt=""
              /> */}
              <CoinsBox text="1000 Coins" subText="[Per Ride]" />
            </div>

            <div className="flex max-sm:justify-center">{renderButton()}</div>
          </div>

          {/* Desktop Version  */}
          <div className="flex flex-col space-y-5">
            <div className="flex flex-wrap lg:flex-row space-x-0 lg:space-x-8 space-y-8 lg:space-y-0">
              <div className="sec71 max-sm:hidden ml-20"></div>
            </div>
          </div>

          {/* Mobile Version  */}
          <div className="flex justify-center">
            <div className="flex flex-row justify-center items-center">
              <img src={sec71} className="imageZone7 lg:hidden" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Zone 8 */}

      <section className="section8" id="zone8">
        <div className="zone8 flex flex-col lg:flex-row items-center justify-between lg:p-28 max-sm:p-20 max-sm:space-y-5">
          <div className="block text-center lg:text-left">
            <h3 className="text-primary max-sm:text-center">Zone 8</h3>
            <h4 className="text-secondary max-sm:text-center">
              Adrenaline&nbsp;Airspace
            </h4>

            <div className="flex-col max-md:hidden w-[500px] mt-20">
              <div
                className="flex flex-col justify-between items-center"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    Rocket Ejector Launch{" "}
                    <span className="spanExtra ">[ Lower limit 45Kg ]</span>
                  </p>
                  <p className="keys lg:hidden">
                    Rocket&nbsp;Ejector&nbsp;Launch
                  </p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone81Point}
                  alt=""
                /> */}
                <CoinsBox text="2500 Coins" subText="[Per Ride]" />
              </div>
              <div
                className="flex flex-col justify-between items-center"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    Gyro Sphere 360{" "}
                    <span className="spanHeading">[ Age- 7+ ]</span>
                  </p>
                  <p className="keys lg:hidden">Gyro&nbsp;Sphere&nbsp;360</p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone82Point}
                  alt=""
                /> */}
                <CoinsBox text="1500 Coins" subText="[Per Ride]" />
              </div>
              <div
                className="flex flex-col justify-between items-center"
                id="thirdContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="text-2xl keys max-sm:hidden">
                    Cyclone Cycle 360{" "}
                    <span className="spanHeading">[ Age- 7+ ]</span>
                  </p>
                  <p className="keys lg:hidden">Cyclone&nbsp;Cycle&nbsp;360</p>
                </div>
                {/* <img
                  className="pointIcon justify-end"
                  src={zone83Point}
                  alt=""
                /> */}
                <CoinsBox text="1500 Coins" subText="[Per Ride]" />
              </div>
            </div>

            {/* For Mobile View */}
            <div className="flex-col lg:hidden w-[530px] mt-5">
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="firstContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Rocket&nbsp;Ejector&nbsp;Launch <br />{" "}
                    <span className="spanHeadingMobile">
                      [ Lower limit- 45Kg ]
                    </span>
                  </p>
                </div>
                {/* <img className="pointIcon" src={zone81Point} alt="" /> */}
                <CoinsBox text="2500 Coins" subText="[Per Ride]" />
              </div>
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="secondContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Gyro&nbsp;Sphere&nbsp;360 <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 7+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone82Point} alt="" /> */}
                  <CoinsBox text="1500 Coins" subText="[Per Ride]" />
                </div>
              </div>
              <div
                className="flex flex-row items-center justify-between px-20 gap-5"
                id="thirdContainer"
              >
                <div className="flex flex-row items-center">
                  <img src={keyIcon} alt="" className="mr-2" />
                  <p className="keys lg:hidden">
                    Cyclone&nbsp;Cycle&nbsp;360 <br />{" "}
                    <span className="spanHeadingMobile">[ Age- 7+ ]</span>
                  </p>
                </div>
                <div className=" flex">
                  {/* <img className="pointIcon" src={zone83Point} alt="" /> */}
                  <CoinsBox text="1500 Coins" subText="[Per Ride]" />
                </div>
              </div>
            </div>

            <div className="flex lg:mt-28 max-sm:mt-10 max-sm:justify-center">
              {renderButton()}
            </div>
          </div>

          {/* For Desktop Images */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex flex-row justify-center items-center space-x-4">
              <div className="sec81 max-sm:hidden"></div>
              <div className="sec82 max-sm:hidden"></div>
            </div>
            <div className="flex justify-center items-center">
              <div className="sec83 max-sm:hidden"></div>
            </div>
          </div>

          {/* For Mobile Images */}
          <div className="flex flex-col items-center justify-center space-x-3">
            <div className="flex flex-row justify-center items-center space-x-8">
              <img src={sec81} className="w-40 h-40 lg:hidden" alt="" />
              <img src={sec82} className="w-40 h-40 lg:hidden" alt="" />
            </div>
            <div className="flex justify-center items-center">
              <img src={sec83} className="w-40 h-40 lg:hidden" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* I have to Update Zone Part  */}
    </div>
  );
};

export default Zone;

const CoinsBox = ({ text, subText }) => (
  <Box
    sx={{
      width: { xs: "150px", md: "210px" },
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }}
  >
    <Box
      component={"img"}
      src={MoneyBg}
      alt="background"
      sx={{
        width: { xs: "140px", md: "200px" },
      }}
    />
    <Box
      sx={{
        position: "absolute",
        right: "0px",
        width: { xs: "100px", md: "140px" },
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontWeight: "600",
          fontSize: { xs: "12px", md: "16px" },
          zIndex: "110",
          textAlign: "center",
        }}
      >
        {text}
      </Typography>
      {subText && (
        <Typography
          sx={{
            color: "white",
            fontWeight: "400",
            fontSize: { xs: "10px", md: "12px" },
            zIndex: "110",
            textAlign: "center",
          }}
        >
          {subText}
        </Typography>
      )}
    </Box>
  </Box>
);
