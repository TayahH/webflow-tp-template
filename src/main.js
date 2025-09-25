// main.js
import { initializeVidstackPlayers } from "./vidstack-player.js";

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initializeVidstackPlayers);
} else {
  initializeVidstackPlayers();
}
