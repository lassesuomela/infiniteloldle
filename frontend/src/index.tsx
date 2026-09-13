import * as React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import NewUser from "./utils/NewUser";

NewUser();

const root = ReactDOM.createRoot(
  (globalThis as any).document.getElementById("root"),
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
