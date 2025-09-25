// CUSTOM VIDSTACK VIDEO PLAYER MODULE
import {
  PlyrLayout,
  VidstackPlayer,
  MediaRemoteControl,
} from "https://cdn.vidstack.io/player";

export const initializeVidstackPlayers = async () => {
  const containers = document.querySelectorAll(".media-player");
  const activePlayers = new Set();

  const createPlayer = async (
    target,
    vimeoId,
    { background = false, clipEndTime = 0 } = {}
  ) =>
    await VidstackPlayer.create({
      target,
      src: `vimeo/${vimeoId}`,
      playsinline: true,
      autoplay: background,
      muted: background,
      loop: background,
      hasCaptions: false,
      clipEndTime: clipEndTime,
      layout: background
        ? null
        : new PlyrLayout({
            controls: [
              "play",
              "progress",
              "current-time",
              "mute",
              "volume",
              "fullscreen",
            ],
          }),
      load: background ? "idle" : "visible",
    });

  const vimeoExists = async (id) => {
    try {
      const res = await fetch(
        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  for (const container of containers) {
    const vimeoId = container.dataset.vimeoId;
    const toggle = container.querySelector(".media-player-toggle");

    // Hide toggle if no Vimeo ID
    if (!vimeoId) {
      if (toggle) toggle.style.display = "none";
      continue;
    }

    // Hide toggle if Vimeo ID is invalid
    if (!(await vimeoExists(vimeoId))) {
      if (toggle) toggle.style.display = "none";
      continue;
    }

    const videoTarget = container.querySelector(".video-player");
    const bgTarget = container.querySelector(".video-player-background");
    const cover = container.querySelector(".media-player-cover");
    const placeholder = container.querySelector(".media-placeholder-image");
    const isMainVisible = videoTarget && videoTarget.offsetParent !== null;

    // Background Player
    if (bgTarget) {
      let bgPlayer;

      if (bgTarget.querySelector("media-player")) {
        bgPlayer = bgTarget.querySelector("media-player");
      } else {
        bgPlayer = await createPlayer(bgTarget, vimeoId, {
          background: true,
          clipEndTime: isMainVisible ? 10 : 0,
        });
      }

      const enforceBgRules = () => {
        bgPlayer.muted = true;
        bgPlayer.loop = true;
      };
      enforceBgRules();

      bgPlayer.addEventListener("play", enforceBgRules);
      bgPlayer.addEventListener("pause", () => {
        enforceBgRules();
        bgPlayer.play().catch(() => {});
      });
      bgPlayer.addEventListener("volumechange", enforceBgRules);

      if (placeholder) {
        bgPlayer.addEventListener(
          "playing",
          () => {
            placeholder.style.display = "none";
          },
          { once: true }
        );
      }
    }

    // Main Player
    if (isMainVisible && videoTarget) {
      if (!videoTarget.querySelector("media-player")) {
        const mainPlayer = await createPlayer(videoTarget, vimeoId);
        activePlayers.add(mainPlayer);

        const remote = new MediaRemoteControl();
        remote.setTarget(mainPlayer);

        if (toggle && cover) {
          toggle.onclick = () => {
            cover.style.display = "none";
            mainPlayer.muted = false;
            remote.play();
          };
        }

        mainPlayer.addEventListener("play", () => {
          activePlayers.forEach((player) => {
            if (player !== mainPlayer) {
              const otherRemote = new MediaRemoteControl();
              otherRemote.setTarget(player);
              otherRemote.pause();
            }
          });
        });

        let pauseTimer;
        mainPlayer.addEventListener("pause", () => {
          if (cover)
            pauseTimer = setTimeout(() => (cover.style.display = "flex"), 3000);
        });
        mainPlayer.addEventListener("play", () => clearTimeout(pauseTimer));
        mainPlayer.addEventListener("ended", () => {
          if (cover) cover.style.display = "flex";
        });
      }
    }
  }

  console.log("Vidstack Video Players initialized");
};
