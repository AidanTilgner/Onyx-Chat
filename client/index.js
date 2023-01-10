import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const domContainer = document.querySelector("#root");
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);

console.log("Hello World!");
