// global-hub.js
(function () {
  const ACCENT_KEY = "s0laceAccent";
  const CLOAK_KEY = "s0laceTabCloak";

  const THEME_KEY = "s0laceTheme";
  const BG_MODE_KEY = "s0laceBgMode";
  const BG_URL_KEY = "s0laceBgUrl";

  const STAR_GIF = "https://img.itch.zone/aW1hZ2UvMzA5NTQ4LzE1MjE4MTcuZ2lm/original/HRZI0o.gif";

  const ACCENTS = {
    green: { accent: "#00ff7f", soft: "rgba(0,255,127,0.12)" },
    violet: { accent: "#a855f7", soft: "rgba(168,85,247,0.12)" },
    amber: { accent: "#fbbf24", soft: "rgba(251,191,36,0.12)" },
    white: { accent: "#ffffff", soft: "rgba(255,255,255,0.18)" }
  };

  function setCssVar(n,v){ document.documentElement.style.setProperty(n,v); }

  /* ACCENT */
  function applyAccent(key, save=true){
    const p = ACCENTS[key] || ACCENTS.green;
    setCssVar("--accent", p.accent);
    setCssVar("--accent-soft", p.soft);
    if(save) localStorage.setItem(ACCENT_KEY, key);
  }

  function loadAccent(){
    const k = localStorage.getItem(ACCENT_KEY) || "green";
    applyAccent(k, false);
    return k;
  }

  /* TAB CLOAKING */
  function applyTabCloak(cfg, save=true){
    if (!cfg || !cfg.enabled) return;
    document.title = cfg.title || document.title;
    if (cfg.iconHref){
      let link = document.querySelector('link[rel="icon"]');
      if (!link){
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = cfg.iconHref;
    }
    if(save) localStorage.setItem(CLOAK_KEY, JSON.stringify(cfg));
  }

  function loadTabCloak(){
    let raw = localStorage.getItem(CLOAK_KEY);
    if(!raw) return;
    try{
      const parsed = JSON.parse(raw);
      if(parsed.enabled) applyTabCloak(parsed, false);
    }catch(_){}
  }

  /* THEME */
  function applyTheme(theme, save=true){
    const t = theme || "dark";
    document.documentElement.setAttribute("data-theme", t);

    if (save) localStorage.setItem(THEME_KEY, t);

    if (t === "xmas") enableXmasDecor();
    else disableXmasDecor();
  }

  function loadTheme(){
    const t = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(t, false);
    return t;
  }

  /* BACKGROUND */
  function applyBackground(mode, url, save=true){
    const b = document.body;
    b.style.backgroundImage = "";
    b.style.backgroundSize = "";
    b.style.backgroundAttachment = "";

    if (mode === "gif-stars"){
      b.style.backgroundImage = `url("${STAR_GIF}")`;
      b.style.backgroundSize = "cover";
      b.style.backgroundAttachment = "fixed";
    } else if (mode === "custom" && url){
      b.style.backgroundImage = `url("${url}")`;
      b.style.backgroundSize = "cover";
      b.style.backgroundAttachment = "fixed";
    }

    if(save){
      localStorage.setItem(BG_MODE_KEY, mode);
      if(mode === "custom") localStorage.setItem(BG_URL_KEY, url);
      else localStorage.removeItem(BG_URL_KEY);
    }
  }

  function loadBackground(){
    const mode = localStorage.getItem(BG_MODE_KEY) || "default";
    const url  = localStorage.getItem(BG_URL_KEY) || "";
    applyBackground(mode, url, false);
    return { mode, url };
  }

  /* 🎄 XMAS DECORATIONS */
  function enableXmasDecor(){
    if (document.getElementById("xmas-snow")) return;

    // Snow effect
    const snow = document.createElement("div");
    snow.id = "xmas-snow";
    snow.innerHTML = `
      <style>
        @keyframes snow-fall {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
        .snowflake {
          position: fixed;
          top: -10px;
          left: calc(100% * var(--x));
          font-size: 12px;
          color: #fff;
          opacity: 0.8;
          pointer-events: none;
          animation: snow-fall linear infinite;
          animation-duration: var(--d);
        }
      </style>
    `;
    document.body.appendChild(snow);

    for (let i = 0; i < 40; i++){
      const f = document.createElement("div");
      f.className = "snowflake";
      f.style.setProperty("--x", Math.random());
      f.style.setProperty("--d", (6 + Math.random() * 6) + "s");
      f.textContent = "❄";
      snow.appendChild(f);
    }

    // Christmas corner lights
    const lights = document.createElement("img");
    lights.src = "https://i.ibb.co/5x0Hqgr/christmas-lights-top.png";
    lights.id = "xmas-lights";
    lights.style.position = "fixed";
    lights.style.top = "0";
    lights.style.left = "0";
    lights.style.width = "100%";
    lights.style.pointerEvents = "none";
    lights.style.zIndex = "9999";
    document.body.appendChild(lights);
  }

  function disableXmasDecor(){
    const snow = document.getElementById("xmas-snow");
    const lights = document.getElementById("xmas-lights");
    if(snow) snow.remove();
    if(lights) lights.remove();
  }

  /* BOOTSTRAP */
  function bootstrap(){
    loadAccent();
    const t = loadTheme();
    const bg = loadBackground();
    loadTabCloak();

    window.dispatchEvent(new CustomEvent("s0lace:settingsLoaded", {
      detail: {
        accent: localStorage.getItem(ACCENT_KEY) || "green",
        theme: t,
        bgMode: bg.mode,
        bgUrl: bg.url
      }
    }));
  }

  document.addEventListener("DOMContentLoaded", bootstrap);

  window.S0LACE = {
    applyAccent,
    applyTheme,
    applyTabCloak,
    clearTabCloak,
    applyBackground,
  };
})();
