const header = document.querySelector("[data-header]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

if (reducedMotion) {
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7%" },
  );

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

const hydrateVideo = (video) => {
  if (!video || video.dataset.loaded === "true") return;

  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
  });

  video.dataset.loaded = "true";
  video.load();
};

const lazyVideos = document.querySelectorAll("video[data-lazy-video]");

if ("IntersectionObserver" in window) {
  const videoLoader = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          hydrateVideo(entry.target);
          videoLoader.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "360px 0px", threshold: 0.01 },
  );

  lazyVideos.forEach((video) => videoLoader.observe(video));
} else {
  lazyVideos.forEach(hydrateVideo);
}

document.querySelectorAll("[data-video-toggle]").forEach((button) => {
  const card = button.closest(".ai-video-card");
  const video = card?.querySelector("video");
  const icon = button.querySelector("span");
  const label = button.querySelector("b");

  const setButtonState = (playing) => {
    card?.classList.toggle("is-playing", playing);
    if (icon) icon.textContent = playing ? "Ⅱ" : "▶";
    if (label) label.textContent = playing ? "Pause" : "Play video";
    button.setAttribute("aria-label", playing ? "Pause video" : "Play video");
  };

  button.addEventListener("click", async () => {
    if (!video) return;

    if (video.paused) {
      hydrateVideo(video);
      video.muted = false;
      try {
        await video.play();
      } catch {
        video.muted = true;
        await video.play();
      }
    } else {
      video.pause();
    }
  });

  video?.addEventListener("play", () => setButtonState(true));
  video?.addEventListener("pause", () => setButtonState(false));
});
