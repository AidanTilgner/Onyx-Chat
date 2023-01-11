import React from "react";
import Navbar from "./library/components/Navigation/Navbar/Navbar";
import withStyles from "react-css-modules";
import styles from "./App.module.scss";
import { Routes, Route } from "react-router-dom";
import Interactive from "./library/pages/Interactive/Interactive";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

function App() {
  return (
    <div className={styles.App}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="bottom-right">
          <Navbar />
          <Routes location="/">
            <Route path="/" element={<Interactive />} />
          </Routes>
        </NotificationsProvider>
      </MantineProvider>
    </div>
  );
}

export default withStyles(styles)(App);
