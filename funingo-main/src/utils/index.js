import axios from "axios";
import { apiUrl } from "../constants";
import { addToken, addUser, setLoggedIn } from "./store/slice/userSlice";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

import m1 from "../assets/profile-pics/m1.png";
import m2 from "../assets/profile-pics/m2.png";
import m3 from "../assets/profile-pics/m3.png";
import m4 from "../assets/profile-pics/m4.png";
import f1 from "../assets/profile-pics/f1.png";
import f2 from "../assets/profile-pics/f2.png";
import f3 from "../assets/profile-pics/f3.png";
import f4 from "../assets/profile-pics/f4.png";
import { fetchSelf } from "../actions/user";

export const autoLogin = (callback) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    let user = null;
    if (token) {
      try {
        const resp = await dispatch(fetchSelf());
        user = resp.payload.user;
        dispatch(addToken(token));
        dispatch(setLoggedIn(true));
      } catch (err) {
        dispatch(addToken(""));
        localStorage.removeItem("token");
      }
    }
    callback?.(user);
  };
};

export const isEmployee = (user_type) =>
  ["employee", "admin"].includes(user_type);

export const isWindowEmployee = (user_type) =>
  ["window_employee", "admin"].includes(user_type);

export const isAdmin = (user_type) => user_type === "admin";

export const scrollToBottom = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollPosition = scrollHeight - windowHeight;
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
};
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const getProfile = (picId) => {
  switch (picId) {
    case "m1":
      return m1;
    case "m2":
      return m2;
    case "m3":
      return m3;
    case "m4":
      return m4;
    case "f1":
      return f1;
    case "f2":
      return f2;
    case "f3":
      return f3;
    case "f4":
      return f4;
    default:
      return m1;
  }
};

export const downloadImage = async (element, fileName) => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);

  const fakeLink = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;

  fakeLink.href = image;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};

export const exportAsImage = async (element) => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  return image;
};

export const downloadInExcel = ({ data, fileName }) => {
  // Create a new workbook and add a worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

  // Save the workbook to an Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const capitalizeFirstLetter = (inputString) => {
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  );
};
