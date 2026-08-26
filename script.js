/* ==========================================
   STARSPRINT
   Typing Space Racing Game
========================================== */


/* ==========================================
   DOM
========================================== */

const startScreen = document.getElementById("startScreen");
const finishScreen = document.getElementById("finishScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const typingInput = document.getElementById("typingInput");
const textDisplay = document.getElementById("textDisplay");

const playerShip = document.getElementById("playerShip");
const enemyShip = document.getElementById("enemyShip");

const countdown = document.getElementById("countdown");

const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const progressDisplay = document.getElementById("progress");

const charactersDisplay = document.getElementById("characters");
const errorsDisplay = document.getElementById("errors");

const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalTime = document.getElementById("finalTime");

const finishTitle = document.getElementById("finishTitle");


/* ==========================================
   TEXT
========================================== */

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


/* ==========================================
   GAME VARIABLES
========================================== */

let currentText = "";

let currentIndex = 0;

let errors = 0;

let totalTyped = 0;

let correctTyped = 0;

let raceStarted = false;

let raceFinished = false;

let startTime = 0;

let timerInterval = null;

let enemyProgress = 0;

let playerProgress = 0;

let enemySpeed = 0;


/* ==========================================
   RANDOM TEXT
========================================== */

function getRandomText() {

    const index = Math.floor(
        Math.random() * passages.length
    );

    return passages[index];

}


/* ==========================================
   PREPARE TEXT
========================================== */

function prepareText() {

    currentText = getRandomText();

    currentIndex = 0;

    errors = 0;

    totalTyped = 0;

    correctTyped = 0;

    textDisplay.innerHTML = "";

    for (let i = 0; i < currentText.length; i++) {

        const span = document.createElement("span");

        span.textContent = currentText[i];

        if (i === 0) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);

    }

    updateStats();

}


/* ==========================================
   START RACE
========================================== */

function startRace() {

    startScreen.classList.add("hidden");

    finishScreen.classList.add("hidden");

    typingInput.value = "";

    prepareText();

    playerProgress = 0;

    enemyProgress = 0;

    enemyShip.style.left = "20px";

    playerShip.style.left = "20px";

    raceStarted = false;

    raceFinished = false;

    countdown.textContent = "3";

    let count = 3;

    const countdownTimer = setInterval(() => {

        count--;

        if (count > 0) {

            countdown.textContent = count;

        } else if (count === 0) {

            countdown.textContent = "GO!";

            raceStarted = true;

            startTime = Date.now();

            typingInput.disabled = false;

            typingInput.focus();

            startTimer();

            startEnemy();

        } else {

            clearInterval(countdownTimer);

            countdown.textContent = "";

        }

    }, 1000);

}


/* ==========================================
   TIMER
========================================== */

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        if (!raceStarted || raceFinished) {
            return;
        }

        updateStats();

    }, 200);

}


/* ==========================================
   TYPING
========================================== */

typingInput.addEventListener("input", function () {

    if (!raceStarted || raceFinished) {
        return;
    }

    const value = typingInput.value;

    if (value.length === 0) {
        return;
    }

    const typedCharacter = value[value.length - 1];

    const expectedCharacter = currentText[currentIndex];

    totalTyped++;

    if (typedCharacter === expectedCharacter) {

        correctTyped++;

        currentIndex++;

        updateTextDisplay();

        typingInput.value = "";

        movePlayer();

        updateStats();

        if (currentIndex >= currentText.length) {

            finishRace(true);

        }

    } else {

        errors++;

        typingInput.value = "";

        updateTextDisplay();

        updateStats();

        typingInput.classList.add("error");

        setTimeout(() => {

            typingInput.classList.remove("error");

        }, 150);

    }

});


/* ==========================================
   DISPLAY TEXT
========================================== */

function updateTextDisplay() {

    const letters = textDisplay.children;

    for (let i = 0; i < letters.length; i++) {

        letters[i].classList.remove(
            "correct",
            "current",
            "wrong"
        );

        if (i < currentIndex) {

            letters[i].classList.add("correct");

        } else if (i === currentIndex) {

            letters[i].classList.add("current");

        }

    }

}


/* ==========================================
   PLAYER MOVEMENT
========================================== */

function movePlayer() {

    const spaceWidth =
        document.getElementById("space").clientWidth;

    const shipWidth = 80;

    const maxPosition =
        spaceWidth - shipWidth - 40;

    playerProgress =
        currentIndex / currentText.length;

    const position =
        20 + (maxPosition - 20) * playerProgress;

    playerShip.style.left =
        `${position}px`;

}


/* ==========================================
   ENEMY
========================================== */

function startEnemy() {

    enemyProgress = 0;

    /*
        Enemy speed is randomized slightly
        every race.
    */

    enemySpeed =
        0.0015 +
        Math.random() * 0.0007;

    requestAnimationFrame(enemyLoop);

}


function enemyLoop() {

    if (!raceStarted || raceFinished) {
        return;
    }

    enemyProgress += enemySpeed;

    if (enemyProgress >= 1) {

        enemyProgress = 1;

        finishRace(false);

        return;

    }

    moveEnemy();

    requestAnimationFrame(enemyLoop);

}


function moveEnemy() {

    const spaceWidth =
        document.getElementById("space").clientWidth;

    const shipWidth = 80;

    const maxPosition =
        spaceWidth - shipWidth - 40;

    const position =
        20 + (maxPosition - 20) * enemyProgress;

    enemyShip.style.left =
        `${position}px`;

}


/* ==========================================
   STATISTICS
========================================== */

function calculateWPM() {

    if (!startTime) {
        return 0;
    }

    const elapsedMinutes =
        (Date.now() - startTime) / 60000;

    if (elapsedMinutes <= 0) {
        return 0;
    }

    return Math.round(
        (correctTyped / 5) /
        elapsedMinutes
    );

}


function calculateAccuracy() {

    if (totalTyped === 0) {
        return 100;
    }

    return Math.round(
        (correctTyped / totalTyped) * 100
    );

}


function updateStats() {

    const wpm = calculateWPM();

    const accuracy = calculateAccuracy();

    const progress =
        Math.round(
            (currentIndex / currentText.length) * 100
        );

    wpmDisplay.textContent = wpm;

    accuracyDisplay.textContent =
        `${accuracy}%`;

    progressDisplay.textContent =
        `${progress}%`;

    charactersDisplay.textContent =
        `${currentIndex} / ${currentText.length}`;

    errorsDisplay.textContent =
        errors;

}


/* ==========================================
   FINISH
========================================== */

function finishRace(playerWon) {

    if (raceFinished) {
        return;
    }

    raceFinished = true;

    raceStarted = false;

    clearInterval(timerInterval);

    typingInput.disabled = true;

    const elapsedSeconds =
        Math.round(
            (Date.now() - startTime) / 1000
        );

    const wpm = calculateWPM();

    const accuracy = calculateAccuracy();

    if (playerWon) {

        finishTitle.textContent =
            "RACE COMPLETE";

    } else {

        finishTitle.textContent =
            "YOU LOST";

    }

    finalWpm.textContent =
        wpm;

    finalAccuracy.textContent =
        `${accuracy}%`;

    finalTime.textContent =
        `${elapsedSeconds}s`;

    finishScreen.classList.remove("hidden");

}


/* ==========================================
   BUTTONS
========================================== */

startButton.addEventListener(
    "click",
    startRace
);

restartButton.addEventListener(
    "click",
    startRace
);


/* ==========================================
   CLICK TYPING AREA
========================================== */

document.addEventListener("click", () => {

    if (
        raceStarted &&
        !raceFinished &&
        !typingInput.disabled
    ) {

        typingInput.focus();

    }

});


/* ==========================================
   INITIALIZE
========================================== */

prepareText();

wpmDisplay.textContent = "0";

accuracyDisplay.textContent = "100%";

progressDisplay.textContent = "0%";

charactersDisplay.textContent = "0 / 0";

errorsDisplay.textContent = "0";
