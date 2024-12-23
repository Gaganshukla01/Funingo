import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import "./index.css";
import theme from "./theme";
import {
  createBrowserRouter,
  Outlet,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./utils/store/store";
import { Grid } from "@mui/material";
import Home from "./components/home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Zone from "./components/zone/zone";
import Events from "./components/Events/Events";
import Franchise from "./components/franchise/franchise";
import Corporate from "./components/corporate/corporate";
import Gallery from "./components/gallery";
import Packages from "./components/package/package";
import Booknow from "./components/booknow/booknow";
import Showdetails from "./actions/showdetails";
import Icon from "./components/icon/icon";
import RedeemTicket from "./components/employee/redeem-tickets";
import {
  autoLogin,
  isAdmin,
  isEmployee,
  isWindowEmployee,
  scrollToTop,
} from "./utils";
import GetQRTickets from "./components/employee/get-qr-tickets";
import Loader from "./components/Mainloader/loader";
import AddMore from "./components/add-more-packages/AddMore";
import WindowPurchase from "./components/windowPurchase";
import Rating from "./components/Rate/rate";
import Stats from "./components/admin/stats";
import Profile from "./components/profile";
import AdminPortal from "./components/admin";
import { getAllImages, getPhoneNumbers } from "./actions/admin";
import Careers from "./components/careers";
import FreebiesModal from "./components/freebies-modal";
import PremiumSubscriptionModal from "./components/premium-subscription";
import Register from "./components/auth/signup";
import { getFreebies } from "./actions/ticket";
import { openPremiumSubscriptionModal } from "./utils/store/slice/appSlice";
import Policy from "./components/policies";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Outlet />
      </ThemeProvider>
    </Provider>
  );
};

const AppLayout = ({
  employee = false,
  admin = false,
  windowEmployee = false,
}) => {
  const [loading, setloading] = useState(false);
  const [showFreebies, setShowFreebies] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isLoggedIn } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const location = pathname + search;
    if (employee || admin || windowEmployee || pathname === "/profile") {
      if (pathname === "/e/redeem") {
        const params = new URLSearchParams(search);
        navigate(`/qr/${params.get("tid") || ""}`);
      } else {
        navigate("/");
      }
    }

    dispatch(
      autoLogin((user) => {
        dispatch(getFreebies());
        if (
          (employee === true && isEmployee(user?.user_type)) ||
          (admin === true && isAdmin(user?.user_type)) ||
          (windowEmployee === true && isWindowEmployee(user?.user_type))
        ) {
          navigate(location);
        } else {
          if (!user && pathname === "/profile") {
            navigate("/");
          } else if (user && pathname === "/profile") {
            navigate("/profile");
          } else if (isAdmin(user?.user_type) && pathname === "/") {
            navigate("/admin");
          }
        }

        // if (!user) {
        //   setTimeout(() => {
        //     dispatch(openPremiumSubscriptionModal());
        //   }, 8500);
        // }
      })
    );

    dispatch(getPhoneNumbers());
    dispatch(getAllImages());

    // if (!employee && !admin && !windowEmployee) {
    //   setloading(true);
    //   setTimeout(() => {
    //     setloading(false);
    //   }, 3500);
    // }
  }, []);

  // useEffect(() => {
  //   scrollToTop();
  // }, [pathname]);

  return (
    <Grid
      sx={{ position: "relative", overflow: loading ? "hidden" : "auto" }}
      height={loading ? "100vh" : "100%"}
    >
      {loading && (
        <div className="loader">
          <Loader />
        </div>
      )}

      <div>
        {/* Modals start */}
        {/* <FreebiesModal
          open={showFreebies && !loading}
          onClose={() => {
            setShowFreebies(false);
            setTimeout(() => {
              dispatch(openPremiumSubscriptionModal());
            }, 5000);
          }}
        /> */}
        {/* <PremiumSubscriptionModal /> */}
        <Register />
        {/* Modals end */}

        <Navbar />
        <Icon />

        <Grid mt="90px">
          <Outlet />
        </Grid>

        <Grid display={"flex"} justifyContent={"center"}>
          <Footer />
        </Grid>
      </div>
    </Grid>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/zone",
            element: <Zone />,
          },
          {
            path: "/events",
            element: <Events />,
          },
          {
            path: "/corporate",
            element: <Corporate />,
          },
          {
            path: "/franchise",
            element: <Franchise />,
          },
          {
            path: "/packages",
            element: <Packages />,
          },
          {
            path: "/rating",
            element: <Rating />,
          },
          {
            path: "/gallery",
            element: <Gallery />,
          },
          {
            path: "/book",
            element: <Booknow />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/careers",
            element: <Careers />,
          },
          {
            path: "/policies",
            element: <Policy />,
          },
          {
            path: "/qr/:id",
            element: <AddMore />,
          },
          {
            path: "*",
            element: <Navigate to="/" />,
          },
        ],
      },
      {
        path: "e",
        element: <AppLayout employee={true} />,
        children: [
          {
            path: "redeem",
            element: <RedeemTicket />,
            index: true,
          },
        ],
      },
      {
        path: "we",
        element: <AppLayout windowEmployee={true} />,
        children: [
          {
            path: "get-qr-tickets",
            element: <GetQRTickets />,
          },
          {
            path: "window-purchase",
            element: <WindowPurchase />,
          },
        ],
      },
      {
        path: "admin",
        element: <AppLayout admin={true} />,
        children: [
          {
            path: "",
            element: <AdminPortal />,
            index: true,
          },
          {
            path: "stats",
            element: <Stats />,
          },
          {
            path: "getDetails",
            element: <Showdetails />,
          },
          {
            path: "showdetails",
            element: <Showdetails />,
          },
        ],
      },
    ],
  },
]);
