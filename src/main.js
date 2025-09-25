// main.js
import { initializeVidstackPlayers } from "./vidstack-player.js";
import { initializeLenis } from "./lenis-scroll.js";

const initializeApp = () => {
  initializeLenis();
  initializeVidstackPlayers();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
