# ✦ StarSprint

A browser-based space racing game where your typing speed controls your spacecraft.

Type faster. Fly farther. Reach the finish line first. 🚀

## 🌌 About

StarSprint is a typing-racing game inspired by the idea of turning typing into a race, but with a space exploration theme.

Instead of racing cars, you pilot spacecraft through different sectors of the galaxy. Your typing speed determines how quickly your ship travels.

The game also features AI pilots that simulate different typing abilities, including different WPM, accuracy, reaction time, and consistency.

## 🎮 Features

- 🚀 Typing-powered spacecraft racing
- 🤖 Simulated AI opponents
- 🧠 AI with individual typing statistics
- ⌨️ Live WPM tracking
- 🎯 Accuracy tracking
- 📊 Race progress tracking
- 🌌 Galaxy sector selection
- 🛸 Multiple spacecraft and pilots
- 🏆 Race leaderboard
- 💰 Credits and race rewards
- 🌠 Space-themed environments
- 📱 Basic responsive support

## 🤖 AI System

The AI opponents aren't simply moving across the screen at a fixed speed.

Each AI has its own:

- WPM
- Accuracy
- Reaction time
- Typing consistency
- Character progress
- Mistake rate

The game converts an AI's WPM into an approximate character typing speed and then simulates individual keystrokes.

This means AI performance naturally varies during a race.

### Current Pilots

| Pilot | Ship | Skill |
|---|---|---|
| NOVA | Scout | Cadet |
| KESTREL | Interceptor | Pilot |
| VEX | Explorer | Pilot |
| ORBIT | Ranger | Ace |

## 🌌 Sectors

The current game contains several planned race sectors.

| Sector | Difficulty | Status |
|---|---|---|
| Orion Gate | Beginner | Available |
| Asteroid Run | Intermediate | Available |
| Giant's Ring | Advanced | Locked |
| Void Edge | Extreme | Locked |

Different sectors change the expected AI typing speeds and rewards.

## ⌨️ How To Play

1. Select a sector.
2. Click **Launch Race**.
3. Wait for the countdown.
4. Type the displayed sentence.
5. Your spacecraft moves as you type.
6. Reach the end of the passage before the other pilots.
7. Earn credits based on your finishing position.

## 📈 Statistics

### WPM

Words per minute, calculated from the number of correctly typed characters.

### Accuracy

The percentage of typed characters that were correct.

### Progress

How far through the current typing passage you are.

## 🛠️ Technology

StarSprint currently uses:

- HTML
- CSS
- JavaScript

There are no external libraries or frameworks required.

## 📁 Project Structure

```text
StarSprint/
│
├── index.html
├── style.css
├── script.js
└── README.md
