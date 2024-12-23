import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  TextField,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DehazeIcon from "@mui/icons-material/Dehaze";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useTheme } from "@emotion/react";
import "./styles.scss";
import Login from "../auth/signup";
import ZoneHoverComponent from "../hover/first";
import EventHoverComponent from "../hover/second";
import CorporateHoverComponent from "../hover/third";
import Packages from "../package/package";
import { setLoggedIn, removeUser } from "../../utils/store/slice/userSlice";
import MoneyBg from "../../assets/money-logo-bg.svg";
import {
  getProfile,
  isAdmin,
  isEmployee,
  isWindowEmployee,
  scrollToBottom,
  scrollToTop,
} from "../../utils";
import {
  closeAuthModal,
  openAuthModal,
  openPremiumSubscriptionModal,
} from "../../utils/store/slice/appSlice";
import { downArrow } from "../../assets";

const ProfileDialog = ({ handleLogout, setShowProfileDialog }) => {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("click", () => {
      setShowProfileDialog(false);
    });
    return () => {
      window.removeEventListener("click", null);
    };
  }, []);
  return (
    <Grid className="profile-dialog">
      <Typography className="action-link" onClick={() => navigate("/profile")}>
        Profile
      </Typography>
      <Typography className="action-link" onClick={() => handleLogout()}>
        Logout
      </Typography>
    </Grid>
  );
};

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLaptop = useMediaQuery(theme.breakpoints.up("lg"));
  // const [open, setOpen] = useState(false);
  const {
    isLoggedIn,
    userData: user,
    isPremium,
  } = useSelector((store) => store.userSlice);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const employee = isEmployee(user?.user_type);
  const admin = isAdmin(user?.user_type);
  const windowEmployee = isWindowEmployee(user?.user_type);

  const openModal = () => dispatch(openAuthModal());
  const closeModal = () => dispatch(closeAuthModal());

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const [navExpanded, setNavExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(removeUser());
    localStorage.removeItem("token");
    dispatch(setLoggedIn(false));
    navigate("/");
  };

  return (
    <>
      <Grid
        sx={{
          position: "fixed",
          width: "100vw",
          top: "0px",
          zIndex: 1000,
        }}
        className="nav"
      >
        <Grid
          display="flex"
          justifyContent="space-between"
          alignItems={"center"}
          flexDirection={"row"}
          mx={{ lg: "100px", xs: "20px" }}
          height={"88px"}
        >
          <Link to="/" onClick={() => setNavExpanded(false)}>
            <img src={Logo} alt="funingo-logo" width={"130px"} />
          </Link>
          <Grid
            className="font"
            display={{ xs: "none", lg: "flex" }}
            gap="20px"
            alignItems={"center"}
            height="100%"
          >
            <Button
              name="zone-btn"
              onClick={() => navigate("/zone")}
              sx={{
                fontWeight: "600",
                color: "#2474D2",
                height: "100%",
                position: "relative",
                textTransform: "capitalize",
                "&:hover": {
                  "& #zone-hover-box": {
                    display: "flex",
                  },
                },
              }}
            >
              Zones
              <img
                className="arrow-image ml-1 h-[10px] w-4"
                src={downArrow}
                alt=""
              />
              <Grid
                className="hover-box"
                id="zone-hover-box"
                sx={{
                  position: "absolute",
                  top: "88px",
                  left: "-23vw",
                  display: "none",
                  width: "84rem",
                  justifyContent: "center",
                  overflowY: "auto",
                  overflowX: "hidden",
                  background: "#2474d2",
                }}
              >
                <ZoneHoverComponent />
              </Grid>
            </Button>
            <Button
              onClick={() => navigate("/events")}
              sx={{
                fontWeight: "600",
                color: "#2474D2",
                height: "100%",
                textTransform: "capitalize",
                "&:hover": {
                  "& #event-hover-box": {
                    display: "flex",
                  },
                },
              }}
              name="events-btn"
              className="navText"
            >
              Events
              <img
                className="arrow-image ml-1 h-[10px] w-4"
                src={downArrow}
                alt=""
              />
              <Grid
                className="hover-box"
                id="event-hover-box"
                sx={{
                  position: "absolute",
                  top: "88px",
                  left: "-18vw",
                  width: "50rem",
                  justifyContent: "center",
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "none",
                  background: "#2474d2",
                }}
              >
                <EventHoverComponent />
              </Grid>
            </Button>
            <Button
              onClick={() => navigate("/corporate")}
              sx={{
                fontWeight: "600",
                height: "100%",
                color: "#2474D2",
                textTransform: "capitalize",
                "&:hover": {
                  "& #corporate-hover-box": {
                    display: "flex",
                  },
                },
              }}
              name="corporate-btn"
              className="navText"
            >
              Corporate
              <img
                className="arrow-image ml-1 h-[10px] w-4"
                src={downArrow}
                alt=""
              />
              <Grid
                className="hover-box"
                id="corporate-hover-box"
                sx={{
                  position: "absolute",
                  top: "88px",
                  left: "-18vw",
                  display: "none",
                  // height: '52vh',
                  width: "63rem",
                  justifyContent: "center",
                  overflowY: "auto",
                  overflowX: "hidden",
                  background: "#2474d2",
                }}
              >
                <CorporateHoverComponent />
              </Grid>
            </Button>
            {admin ? (
              <Button
                onClick={() => navigate("/admin/stats")}
                sx={{ fontWeight: "600", color: "#2474D2", height: "100%" }}
                className="navText"
              >
                Statistics
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/packages")}
                sx={{
                  fontWeight: "600",
                  color: "#2474D2",
                  height: "100%",
                  textTransform: "capitalize",
                }}
                className="navText"
              >
                Packages
              </Button>
            )}

            {employee ? (
              <Button
                onClick={() => {
                  navigate("/e/redeem");
                  scrollToTop();
                }}
                sx={{ fontWeight: "600", color: "#2474D2", height: "100%" }}
                className="navText"
              >
                Redeem
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/franchise")}
                sx={{
                  fontWeight: "600",
                  color: "#2474D2",
                  height: "100%",
                  textTransform: "capitalize",
                }}
                className="navText"
              >
                Franchise
              </Button>
            )}

            {windowEmployee ? (
              <Button
                onClick={() => {
                  navigate("/we/get-qr-tickets");
                  scrollToTop();
                }}
                sx={{ fontWeight: "600", color: "#2474D2", height: "100%" }}
                className="navText"
              >
                Generate QR
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/gallery")}
                sx={{
                  fontWeight: "600",
                  color: "#2474D2",
                  height: "100%",
                  textTransform: "capitalize",
                }}
                className="navText"
              >
                Gallery
              </Button>
            )}
            {windowEmployee ? (
              <Button
                onClick={() => {
                  navigate("/we/window-purchase");
                  scrollToTop();
                }}
                sx={{ fontWeight: "600", color: "#2474D2", height: "100%" }}
                className="navText"
              >
                Book tickets
              </Button>
            ) : (
              <Button
                onClick={() =>
                  //  navigate("/contact")
                  scrollToBottom()
                }
                sx={{
                  fontWeight: "600",
                  color: "#2474D2",
                  height: "100%",
                  textTransform: "capitalize",
                }}
                className="navText"
              >
                Contact
              </Button>
            )}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isLaptop ? "0px" : "5px",
            }}
          >
            {/* {!isLaptop && !isLoggedIn && (
              <Button
                variant='contained'
                sx={{
                  background: isLaptop ? '#2474D2' : 'transparent',
                  borderRadius: '100%',
                  padding: '0',
                  minWidth: '45px',
                  '&:hover': {
                    background: isLaptop ? '#2474D2' : '#8080803b',
                    boxShadow: '0'
                  }
                }}
                onClick={() => setOpen(true)}
              >
                <img
                  src={AvatarImg}
                  alt='avatar'
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%'
                  }}
                ></img>
              </Button>
            )} */}

            {/* CHANGE 3-> FOR SEARCH ICON  */}
            {!isLaptop && (
              <Link to="/search">
                <Grid container alignItems="center">
                  <Grid item>
                    <SearchIcon
                      sx={{
                        fontSize: "1.4rem",
                        marginRight: "auto",
                        color: "black",
                      }}
                    />
                  </Grid>
                </Grid>
              </Link>
            )}

            {!isLoggedIn && (
              <Button
                variant="contained"
                sx={{
                  background: isLaptop ? "#2474D2" : "transparent",
                  borderRadius: "2em",
                  fontWeight: "600",
                  boxShadow: "0",
                  "&:hover": {
                    background: isLaptop ? "#2474D2" : "#8080803b",
                    boxShadow: "0",
                  },
                }}
                onClick={
                  !isLaptop
                    ? () => setNavExpanded((curr) => !curr)
                    : () => openModal()
                }
              >
                {/* {!isLaptop ? <DehazeIcon sx={{ color: 'black' }} /> : 'Signup'} */}

                {/* change 2-> Adding clear Icon  */}
                {!isLaptop ? (
                  <>
                    {!navExpanded ? (
                      <DehazeIcon sx={{ color: "black" }} />
                    ) : (
                      <ClearIcon sx={{ color: "black" }} />
                    )}
                  </>
                ) : (
                  "Signup / Signin"
                )}
              </Button>
            )}

            {isLoggedIn && (
              <Grid
                sx={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "120px",
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
                      width: "120px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px",
                      zIndex: "110",
                      position: "absolute",
                      right: "22px",
                      textAlign: "center",
                      width: "40px",
                    }}
                  >
                    {user.funingo_money}
                  </Typography>
                </Box>

                <Box
                  component={"img"}
                  src={getProfile(user.profile_picture)}
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: isPremium ? "2px solid #0580e2" : "none",
                    padding: "2px",
                  }}
                  onClick={
                    !isLaptop
                      ? () => setNavExpanded((curr) => !curr)
                      : (e) => {
                          e.stopPropagation();
                          setShowProfileDialog((curr) => !curr);
                        }
                  }
                />
              </Grid>
            )}
            {showProfileDialog && (
              <ProfileDialog
                handleLogout={handleLogout}
                setShowProfileDialog={setShowProfileDialog}
              />
            )}
          </Grid>

          <Backdrop
            sx={{
              color: "#fff",
              zIndex: 10,
              top: "88px",
            }}
            open={navExpanded}
            onClick={() => setNavExpanded(false)}
          >
            {/* change 1-> adding slider*/}
            <Grid
              className={
                navExpanded
                  ? "expanded-nav nav-container"
                  : "collapsed-nav nav-container"
              }
              // height={!navExpanded ? '0' : 'fit-content'}
              height={navExpanded ? "100vh" : "fit-content"}
              // right={!navExpanded ? '-100%': '0'}
            >
              <Grid className="action-btns">
                <Link to="/">
                  <Grid textAlign={"center"}>
                    <Button
                      sx={{
                        fontWeight: "600",
                        width: "100%",
                        color: "#2474D2",
                        padding: "10px",
                        borderBottom: "1px solid #aac1dc",

                        // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                      }}
                      onClick={() => {
                        setNavExpanded(false);
                      }}
                    >
                      Home
                    </Button>
                  </Grid>
                </Link>

                {/* <Grid textAlign={"center"}>
                  <Button
                    sx={{
                      fontWeight: "600",
                      width: "100%",
                      padding: "10px",
                      borderBottom: "1px solid #aac1dc",
                      // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                    }}
                    onClick={() => {
                      setNavExpanded(false);
                      //  dispatch(openPremiumSubscriptionModal());
                    }}
                  >
                    Go Premium
                    <WorkspacePremiumIcon
                      style={{ color: "#FFD700", fontSize: "1.2rem" }}
                    />
                  </Button>
                </Grid> */}

                {isLoggedIn && (
                  <Link to="/profile">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={() => {
                          setNavExpanded(false);
                        }}
                      >
                        Profile
                      </Button>
                    </Grid>
                  </Link>
                )}

                <Link to="/zone">
                  <Grid textAlign={"center"}>
                    <Button
                      sx={{
                        fontWeight: "600",
                        width: "100%",
                        color: "#2474D2",

                        padding: "10px",
                        borderBottom: "1px solid #aac1dc",
                        textAlign: "left",
                        // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                      }}
                      onClick={() => {
                        setNavExpanded(false);
                      }}
                    >
                      Zones
                    </Button>
                  </Grid>
                </Link>

                <Link to="/events">
                  <Grid textAlign={"center"}>
                    <Button
                      sx={{
                        fontWeight: "600",
                        width: "100%",
                        color: "#2474D2",
                        padding: "10px",
                        borderBottom: "1px solid #aac1dc",
                        // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                      }}
                      onClick={
                        !isLaptop
                          ? () => setNavExpanded((curr) => !curr)
                          : () => closeModal()
                      }
                    >
                      Events
                    </Button>
                  </Grid>
                </Link>

                <Link to="/corporate">
                  <Grid textAlign={"center"}>
                    <Button
                      sx={{
                        fontWeight: "600",
                        width: "100%",
                        color: "#2474D2",
                        padding: "10px",
                        borderBottom: "1px solid #aac1dc",
                        // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                      }}
                      onClick={
                        !isLaptop
                          ? () => setNavExpanded((curr) => !curr)
                          : () => closeModal()
                      }
                    >
                      Corporate
                    </Button>
                  </Grid>
                </Link>

                {!admin ? (
                  <Link to="/packages">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={
                          !isLaptop
                            ? () => setNavExpanded((curr) => !curr)
                            : () => closeModal()
                        }
                      >
                        Packages
                      </Button>
                    </Grid>
                  </Link>
                ) : (
                  <Link to="/admin/stats">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={
                          !isLaptop
                            ? () => setNavExpanded((curr) => !curr)
                            : () => closeModal()
                        }
                      >
                        Statistics
                      </Button>
                    </Grid>
                  </Link>
                )}

                {employee ? (
                  <Link to="/e/redeem">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={
                          !isLaptop
                            ? () => setNavExpanded((curr) => !curr)
                            : () => closeModal()
                        }
                      >
                        Redeem
                      </Button>
                    </Grid>
                  </Link>
                ) : (
                  <Link to="/franchise">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={
                          !isLaptop
                            ? () => setNavExpanded((curr) => !curr)
                            : () => closeModal()
                        }
                      >
                        Franchise
                      </Button>
                    </Grid>
                  </Link>
                )}
                {windowEmployee ? (
                  <Link to="/we/get-qr-tickets">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={
                          !isLaptop
                            ? () => setNavExpanded((curr) => !curr)
                            : () => closeModal()
                        }
                      >
                        Generate QR
                      </Button>
                    </Grid>
                  </Link>
                ) : (
                  <Link to="/gallery">
                    <Grid textAlign={"center"}>
                      <Button
                        sx={{
                          fontWeight: "600",
                          width: "100%",
                          color: "#2474D2",
                          padding: "10px",
                          borderBottom: "1px solid #aac1dc",
                          // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                        }}
                        onClick={
                          !isLaptop
                            ? () => setNavExpanded((curr) => !curr)
                            : () => closeModal()
                        }
                      >
                        Gallery
                      </Button>
                    </Grid>
                  </Link>
                )}

                <Grid textAlign={"center"}>
                  {windowEmployee ? (
                    <Button
                      sx={{
                        fontWeight: "600",
                        width: "100%",
                        color: "#2474D2",
                        padding: "10px",
                        borderBottom: "1px solid #aac1dc",
                        // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                      }}
                      onClick={() => {
                        navigate("/we/window-purchase");
                        scrollToTop();
                      }}
                    >
                      Book tickets
                    </Button>
                  ) : (
                    <Button
                      sx={{
                        fontWeight: "600",
                        width: "100%",
                        color: "#2474D2",
                        padding: "10px",
                        borderBottom: "1px solid #aac1dc",
                        // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                      }}
                      onClick={() => {
                        scrollToBottom();
                        setNavExpanded((curr) => !curr);
                      }}
                    >
                      Contact
                    </Button>
                  )}
                </Grid>

                {isLoggedIn ? (
                  <Button
                    sx={{
                      fontWeight: "600",
                      color: "#2474D2",
                      width: "100%",
                      padding: "10px",
                      // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                    }}
                    onClick={() => {
                      handleLogout();
                      setNavExpanded(false);
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    sx={{
                      fontWeight: "600",
                      color: "#2474D2",
                      width: "100%",
                      padding: "10px",

                      // boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
                    }}
                    onClick={() => {
                      openModal();
                      setNavExpanded(false);
                    }}
                  >
                    Signup / Login
                  </Button>
                )}
              </Grid>
            </Grid>
          </Backdrop>
        </Grid>
      </Grid>
    </>
  );
};

export default Navbar;
