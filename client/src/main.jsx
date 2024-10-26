import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <React.StrictMode>
  <KindeProvider
    clientId="19aabee2a3d84278ba00a9f01a5e46e3"
    domain="https://rebyb.kinde.com"
    redirectUri="http://localhost:3006"
    logoutUri="http://localhost:3006"
  >
    <App />
  </KindeProvider>
  // </React.StrictMode>,
);
