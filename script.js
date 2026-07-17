const header = document.querySelector("[data-header]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isArabic = document.documentElement.lang === "ar";
const i18n = isArabic
  ? {
      dockLabel: "مجموعات دراسات الحالة",
      play: "تشغيل الفيديو",
      pause: "إيقاف مؤقت",
    }
  : {
      dockLabel: "Case study collections",
      play: "Play video",
      pause: "Pause",
    };

const currentPage = window.location.pathname.split("/").pop() || (isArabic ? "index-ar.html" : "index.html");
const collectionIcons = [
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/></svg>',
];
const mobileCollections = (
  isArabic
    ? [
        { href: "index-ar.html", label: "الإعلانات", title: "دراسات حالة الإعلانات" },
        { href: "websites-ar.html", label: "المواقع", title: "دراسات حالة المواقع" },
        { href: "ai-ads-ar.html", label: "إعلانات AI", title: "إعلانات الذكاء الاصطناعي" },
      ]
    : [
        { href: "index.html", label: "Ads", title: "Ad case studies" },
        { href: "websites.html", label: "Websites", title: "Website case studies" },
        { href: "ai-ads.html", label: "AI Ads", title: "AI ad creative" },
      ]
).map((item, index) => ({ ...item, icon: collectionIcons[index] }));

const activeCollection = mobileCollections.find((item) => item.href === currentPage) || mobileCollections[0];

if (header) {
  const mobileTitle = document.createElement("span");
  mobileTitle.className = "mobile-header-title";
  mobileTitle.textContent = activeCollection.title;
  const langSwitch = header.querySelector(".lang-switch");
  if (langSwitch) {
    header.insertBefore(mobileTitle, langSwitch);
  } else {
    header.appendChild(mobileTitle);
  }
}

const mobileDock = document.createElement("nav");
mobileDock.className = "mobile-dock";
mobileDock.setAttribute("aria-label", i18n.dockLabel);
mobileDock.innerHTML = mobileCollections
  .map((item) => {
    const active = item.href === activeCollection.href;
    return `<a href="${item.href}"${active ? ' class="active" aria-current="page"' : ""}>${item.icon}<span>${item.label}</span></a>`;
  })
  .join("");
document.body.appendChild(mobileDock);

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
    if (label) label.textContent = playing ? i18n.pause : i18n.play;
    button.setAttribute("aria-label", playing ? i18n.pause : i18n.play);
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
