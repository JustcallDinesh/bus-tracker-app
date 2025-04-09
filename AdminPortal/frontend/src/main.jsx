import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider and createTheme
// import CssBaseline from "@mui/material/CssBaseline"; // Optional: Provides a consistent baseline

// // 1. Create a theme (you can customize this later)
// const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
