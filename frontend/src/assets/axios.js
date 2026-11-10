// src/assets/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.132.7.71:8000", // 👈 Use localhost, match your frontend host
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

export default instance;
