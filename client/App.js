import React from "react";
import Navbar from "./library/components/Navigation/Navbar/Navbar";
import withStyles from "react-css-modules";
import styles from "./App.module.scss";
import { Routes, Route } from "react-router-dom";
import Interactive from "./library/pages/Interactive/Interactive";

function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <Routes location="/">
        <Route path="/" element={<Interactive />} />
      </Routes>
    </div>
  );
}

export default withStyles(styles)(App);
