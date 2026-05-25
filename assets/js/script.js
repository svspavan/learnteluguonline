/* ---------------------------------------------------------
   GLOBAL AUDIO PLAYER
--------------------------------------------------------- */
window.initAudioPlayers = function () {
    document.querySelectorAll(".audio-player").forEach(player => {
        if (player.dataset.bound === "1") return;
        player.dataset.bound = "1";

        const audio = new Audio(player.dataset.src);
        const playBtn = player.querySelector(".play-btn");
        const progressBar = player.querySelector(".progress-bar");
        const timeLabel = player.querySelector(".time-label");

        playBtn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = "⏸";
            } else {
                audio.pause();
                playBtn.textContent = "▶";
            }
        });

        audio.addEventListener("timeupdate", () => {
            if (!audio.duration) return;
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percent + "%";

            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60)
                .toString()
                .padStart(2, "0");
            timeLabel.textContent = `${minutes}:${seconds}`;
        });

        audio.addEventListener("ended", () => {
            playBtn.textContent = "▶";
            progressBar.style.width = "0%";
            timeLabel.textContent = "0:00";
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    window.initAudioPlayers();
});


/* ---------------------------------------------------------
   GLOBAL SEARCH
--------------------------------------------------------- */

// Letter lookup
const letterMap = {
    "అ": "a", "a": "a",
    "ఆ": "aa", "aa": "aa",
    "ఇ": "i", "i": "i",
    "ఈ": "ee", "ee": "ee",
    "ఉ": "u", "u": "u",
    "ఊ": "oo", "oo": "oo",
    "ఎ": "e", "e": "e",
    "ఏ": "ee2", "ee2": "ee2",
    "ఐ": "ai", "ai": "ai",
    "ఒ": "o", "o": "o",
    "ఓ": "oo2", "oo2": "oo2",
    "ఔ": "au", "au": "au",

    "క": "ka", "ka": "ka",
    "ఖ": "kha", "kha": "kha",
    "గ": "ga", "ga": "ga",
    "ఘ": "gha", "gha": "gha",
    "ఙ": "nga", "nga": "nga",

    "చ": "cha", "cha": "cha",
    "ఛ": "chha", "chha": "chha",
    "జ": "ja", "ja": "ja",
    "ఝ": "jha", "jha": "jha",
    "ఞ": "nya", "nya": "nya",

    "ట": "tta", "tta": "tta",
    "ఠ": "ttha", "ttha": "ttha",
    "డ": "dda", "dda": "dda",
    "ఢ": "ddha", "ddha": "ddha",
    "ణ": "nna", "nna": "nna",

    "త": "ta", "ta": "ta",
    "థ": "tha", "tha": "tha",
    "ద": "da", "da": "da",
    "ధ": "dha", "dha": "dha",
    "న": "na", "na": "na",

    "ప": "pa", "pa": "pa",
    "ఫ": "pha", "pha": "pha",
    "బ": "ba", "ba": "ba",
    "భ": "bha", "bha": "bha",
    "మ": "ma", "ma": "ma",

    "య": "ya", "ya": "ya",
    "ర": "ra", "ra": "ra",
    "ల": "la", "la": "la",
    "వ": "va", "va": "va",

    "శ": "sha", "sha": "sha",
    "ష": "ssha", "ssha": "ssha",
    "స": "sa", "sa": "sa",
    "హ": "ha", "ha": "ha",

    "ళ": "lla", "lla": "lla",
    "క్ష": "ksha", "ksha": "ksha",
    "ఱ": "rra", "rra": "rra"
};

// Word lookup (auto-loaded)
let words = {};

(async function preloadWords() {
    try {
        const res = await fetch("../words/data/words.json");
        words = await res.json();
    } catch (e) {
        // ignore if not on words pages
    }
})();

async function handleGlobalSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    if (!query) return;

    // Letters
    if (letterMap[query]) {
        window.location.href = `../alphabet/letter.html?name=${letterMap[query]}`;
        return;
    }

    // Words
    if (words[query]) {
        window.location.href = `../words/word.html?name=${query}`;
        return;
    }

    // Numbers
    if (!isNaN(query)) {
        window.location.href = `../numbers/number.html?num=${query}`;
        return;
    }

    // Categories
    const categories = ["colors", "animals", "fruits", "vegetables", "shapes"];
    if (categories.includes(query)) {
        window.location.href = `../categories/category.html?name=${query}`;
        return;
    }

    // Padyalu
    if (query === "vemana" || query === "sumati") {
        window.location.href = `../padyalu/padyam.html?type=${query}`;
        return;
    }
}


/* ---------------------------------------------------------
   BREADCRUMB BUILDER
--------------------------------------------------------- */
function buildBreadcrumb(parts) {
    const container = document.getElementById("breadcrumb");
    if (!container) return;

    let html = `<a href="../index.html">Home</a>`;

    parts.forEach(p => {
        html += ` <span>›</span> `;
        if (p.link) {
            html += `<a href="${p.link}">${p.label}</a>`;
        } else {
            html += `<span>${p.label}</span>`;
        }
    });

    container.innerHTML = html;
}


/* ---------------------------------------------------------
   THEME TOGGLE
--------------------------------------------------------- */
function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggle.textContent = "☀️";
    }

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            toggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            toggle.textContent = "🌙";
        }
    });
}

document.addEventListener("DOMContentLoaded", initTheme);


/* ---------------------------------------------------------
   MOBILE MENU
--------------------------------------------------------- */
function toggleMenu() {
    document.querySelector(".nav").classList.toggle("open");
}
