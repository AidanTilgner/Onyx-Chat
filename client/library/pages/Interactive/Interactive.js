import React from "react";
import styles from "./Interactive.module.scss";
import withStyles from "react-css-modules";

function Interactive() {
  return <div className={styles.Interactive}>Interactive</div>;
}

export default withStyles(styles)(Interactive);
