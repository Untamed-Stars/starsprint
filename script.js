/* =====================================================
   STARSPRINT v0.2
   Typing Space Racing Game
===================================================== */


/* =====================================================
   DOM
===================================================== */

const galaxyScreen =
    document.getElementById("galaxyScreen");

const raceScreen =
    document.getElementById("raceScreen");

const resultsScreen =
    document.getElementById("resultsScreen");

const headerStats =
    document.getElementById("headerStats");

const launchButton =
    document.getElementById("launchButton");

const againButton =
    document.getElementById("againButton");

const mapButton =
    document.getElementById("mapButton");

const typingInput =
    document.getElementById("typingInput");

const textDisplay =
    document.getElementById("textDisplay");

const countdown =
    document.getElementById("countdown");

const lanes =
    document.getElementById("lanes");

const space =
    document.getElementById("space");

const leaderboard =
    document.getElementById("leaderboard");


/* stats */

const wpmDisplay =
    document.getElementById("wpm");

const accuracyDisplay =
    document.getElementById("accuracy");

const progressDisplay =
    document.getElementById("progress");

const charactersDisplay =
    document.getElementById("characters");

const errorsDisplay =
    document.getElementById("errors");


/* sector information */

const sectorLength =
    document.getElementById("sectorLength");

const sectorDifficulty =
    document.getElementById("sectorDifficulty");

const sectorReward =
    document.getElementById("sectorReward");


/* results */

const resultTitle =
    document.getElementById("resultTitle");

const resultIcon =
    document.getElementById("resultIcon");

const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalReward =
    document.getElementById("finalReward");


/* =====================================================
   GAME DATA
===================================================== */

const passages = [

    "The stars stretched endlessly beyond the edge of the nebula.",

    "A distant planet appeared through the clouds of violet gas.",

    "The spacecraft accelerated toward the glowing edge of the galaxy.",

    "Millions of stars surrounded the tiny ship as it crossed the void.",

    "The pilot watched the asteroid field approach and prepared for the jump.",

    "Beyond the moon was a strange world covered in oceans of blue light.",

    "The navigation system calculated a route through the dangerous sector.",

    "A silent signal echoed through space from somewhere beyond the stars."

];


/* =====================================================
   SECTORS
===================================================== */

const sectors = [

    {
        name: "ORION GATE",

        difficulty: "BEGINNER",

        length: "SHORT",

        reward: 100,

        aiMin: 25,

        aiMax: 38
    },

    {
        name: "ASTEROID RUN",

        difficulty: "INTERMEDIATE",

        length: "MEDIUM",

        reward: 175,

        aiMin: 35,

        aiMax: 50
    },

    {
        name: "GIANT'S RING",

        difficulty: "ADVANCED",

        length: "LONG",

        reward: 300,

        aiMin: 45,

        aiMax: 62
    },

    {
        name: "VOID EDGE",

        difficulty: "EXTREME",

        length: "EXTREME",

        reward: 500,

        aiMin: 55,

        aiMax: 75
    }

];


let selectedSector = 0;


/* =====================================================
   AI DATA
===================================================== */

const aiProfiles = [

    {
        name: "NOVA",

        ship: "SCOUT",

        skill: "cadet"
    },

    {
        name: "KESTREL",

        ship: "INTERCEPTOR",

        skill: "pilot"
    },

    {
        name: "VEX",

        ship: "EXPLORER",

        skill: "pilot"
    },

    {
        name: "ORBIT",

        ship: "RANGER",

        skill: "ace"
    }

];


/*
    AI skill modifiers.

    These are NOT fixed movement speeds.

    WPM is converted into typing progress.
*/

const aiSkill = {

    cadet: {

        accuracy: [88, 94],

        reaction: [500, 850],

        consistency: 0.25

    },

    pilot: {

        accuracy: [92, 97],

        reaction: [350, 600],

        consistency: 0.14

    },

    ace: {

        accuracy: [96, 99],

        reaction: [250, 450],

        consistency: 0.08

    }

};


/* =====================================================
   GAME STATE
===================================================== */

let currentText = "";

let currentIndex = 0;

let totalTyped = 0;

let correctTyped = 0;

let errors = 0;

let raceStarted = false;

let raceFinished = false;

let startTime = 0;

let raceTimer = null;

let aiTimer = null;

let playerShip = null;

let aiRacers = [];


/* =====================================================
   UTILITY
===================================================== */

function random(min, max) {

    return Math.random() * (max - min) + min;

}


function randomInt(min, max) {

    return Math.floor(
        random(min, max + 1)
    );

}


function choose(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


/* =====================================================
   SECTOR SELECTION
===================================================== */

const sectorButtons =
    document.querySelectorAll(".sector");


sectorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const index =
            Number(button.dataset.sector);

        if (index > 1) {
            return;
        }

        selectedSector = index;

        sectorButtons.forEach(btn => {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

        updateSectorInfo();

    });

});


function updateSectorInfo() {

    const sector =
        sectors[selectedSector];

    sectorLength.textContent =
        sector.length;

    sectorDifficulty.textContent =
        sector.difficulty;

    sectorReward.textContent =
        `${sector.reward} CR`;

}


updateSectorInfo();


/* =====================================================
   TEXT
===================================================== */

function getPassage() {

    return choose(passages);

}


function prepareText() {

    currentText =
        getPassage();

    currentIndex = 0;

    totalTyped = 0;

    correctTyped = 0;

    errors = 0;

    textDisplay.innerHTML = "";

    for (
        let i = 0;
        i < currentText.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.textContent =
            currentText[i];

        if (i === 0) {

            span.classList.add("current");

        }

        textDisplay.appendChild(span);

    }

    updateStats();

}


/* =====================================================
   CREATE LANES
===================================================== */

function createLanes() {

    lanes.innerHTML = "";

    for (let i = 0; i < 5; i++) {

        const lane =
            document.createElement("div");

        lane.className =
            "lane";

        lanes.appendChild(lane);

    }

}


/* =====================================================
   CREATE SHIP
===================================================== */

function createShip(
    name,
    type,
    lane,
    isAI = false
) {

    const ship =
        document.createElement("div");

    ship.className =
        `ship ${isAI ? "ai" : "player"}`;

    ship.style.top =
        `${lane}%`;

    const body =
        document.createElement("div");

    body.className =
        "ship-body";

    const wingLeft =
        document.createElement("div");

    wingLeft.className =
        "ship-wing left";

    const wingRight =
        document.createElement("div");

    wingRight.className =
        "ship-wing right";

    const engine =
        document.createElement("div");

    engine.className =
        "ship-engine";

    const label =
        document.createElement("div");

    label.className =
        "ship-label";

    label.textContent =
        `${name} • ${type}`;

    ship.appendChild(body);

    ship.appendChild(wingLeft);

    ship.appendChild(wingRight);

    ship.appendChild(engine);

    ship.appendChild(label);

    space.appendChild(ship);

    return ship;

}


/* =====================================================
   CREATE RACERS
===================================================== */

function createRacers() {

    document
        .querySelectorAll(".ship")
        .forEach(ship => ship.remove());

    playerShip =
        createShip(
            "YOU",
            "STARLING",
            10,
            false
        );


    aiRacers = [];


    const sector =
        sectors[selectedSector];


    aiProfiles.forEach(
        (profile, index) => {

            const settings =
                aiSkill[profile.skill];

            let wpm =
                random(
                    sector.aiMin,
                    sector.aiMax
                );


            /*
                Skill adjusts how far inside
                the sector's WPM range they sit.
            */

            if (profile.skill === "cadet") {

                wpm *= 0.88;

            }

            if (profile.skill === "ace") {

                wpm *= 1.08;

            }


            wpm = Math.round(wpm);


            const accuracy =
                randomInt(
                    settings.accuracy[0],
                    settings.accuracy[1]
                );


            const reaction =
                random(
                    settings.reaction[0],
                    settings.reaction[1]
                );


            const ai = {

                name: profile.name,

                ship: profile.ship,

                skill: profile.skill,

                wpm: wpm,

                accuracy: accuracy,

                reaction: reaction,

                consistency:
                    settings.consistency,

                progress: 0,

                typed: 0,

                correct: 0,

                errors: 0,

                nextType: 0,

                finished: false,

                element:
                    createShip(
                        profile.name,
                        profile.ship,
                        30 + index * 20,
                        true
                    )

            };


            aiRacers.push(ai);

        }

    );

}


/* =====================================================
   RESET SHIPS
===================================================== */

function resetShipPositions() {

    if (playerShip) {

        playerShip.style.left =
            "20px";

    }

    aiRacers.forEach(ai => {

        ai.progress = 0;

        ai.typed = 0;

        ai.correct = 0;

        ai.errors = 0;

        ai.finished = false;

        ai.element.style.left =
            "20px";

    });

}


/* =====================================================
   START RACE
===================================================== */

launchButton.addEventListener(
    "click",
    startRace
);


function startRace() {

    galaxyScreen.classList.add(
        "hidden"
    );

    resultsScreen.classList.add(
        "hidden"
    );

    raceScreen.classList.remove(
        "hidden"
    );

    headerStats.classList.remove(
        "hidden"
    );


    prepareText();

    createLanes();

    createRacers();

    resetShipPositions();


    raceStarted = false;

    raceFinished = false;


    typingInput.value = "";

    typingInput.disabled = true;


    countdown.textContent = "3";


    let number = 3;


    const timer =
        setInterval(() => {

            number--;


            if (number > 0) {

                countdown.textContent =
                    number;

            }

            else if (number === 0) {

                countdown.textContent =
                    "GO!";

                beginRace();

            }

            else {

                clearInterval(timer);

                countdown.textContent =
                    "";

            }

        }, 1000);

}


/* =====================================================
   BEGIN
===================================================== */

function beginRace() {

    raceStarted = true;

    raceFinished = false;

    startTime =
        Date.now();


    typingInput.disabled =
        false;

    typingInput.focus();


    raceTimer =
        setInterval(
            updateStats,
            100
        );


    startAI();

}


/* =====================================================
   PLAYER TYPING
===================================================== */

typingInput.addEventListener(
    "input",
    handleTyping
);


function handleTyping() {

    if (
        !raceStarted ||
        raceFinished
    ) {

        return;

    }


    const value =
        typingInput.value;


    if (!value.length) {

        return;

    }


    const character =
        value[value.length - 1];

    const expected =
        currentText[currentIndex];


    totalTyped++;


    if (
        character === expected
    ) {

        correctTyped++;

        currentIndex++;

        typingInput.value = "";

        updateTextDisplay();

        movePlayer();

        updateStats();


        if (
            currentIndex >=
            currentText.length
        ) {

            finishRace(true);

        }

    }

    else {

        errors++;

        typingInput.value = "";

        updateTextDisplay();

        updateStats();

    }

}


/* =====================================================
   TEXT DISPLAY
===================================================== */

function updateTextDisplay() {

    const letters =
        textDisplay.children;


    for (
        let i = 0;
        i < letters.length;
        i++
    ) {

        letters[i]
            .classList
            .remove(
                "correct",
                "current"
            );


        if (
            i < currentIndex
        ) {

            letters[i]
                .classList
                .add("correct");

        }

        else if (
            i === currentIndex
        ) {

            letters[i]
                .classList
                .add("current");

        }

    }

}


/* =====================================================
   PLAYER MOVEMENT
===================================================== */

function movePlayer() {

    if (!playerShip) {
        return;
    }


    const width =
        space.clientWidth;


    const shipWidth = 76;

    const max =
        width -
        shipWidth -
        35;


    const progress =
        currentIndex /
        currentText.length;


    const position =
        20 +
        (max - 20) *
        progress;


    playerShip.style.left =
        `${position}px`;

}


/* =====================================================
   WPM
===================================================== */

function getPlayerWPM() {

    if (!startTime) {
        return 0;
    }


    const minutes =
        (Date.now() - startTime)
        / 60000;


    if (minutes <= 0) {
        return 0;
    }


    return Math.round(
        (correctTyped / 5)
        / minutes
    );

}


/* =====================================================
   ACCURACY
===================================================== */

function getPlayerAccuracy() {

    if (totalTyped === 0) {
        return 100;
    }


    return Math.round(
        (correctTyped /
            totalTyped) *
        100
    );

}


/* =====================================================
   STATS
===================================================== */

function updateStats() {

    const wpm =
        getPlayerWPM();


    const accuracy =
        getPlayerAccuracy();


    const progress =
        Math.round(
            (
                currentIndex /
                currentText.length
            ) * 100
        );


    wpmDisplay.textContent =
        wpm;


    accuracyDisplay.textContent =
        `${accuracy}%`;


    progressDisplay.textContent =
        `${progress}%`;


    charactersDisplay.textContent =
        `${currentIndex} / ${currentText.length}`;


    errorsDisplay.textContent =
        errors;

}


/* =====================================================
   AI ENGINE
===================================================== */


/*
    Convert WPM into milliseconds per character.

    1 word = roughly 5 characters.

    Example:

    40 WPM
    = 200 characters/minute
    = 3.33 characters/second
*/

function characterDelay(wpm) {

    const charactersPerSecond =
        (wpm * 5) / 60;


    return (
        1000 /
        charactersPerSecond
    );

}


/* =====================================================
   START AI
===================================================== */

function startAI() {

    aiRacers.forEach(ai => {

        ai.nextType =
            Date.now() +
            ai.reaction;

    });


    aiLoop();

}


/* =====================================================
   AI LOOP
===================================================== */

function aiLoop() {

    if (
        raceFinished ||
        !raceStarted
    ) {

        return;

    }


    const now =
        Date.now();


    aiRacers.forEach(ai => {

        if (ai.finished) {
            return;
        }


        if (
            now <
            ai.nextType
        ) {

            return;

        }


        simulateAICharacter(ai);


        const baseDelay =
            characterDelay(
                ai.wpm
            );


        /*
            Humans don't type at exactly
            the same interval forever.

            Add random variation.
        */

        const variation =
            random(
                1 - ai.consistency,
                1 + ai.consistency
            );


        ai.nextType =
            now +
            baseDelay *
            variation;

    });


    aiTimer =
        requestAnimationFrame(
            aiLoop
        );

}


/* =====================================================
   SIMULATE CHARACTER
===================================================== */

function simulateAICharacter(ai) {

    if (
        ai.typed >=
        currentText.length
    ) {

        ai.finished = true;

        return;

    }


    ai.typed++;


    const accuracyRoll =
        Math.random() * 100;


    if (
        accuracyRoll <=
        ai.accuracy
    ) {

        ai.correct++;

    }

    else {

        ai.errors++;

    }


    ai.progress =
        ai.correct /
        currentText.length;


    moveAI(ai);


    if (
        ai.correct >=
        currentText.length
    ) {

        ai.finished = true;

        checkAIWin(ai);

    }

}


/* =====================================================
   AI MOVEMENT
===================================================== */

function moveAI(ai) {

    const width =
        space.clientWidth;


    const shipWidth = 76;

    const max =
        width -
        shipWidth -
        35;


    const position =
        20 +
        (max - 20) *
        ai.progress;


    ai.element.style.left =
        `${position}px`;

}


/* =====================================================
   AI WIN CHECK
===================================================== */

function checkAIWin(ai) {

    if (raceFinished) {
        return;
    }


    finishRace(false);

}


/* =====================================================
   FINISH RACE
===================================================== */

function finishRace(playerWon) {

    if (raceFinished) {
        return;
    }


    raceFinished = true;

    raceStarted = false;


    clearInterval(
        raceTimer
    );


    cancelAnimationFrame(
        aiTimer
    );


    typingInput.disabled =
        true;


    const playerProgress =
        currentIndex /
        currentText.length;


    /*
        Freeze everyone and calculate
        the final ranking.
    */

    const racers = [];


    racers.push({

        name: "YOU",

        wpm:
            getPlayerWPM(),

        progress:
            playerProgress,

        player: true

    });


    aiRacers.forEach(ai => {

        racers.push({

            name: ai.name,

            wpm: ai.wpm,

            progress: ai.progress,

            player: false

        });

    });


    racers.sort(
        (a, b) =>
            b.progress -
            a.progress
    );


    showResults(
        racers,
        playerWon
    );

}


/* =====================================================
   RESULTS
===================================================== */

function showResults(
    racers,
    playerWon
) {

    const playerPosition =
        racers.findIndex(
            racer =>
                racer.player
        ) + 1;


    if (playerWon) {

        resultTitle.textContent =
            "VICTORY";

        resultIcon.textContent =
            "★";

    }

    else {

        resultTitle.textContent =
            `POSITION ${playerPosition}`;

        resultIcon.textContent =
            "✦";

    }


    leaderboard.innerHTML = "";


    racers.forEach(
        (racer, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "result-row";


            if (racer.player) {

                row.classList.add(
                    "player"
                );

            }


            row.innerHTML = `

                <div class="result-position">
                    ${index + 1}
                </div>

                <div class="result-name">
                    ${racer.name}
                </div>

                <div class="result-wpm">
                    ${racer.player
                        ? racer.wpm
                        : racer.wpm} WPM
                </div>

            `;


            leaderboard.appendChild(
                row
            );

        }
    );


    const wpm =
        getPlayerWPM();


    const accuracy =
        getPlayerAccuracy();


    const sector =
        sectors[selectedSector];


    let reward = 0;


    if (playerPosition === 1) {

        reward =
            sector.reward;

    }

    else if (
        playerPosition === 2
    ) {

        reward =
            Math.round(
                sector.reward * 0.65
            );

    }

    else if (
        playerPosition === 3
    ) {

        reward =
            Math.round(
                sector.reward * 0.4
            );

    }


    finalWpm.textContent =
        wpm;


    finalAccuracy.textContent =
        `${accuracy}%`;


    finalReward.textContent =
        `${reward} CR`;


    resultsScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
   BUTTONS
===================================================== */

againButton.addEventListener(
    "click",
    () => {

        resultsScreen.classList.add(
            "hidden"
        );

        startRace();

    }
);


mapButton.addEventListener(
    "click",
    () => {

        resultsScreen.classList.add(
            "hidden"
        );

        raceScreen.classList.add(
            "hidden"
        );

        headerStats.classList.add(
            "hidden"
        );

        galaxyScreen.classList.remove(
            "hidden"
        );

    }
);


/* =====================================================
   CLICK TO FOCUS
===================================================== */

document.addEventListener(
    "click",
    () => {

        if (
            raceStarted &&
            !raceFinished &&
            !typingInput.disabled
        ) {

            typingInput.focus();

        }

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

updateSectorInfo();
