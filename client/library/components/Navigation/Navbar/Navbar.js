import React from "react";
import withStyles from "react-css-modules";
import styles from "./Navbar.module.scss";

function Navbar() {
  return (
    <div className={styles.navbar}>
      <h2 className={styles.title}>Onyx Chat</h2>
    </div>
  );
}

export default withStyles(styles)(Navbar);
