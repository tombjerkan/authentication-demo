import React from "react";
import ReactDOM from "react-dom/client";
import "tailwindcss/tailwind.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import handlers from "./msw-handlers";
import { setupWorker } from "msw";

if (process.env.NODE_ENV === "development") {
  const worker = setupWorker(...handlers);
  worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
