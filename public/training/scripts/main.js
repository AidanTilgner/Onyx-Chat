import { setAlert } from "./display.js";

const links = [
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />`,
];

links.forEach((link) => {
  document.head.innerHTML += link;
});
