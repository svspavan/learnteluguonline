/* ---------------------------------------------------------
   MISSING IMAGE FALLBACK
   Many content entries reference image files that don't exist yet.
   Hide the broken-image icon instead of showing it. "error" doesn't
   bubble, so this must be a capture-phase listener on document.
--------------------------------------------------------- */
document.addEventListener("error", (e) => {
    if (e.target.tagName === "IMG") {
        e.target.style.display = "none";
    }
}, true);


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
   Root-relative paths ("/...") are used throughout so this works
   identically from the homepage, root SEO pages, and any section
   page, regardless of folder depth.
--------------------------------------------------------- */

const CATEGORY_META = {
    colors: { telugu: "రంగులు", english: "Colors" },
    animals: { telugu: "జంతువులు", english: "Animals" },
    fruits: { telugu: "పండ్లు", english: "Fruits" },
    vegetables: { telugu: "కూరగాయలు", english: "Vegetables" },
    shapes: { telugu: "ఆకారాలు", english: "Shapes" },
    toys: { telugu: "బొమ్మలు", english: "Toys" },
    household: { telugu: "ఇంటి వస్తువులు", english: "Household Items" },
    family: { telugu: "కుటుంబం", english: "Family" },
    bodyparts: { telugu: "శరీర భాగాలు", english: "Body Parts" },
    vehicles: { telugu: "వాహనాలు", english: "Vehicles" },
    nature: { telugu: "ప్రకృతి", english: "Nature" },
    school: { telugu: "పాఠశాల వస్తువులు", english: "School Items" }
};

const GRAMMAR_TOPICS = [
    { key: "vibhaktulu", label: "Vibhaktulu (Cases)", telugu: "విభక్తులు" },
    { key: "tenses", label: "Tenses", telugu: "కాలములు" },
    { key: "verb_conjugation", label: "Verb Conjugation", telugu: "ధాతు రూపాలు" },
    { key: "sentence_structure", label: "Sentence Structure", telugu: "వాక్య నిర్మాణం" },
    { key: "sandhi", label: "Sandhi", telugu: "సంధులు" },
    { key: "samasam", label: "Samasam", telugu: "సమాసాలు" },
    { key: "pronouns", label: "Pronouns", telugu: "సర్వనామాలు" },
    { key: "gender", label: "Gender", telugu: "లింగాలు" },
    { key: "numbers", label: "Numbers (Grammar)", telugu: "వచనాలు" },
    { key: "adjectives", label: "Adjectives", telugu: "విశేషణాలు" },
    { key: "adverbs", label: "Adverbs", telugu: "క్రియావిశేషణాలు" },
    { key: "alankaralu", label: "Alankaralu (Figures of Speech)", telugu: "అలంకారాలు" },
    { key: "chandassu", label: "Chandassu (Meter)", telugu: "ఛందస్సు" },
    { key: "jatiyalu", label: "Idioms (Jatiyalu)", telugu: "జాతీయాలు" },
    { key: "saamethalu", label: "Proverbs (Saamethalu)", telugu: "సామెతలు" },
    { key: "gauravavachakalu", label: "Honorifics", telugu: "గౌరవ వాచకాలు" },
    { key: "dviruktalu", label: "Reduplication & Paired Words", telugu: "ద్విరుక్తాలు" },
    { key: "vaakya_kathanam", label: "Reported Speech & Verb Forms", telugu: "కథనం, నిషేధం & షరతు" }
];

const SENTENCE_CATEGORIES = [
    "greetings", "home", "travel", "daily", "food", "work", "shopping", "health",
    "school", "family", "nature", "emergency", "temple", "feelings", "directions",
    "technology", "weather", "transport", "restaurant", "phone_calls", "kids",
    "neighbors", "sports"
];

function prettifyKey(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

let searchIndex = null;
let searchIndexPromise = null;

async function fetchJSON(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

async function buildSearchIndex() {
    const [letters, words, numbers, stories] = await Promise.all([
        fetchJSON("/alphabet/data/letters.json"),
        fetchJSON("/words/data/words.json"),
        fetchJSON("/numbers/data/numbers.json"),
        fetchJSON("/stories/data/stories.json")
    ]);

    const index = [];

    for (const [key, item] of Object.entries(letters || {})) {
        index.push({
            type: item.type === "vowel" ? "Vowel" : "Consonant",
            telugu: item.telugu,
            english: item.english,
            keys: [key],
            url: `/alphabet/letter.html?name=${key}&from=${item.type === "vowel" ? "vowels" : "consonants"}`
        });
    }

    for (const [key, item] of Object.entries(words || {})) {
        index.push({
            type: "Word",
            telugu: item.telugu,
            english: item.english,
            keys: [key],
            url: `/words/word.html?name=${key}`
        });
    }

    for (const [num, item] of Object.entries(numbers || {})) {
        index.push({
            type: "Number",
            telugu: item.telugu,
            english: item.english,
            keys: [num],
            url: `/numbers/number.html?num=${num}&from=numbers`
        });
    }

    for (const [key, item] of Object.entries(stories || {})) {
        index.push({
            type: "Story",
            telugu: item.title,
            english: item.english_title,
            keys: [key],
            url: `/stories/story.html?name=${key}`
        });
    }

    for (const [key, meta] of Object.entries(CATEGORY_META)) {
        index.push({
            type: "Category",
            telugu: meta.telugu,
            english: meta.english,
            keys: [key],
            url: `/categories/category.html?name=${key}`
        });
    }

    for (const topic of GRAMMAR_TOPICS) {
        index.push({
            type: "Grammar",
            telugu: topic.telugu,
            english: topic.label,
            keys: [topic.key],
            url: `/grammar/topic.html?name=${topic.key}`
        });
    }

    for (const key of SENTENCE_CATEGORIES) {
        index.push({
            type: "Sentences",
            telugu: "",
            english: prettifyKey(key),
            keys: [key],
            url: `/sentences/sentence.html?category=${key}`
        });
    }

    index.push({ type: "Shatakam", telugu: "వేమన శతకము", english: "Vemana Satakam", keys: ["vemana"], url: "/padyalu/padyam.html?type=vemana" });
    index.push({ type: "Shatakam", telugu: "సుమతీ శతకము", english: "Sumati Satakam", keys: ["sumati"], url: "/padyalu/padyam.html?type=sumati" });

    const [samasya, saametha] = await Promise.all([
        fetchJSON("/rachanalu/data/samasya.json"),
        fetchJSON("/rachanalu/data/saametha.json")
    ]);

    for (const [key, item] of Object.entries(samasya || {})) {
        index.push({
            type: "Samasya Puranam",
            telugu: item.samasya || "",
            english: item.meaning || "",
            keys: [key],
            url: `/rachanalu/rachana.html?type=samasya#${key}`
        });
    }

    for (const [key, item] of Object.entries(saametha || {})) {
        index.push({
            type: "Saametha Padyalu",
            telugu: (item.lines && item.lines[0]) || "",
            english: item.proverb || "",
            keys: [key],
            url: `/rachanalu/rachana.html?type=saametha#${key}`
        });
    }

    return index;
}

function getSearchIndex() {
    if (!searchIndexPromise) searchIndexPromise = buildSearchIndex();
    return searchIndexPromise;
}

function matchesQuery(entry, query) {
    if (entry.telugu && entry.telugu.includes(query)) return true;
    const lower = query.toLowerCase();
    if (entry.english && entry.english.toLowerCase().includes(lower)) return true;
    return entry.keys.some(k => k.toLowerCase().includes(lower));
}

function renderSearchResults(container, matches, query) {
    if (!query) {
        container.classList.remove("open");
        container.innerHTML = "";
        return;
    }

    if (!matches.length) {
        container.innerHTML = `<div class="search-no-results">No results for "${query}"</div>`;
        container.classList.add("open");
        return;
    }

    container.innerHTML = matches.slice(0, 8).map((m, i) => `
        <a href="${m.url}" class="search-result-item${i === 0 ? " active" : ""}">
            <span class="search-result-main">
                <span class="search-result-telugu">${m.telugu || m.english}</span>
                ${m.telugu ? `<span class="search-result-english">${m.english}</span>` : ""}
            </span>
            <span class="search-result-type">${m.type}</span>
        </a>
    `).join("");
    container.classList.add("open");
}

function initSiteSearch() {
    document.querySelectorAll(".search-box").forEach(box => {
        const input = box.querySelector(".search-input");
        const results = box.querySelector(".search-results");
        if (!input || !results) return;

        input.addEventListener("input", async () => {
            const query = input.value.trim();
            const index = await getSearchIndex();
            const matches = query ? index.filter(e => matchesQuery(e, query)) : [];
            renderSearchResults(results, matches, query);
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const first = results.querySelector(".search-result-item");
                if (first) {
                    e.preventDefault();
                    window.location.href = first.getAttribute("href");
                }
            } else if (e.key === "Escape") {
                results.classList.remove("open");
                input.blur();
            }
        });

        document.addEventListener("click", (e) => {
            if (!box.contains(e.target)) results.classList.remove("open");
        });
    });
}

document.addEventListener("DOMContentLoaded", initSiteSearch);


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

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
});
