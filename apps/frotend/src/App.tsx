import { HashRouter } from "react-router-dom";
import Router from "./routes";
import "./App.css";
import React from "react";

function App() {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  );
}

export default App;
