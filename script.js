/* =========================================================
   STARSPRINT
   JS PART 1/5
   GAME DATA + NAVIGATION
========================================================= */

const game = {
    player: {
        name: "PILOT",
        credits: 1250,

        races: 0,
        wins: 0,
        bestWPM: 0,
        averageWPM: 0,
        accuracy: 100,

        ship: "starter",
        league: "Bronze",
        team: null
    },

    currentScreen: "homeScreen",

    selectedSector: null,

    race: {
        active: false,
        finished: false,

        text: "",
        typed: "",

        startTime: 0,
        endTime: 0,

        correct: 0,
        errors: 0,

        wpm: 0,
        accuracy: 100,

        position: 1,

        ai: []
    }
};


/* =========================================================
   RACE TEXT
========================================================= */

const raceTexts = [
    "The stars were quiet as the small spacecraft crossed the edge of the system.",
    "Beyond the asteroid belt, a distant blue planet appeared through the darkness.",
    "Navigation systems online. Engines stable. The pilot prepared for another jump.",
    "A signal appeared on the scanner, coming from somewhere beyond the outer planets.",
    "The spacecraft accelerated through the empty void while distant stars blurred past.",
    "Every journey begins with a single destination and a willingness to explore.",
    "The colony ship drifted silently through the empty system searching for a new home.",
    "A strange object moved across the scanner and disappeared before anyone could identify it."
];


/* =========================================================
   AI NAMES
========================================================= */

const aiNames = [
    "Nova",
    "Orion",
    "Comet",
    "Vega",
    "Atlas",
    "Luna",
    "Cosmo",
    "Echo",
    "Pulsar",
    "Drift"
];


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    const screen = document.getElementById(id);

    if (screen) {
        screen.classList.remove("hidden");
    }

    game.currentScreen = id;
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
    document.querySelectorAll("[data-screen]").forEach(button => {
        button.addEventListener("click", () => {
            showScreen(button.dataset.screen);
        });
    });
}


function goHome() {
    showScreen("homeScreen");
}


function goRace() {
    showScreen("raceSelectScreen");
}


function goShop() {
    showScreen("shopScreen");
}


function goLeagues() {
    showScreen("leaguesScreen");
}


function goTeams() {
    showScreen("teamsScreen");
}


function goProfile() {
    showScreen("profileScreen");
}


/* =========================================================
   SECTOR SELECTION
========================================================= */

function setupSectors() {
    document.querySelectorAll(".sector-card").forEach(card => {
        card.addEventListener("click", () => {

            if (card.classList.contains("locked")) {
                return;
            }

            document.querySelectorAll(".sector-card").forEach(other => {
                other.classList.remove("selected");
            });

            card.classList.add("selected");

            game.selectedSector =
                card.dataset.sector || card.id;
        });
    });
}


/* =========================================================
   RANDOM RACE TEXT
========================================================= */

function getRaceText() {
    const index = Math.floor(Math.random() * raceTexts.length);
    return raceTexts[index];
}


/* =========================================================
   RANDOM ITEM
========================================================= */

function randomItem(array) {
    return array[
        Math.floor(Math.random() * array.length)
    ];
}


/* =========================================================
   SAFE TEXT
========================================================= */

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


/* =========================================================
   INITIALISE
========================================================= */

function initGame() {
    setupNavigation();
    setupSectors();

    showScreen("homeScreen");

    updatePlayerDisplay();
}


document.addEventListener("DOMContentLoaded", initGame);

/* =========================================================
   STARSPRINT
   JS PART 2/5
   RACE SETUP
========================================================= */


/* =========================================================
   START RACE
========================================================= */

function startRace() {

    if (game.race.active) {
        return;
    }

    game.race = {
        active: false,
        finished: false,

        text: getRaceText(),
        typed: "",

        startTime: 0,
        endTime: 0,

        correct: 0,
        errors: 0,

        wpm: 0,
        accuracy: 100,

        position: 1,

        ai: []
    };


    showScreen("raceScreen");


    const input = document.getElementById("typingInput");

    if (input) {
        input.value = "";
    }


    renderRaceText();


    createAI();


    runCountdown();
}


/* =========================================================
   COUNTDOWN
========================================================= */

function runCountdown() {

    const countdown =
        document.getElementById("raceCountdown");


    if (!countdown) {
        beginRace();
        return;
    }


    countdown.classList.remove("hidden");

    countdown.textContent = "3";


    setTimeout(() => {
        countdown.textContent = "2";
    }, 700);


    setTimeout(() => {
        countdown.textContent = "1";
    }, 1400);


    setTimeout(() => {

        countdown.textContent = "GO!";

        setTimeout(() => {

            countdown.classList.add("hidden");

            beginRace();

        }, 400);

    }, 2100);
}


/* =========================================================
   BEGIN RACE
========================================================= */

function beginRace() {

    game.race.active = true;

    game.race.startTime = performance.now();


    const input =
        document.getElementById("typingInput");


    if (input) {
        input.value = "";
        input.focus();
    }


    startAI();

    updateRaceStats();
    updatePlayerShip();
}


/* =========================================================
   RANDOM AI STATS
========================================================= */

function createAI() {

    game.race.ai = [];


    for (let i = 0; i < 4; i++) {

        const name = randomItem(aiNames);


        /*
           AI are intentionally imperfect.

           Most racers:
           35-75 WPM

           Better racers:
           70-90 WPM

           Nobody starts at 150+ WPM.
        */

        let wpm;

        const roll = Math.random();

        if (roll < 0.65) {
            wpm = randomNumber(35, 65);
        }
        else if (roll < 0.92) {
            wpm = randomNumber(60, 78);
        }
        else {
            wpm = randomNumber(78, 90);
        }


        game.race.ai.push({
            name: name,

            wpm: wpm,

            accuracy: randomNumber(89, 99),

            progress: 0,

            finished: false,

            finishTime: null,

            errorChance:
                randomNumber(1, 5) / 100
        });
    }
}


/* =========================================================
   RANDOM NUMBER
========================================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}

/* =========================================================
   STARSPRINT
   JS PART 3/5
   TYPING + PLAYER MOVEMENT
========================================================= */


/* =========================================================
   SETUP TYPING
========================================================= */

function setupTyping() {

    const input =
        document.getElementById("typingInput");


    if (!input) {
        return;
    }


    input.addEventListener("input", () => {

        if (!game.race.active) {
            return;
        }


        game.race.typed = input.value;


        calculateTypingStats();

        renderRaceText();

        updatePlayerShip();


        if (
            game.race.typed.length >=
            game.race.text.length
        ) {
            finishRace();
        }
    });


    const panel =
        document.getElementById("typingPanel");


    if (panel) {

        panel.addEventListener("click", () => {
            input.focus();
        });

    }
}


/* =========================================================
   RENDER TEXT
========================================================= */

function renderRaceText() {

    const container =
        document.getElementById("raceText");


    if (!container) {
        return;
    }


    let html = "";


    for (
        let i = 0;
        i < game.race.text.length;
        i++
    ) {

        const character =
            game.race.text[i];


        if (
            i < game.race.typed.length
        ) {

            if (
                game.race.typed[i] === character
            ) {

                html +=
                    `<span class="correct">${escapeHTML(character)}</span>`;

            }
            else {

                html +=
                    `<span style="color:#ff5e78">${escapeHTML(character)}</span>`;

            }

        }
        else if (
            i === game.race.typed.length
        ) {

            html +=
                `<span class="current">${escapeHTML(character)}</span>`;

        }
        else {

            html +=
                escapeHTML(character);
        }
    }


    container.innerHTML = html;
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CALCULATE STATS
========================================================= */

function calculateTypingStats() {

    let correct = 0;
    let errors = 0;


    for (
        let i = 0;
        i < game.race.typed.length;
        i++
    ) {

        if (
            game.race.typed[i] ===
            game.race.text[i]
        ) {

            correct++;

        }
        else {

            errors++;

        }
    }


    game.race.correct = correct;
    game.race.errors = errors;


    updateRaceStats();
}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateRaceStats() {

    if (!game.race.startTime) {
        return;
    }


    const elapsed =
        (
            performance.now() -
            game.race.startTime
        ) / 1000;


    const minutes =
        elapsed / 60;


    if (minutes <= 0) {
        return;
    }


    game.race.wpm =
        Math.round(
            (game.race.correct / 5) /
            minutes
        );


    const total =
        game.race.typed.length;


    game.race.accuracy =
        total === 0
            ? 100
            : Math.round(
                (
                    game.race.correct /
                    total
                ) * 100
            );


    setText(
        "raceWPM",
        game.race.wpm
    );


    setText(
        "raceAccuracy",
        game.race.accuracy + "%"
    );


    const progress =
        Math.round(
            (
                game.race.typed.length /
                game.race.text.length
            ) * 100
        );


    setText(
        "raceProgress",
        progress + "%"
    );
}


/* =========================================================
   PLAYER SHIP
========================================================= */

function updatePlayerShip() {

    const ship =
        document.querySelector(
            ".racer-ship.player"
        );


    const space =
        document.getElementById("space");


    if (!ship || !space) {
        return;
    }


    const progress =
        Math.min(
            game.race.typed.length /
            game.race.text.length,
            1
        );


    const maximum =
        space.clientWidth - 130;


    ship.style.left =
        `${20 + maximum * progress}px`;
}


/* =========================================================
   KEEP STATS UPDATED
========================================================= */

setInterval(() => {

    if (
        game.race.active
    ) {

        updateRaceStats();
        updatePlayerShip();

    }

}, 100);

/* =========================================================
   STARSPRINT
   JS PART 4/5
   AI RACING
========================================================= */


/* =========================================================
   START AI
========================================================= */

function startAI() {

    game.race.ai.forEach(ai => {

        ai.progress = 0;
        ai.finished = false;
        ai.finishTime = null;

    });


    requestAnimationFrame(updateAI);
}


/* =========================================================
   UPDATE AI
========================================================= */

function updateAI() {

    if (!game.race.active) {
        return;
    }


    const elapsed =
        (
            performance.now() -
            game.race.startTime
        ) / 1000;


    const totalCharacters =
        game.race.text.length;


    game.race.ai.forEach(ai => {

        if (ai.finished) {
            return;
        }


        /*
           WPM → characters per second.

           5 characters = approximately
           one typing word.
        */

        const charactersPerSecond =
            (
                ai.wpm * 5
            ) / 60;


        let expected =
            charactersPerSecond *
            elapsed;


        /*
           Accuracy makes AI occasionally
           lose a little progress.
        */

        const mistakePenalty =
            1 -
            (
                (100 - ai.accuracy)
                / 100
            );


        expected *= mistakePenalty;


        /*
           Small random variation means
           the AI doesn't move like robots.
        */

        const variation =
            1 +
            (
                Math.sin(
                    elapsed * 1.7 +
                    ai.wpm
                ) * 0.025
            );


        expected *= variation;


        ai.progress =
            Math.min(
                expected /
                totalCharacters,
                1
            );


        if (
            ai.progress >= 1
        ) {

            ai.progress = 1;

            ai.finished = true;

            ai.finishTime =
                performance.now();

        }

    });


    renderAI();


    calculatePosition();


    requestAnimationFrame(updateAI);
}


/* =========================================================
   RENDER AI
========================================================= */

function renderAI() {

    const ships =
        document.querySelectorAll(
            ".racer-ship.ai"
        );


    const space =
        document.getElementById("space");


    if (!space) {
        return;
    }


    const maximum =
        space.clientWidth - 130;


    ships.forEach((ship, index) => {

        const ai =
            game.race.ai[index];


        if (!ai) {
            return;
        }


        ship.style.left =
            `${20 + maximum * ai.progress}px`;


        const label =
            ship.querySelector(
                ".racer-label"
            );


        if (label) {
            label.textContent =
                ai.name;
        }

    });
}


/* =========================================================
   CALCULATE POSITION
========================================================= */

function calculatePosition() {

    const playerProgress =
        game.race.typed.length /
        game.race.text.length;


    let position = 1;


    game.race.ai.forEach(ai => {

        if (
            ai.progress >
            playerProgress
        ) {

            position++;

        }

    });


    game.race.position =
        position;


    /*
       This means the player can actually
       finish 2nd, 3rd, 4th or 5th.
    */

    setText(
        "racePosition",
        "#" + position
    );
}


/* =========================================================
   FINISH RACE
========================================================= */

function finishRace() {

    if (!game.race.active) {
        return;
    }


    game.race.active = false;

    game.race.finished = true;

    game.race.endTime =
        performance.now();


    calculateTypingStats();

    calculatePosition();


    game.player.races++;


    if (
        game.race.position === 1
    ) {

        game.player.wins++;

    }


    if (
        game.race.wpm >
        game.player.bestWPM
    ) {

        game.player.bestWPM =
            game.race.wpm;

    }


    showResults();


    /*
       Part 5 will add the full results,
       shop, leagues, teams and saving.
    */
}

/* =========================================================
   STARSPRINT
   JS PART 5/5
   RESULTS + PLAYER UI
========================================================= */


/* =========================================================
   SHOW RESULTS
========================================================= */

function showResults() {

    showScreen("resultsScreen");


    setText(
        "resultPosition",
        "#" + game.race.position
    );


    setText(
        "resultWPM",
        game.race.wpm
    );


    setText(
        "resultAccuracy",
        game.race.accuracy + "%"
    );


    updatePlayerDisplay();
}


/* =========================================================
   PLAYER DISPLAY
========================================================= */

function updatePlayerDisplay() {

    document.querySelectorAll(
        "[data-player-name]"
    ).forEach(element => {

        element.textContent =
            game.player.name;

    });


    document.querySelectorAll(
        "[data-credits]"
    ).forEach(element => {

        element.textContent =
            game.player.credits;

    });


    document.querySelectorAll(
        "[data-wpm]"
    ).forEach(element => {

        element.textContent =
            game.player.bestWPM;

    });


    document.querySelectorAll(
        "[data-wins]"
    ).forEach(element => {

        element.textContent =
            game.player.wins;

    });


    document.querySelectorAll(
        "[data-races]"
    ).forEach(element => {

        element.textContent =
            game.player.races;

    });
}


/* =========================================================
   START RACE BUTTONS
========================================================= */

function setupStartButtons() {

    document.querySelectorAll(
        "[data-start-race]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            startRace
        );

    });
}


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" &&
            game.currentScreen ===
            "raceSelectScreen"
        ) {

            event.preventDefault();

            startRace();

        }

    }
);


/* =========================================================
   ADDITIONAL INITIALISATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupTyping();

        setupStartButtons();

        updatePlayerDisplay();

    }
);
