import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import NewUser from "./utils/NewUser";
import { BrowserRouter } from "react-router-dom";
import isPrerenderMode from "./seo/prerenderMode";

const root = ReactDOM.createRoot(document.getElementById("root"));
const prerenderMode = isPrerenderMode();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {!prerenderMode ? <NewUser /> : null}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
