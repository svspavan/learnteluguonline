// Reusable audio player init
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

// Letter + word search maps
const letterMap = {
    "a": "a", "అ": "a",
    "aa": "aa", "ఆ": "aa",
    "i": "i", "ఇ": "i",
    "ee": "ee", "ఈ": "ee",
    "u": "u", "ఉ": "u",
    "oo": "oo", "ఊ": "oo",
    "e": "e", "ఎ": "e",
    "ee2": "ee2", "ఏ": "ee2",
    "ai": "ai", "ఐ": "ai",
    "o": "o", "ఒ": "o",
    "oo2": "oo2", "ఓ": "oo2",
    "au": "au", "ఔ": "au",

    "ka": "ka", "క": "ka",
    "kha": "kha", "ఖ": "kha",
    "ga": "ga", "గ": "ga",
    "gha": "gha", "ఘ": "gha",
    "nga": "nga", "ఙ": "nga",

    "cha": "cha", "చ": "cha",
    "chha": "chha", "ఛ": "chha",
    "ja": "ja", "జ": "ja",
    "jha": "jha", "ఝ": "jha",
    "nya": "nya", "ఞ": "nya",

    "tta": "tta", "ట": "tta",
    "ttha": "ttha", "ఠ": "ttha",
    "dda": "dda", "డ": "dda",
    "ddha": "ddha", "ఢ": "ddha",
    "nna": "nna", "ణ": "nna",

    "ta": "ta", "త": "ta",
    "tha": "tha", "థ": "tha",
    "da": "da", "ద": "da",
    "dha": "dha", "ధ": "dha",
    "na": "na", "న": "na",

    "pa": "pa", "ప": "pa",
    "pha": "pha", "ఫ": "pha",
    "ba": "ba", "బ": "ba",
    "bha": "bha", "భ": "bha",
    "ma": "ma", "మ": "ma",

    "ya": "ya", "య": "ya",
    "ra": "ra", "ర": "ra",
    "la": "la", "ల": "la",
    "va": "va", "వ": "va",

    "sha": "sha", "శ": "sha",
    "ssha": "ssha", "ష": "ssha",
    "sa": "sa", "స": "sa",
    "ha": "ha", "హ": "ha",

    "lla": "lla", "ళ": "lla",
    "ksha": "ksha", "క్ష": "ksha",
    "rra": "rra", "ఱ": "rra"
};

const wordKeys = ["amma", "nanna", "pilli", "gudi", "neellu", "chettu"];

async function handleGlobalSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    if (!query) return;

    // Letters
    if (letterMap[query]) {
        window.location.href = `alphabet/letter.html?name=${letterMap[query]}`;
        return;
    }

    // Words
    if (words[query]) {
        window.location.href = `words/word.html?name=${query}`;
        return;
    }

    // Numbers
    if (!isNaN(query)) {
        window.location.href = `numbers/number.html?num=${query}`;
        return;
    }

    // Categories (colors, animals, fruits, vegetables)
    const categories = ["colors", "animals", "fruits", "vegetables"];
    if (categories.includes(query)) {
        window.location.href = `categories/category.html?name=${query}`;
        return;
    }

    // Padyalu
    if (query === "vemana" || query === "sumati") {
        window.location.href = `padyalu/padyam.html?type=${query}`;
        return;
    }
}

