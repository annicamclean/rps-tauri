import { invoke } from "@tauri-apps/api/core";

// Theme switching functionality
const themeSwitch = document.getElementById('theme-switch') as HTMLButtonElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark: boolean) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeSwitch.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme === 'dark');
} else {
  setTheme(prefersDark.matches);
}

themeSwitch.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

// Listen for system theme changes
prefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches);
  }
});

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;
let chosen: boolean = false;
let shuffleNum: number = 0;
let intervalId: number;
let wins: number = 0;
let losses: number = 0;
let ties: number = 0;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

async function shufflePic(): Promise<void> {
  return new Promise((resolve) => {
    let computerOptions = document.getElementById("computer-options") as HTMLDivElement;
    let icon = computerOptions.querySelector("i") as HTMLElement;
    let words = computerOptions.querySelector("p") as HTMLElement;
    if (shuffleNum !== 6) {
      if (shuffleNum % 3 === 0) {
        if (icon && words) {
          icon.className = "fa fa-hand-grab-o";
          words.textContent = "ROCK";
        }
      } else if (shuffleNum % 3 === 1) {
        if (icon && words) {
          icon.className = "fa fa-hand-paper-o";
          words.textContent = "PAPER";
        }
      } else {
        if (icon && words) {
          icon.className = "fa fa-hand-scissors-o";
          words.textContent = "SCISSORS";
        }
      }
      shuffleNum++;
    } else {
      clearInterval(intervalId);
      resolve();
    }
  });
}

async function computerChoice() {
  const choices = ["rock", "paper", "scissors"];
  let randomChoice = choices[Math.floor(Math.random() * 3)];
  let computerOptions = document.getElementById("computer-options") as HTMLDivElement;
  computerOptions.classList.add("not-chosen");
  let icon = computerOptions.querySelector("i") as HTMLElement;
  let words = computerOptions.querySelector("p") as HTMLElement;
  
  intervalId = setInterval(shufflePic, 400);
  await new Promise(resolve => setTimeout(resolve, 2400)); // Wait for 6 shuffles (6 * 400ms)
  
  computerOptions.classList.remove("not-chosen");
  computerOptions.classList.add('chosen');
  
  switch (randomChoice) {
    case "rock":
      if (icon && words) {
        icon.className = "fa fa-hand-grab-o";
        words.textContent = "ROCK";
      }
      return 0;
    case "paper": 
      if (icon && words) {
        icon.className = "fa fa-hand-paper-o";
        words.textContent = "PAPER";
      }
      return 1;
    case "scissors": 
      if (icon && words) {
        icon.className = "fa fa-hand-scissors-o";
        words.textContent = "SCISSORS";
      }
      return 2;
    default: 
      return 3;
  }
}

function updateScore() {
  let winText = document.getElementById("wins") as HTMLElement;
  let lossText = document.getElementById("losses") as HTMLElement;
  let tieText = document.getElementById("ties") as HTMLElement;

  winText.textContent = `WINS: ${wins}`;
  lossText.textContent = `LOSSES: ${losses}`;
  tieText.textContent = `TIES: ${ties}`;
}

async function playGame(weapon: number) {
  let computerWeapon = await computerChoice();
  console.log("Computer Choice: ", computerWeapon);
  let result = await invoke("play_game", {
    weapon: weapon,
    computerWeapon: computerWeapon,
  });
  if (result === 0) {
    // Tie
    ties++;
    updateScore();
  } else if (result === 1) {
    // Win
    wins++;
    updateScore();
  } else {
    // Loss
    losses++;
    updateScore();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });

  const rock = document.querySelector("#rock");
  const paper = document.querySelector("#paper");
  const scissors = document.querySelector("#scissors");

  rock?.addEventListener("click", () => {
    if (!chosen) {
      rock.classList.add("chosen");
      paper?.classList.add("not-chosen");
      scissors?.classList.add("not-chosen");
      chosen = true;
      playGame(0);
    }
  });

  paper?.addEventListener("click", () => {
    if (!chosen) {
      paper.classList.add("chosen");
      rock?.classList.add("not-chosen");
      scissors?.classList.add("not-chosen");
      chosen = true;
      playGame(1);
    }
  });

  scissors?.addEventListener("click", () => {
    if (!chosen) {
      scissors.classList.add("chosen");
      rock?.classList.add("not-chosen");
      paper?.classList.add("not-chosen");
      chosen = true;
      playGame(2);
    }
  });
  

  let playAgain = document.getElementById("play-again");
  let resetScore = document.getElementById("reset-score");

  playAgain?.addEventListener("click", () => {
    let previoslyChosen = document.querySelectorAll(".chosen");
    let nonPreviouslyChosen = document.querySelectorAll(".not-chosen");
    let computerOptions = document.getElementById("computer-options") as HTMLDivElement;

    let icon = computerOptions.querySelector("i") as HTMLElement;
    let words = computerOptions.querySelector("p") as HTMLElement;

    icon.className = "fa fa-question";
    words.textContent = "";

    previoslyChosen.forEach(element => {
      element.classList.remove("chosen");
    });
    nonPreviouslyChosen.forEach(element => {
      element.classList.remove("not-chosen");
    });
    chosen = false;
    shuffleNum = 0;
  });

  resetScore?.addEventListener("click", () => {
    wins = 0;
    losses = 0;
    ties = 0;
    updateScore();
  });
});
