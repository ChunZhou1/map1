import React, { Component } from "react";
import ReactDOM from "react-dom";
import { hydrate, render } from "react-dom";

import App from "./app.js";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
