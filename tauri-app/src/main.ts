import { invoke } from "@tauri-apps/api/core";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;
let chosen: boolean = false;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

let shuffleNum: number = 0;
let intervalId: number;

async function shufflePic(): Promise<void> {
  return new Promise((resolve) => {
    let questionMark = document.getElementById("question-mark") as HTMLImageElement;
    if (shuffleNum !== 6) {
      if (shuffleNum % 3 === 0) {
        if (questionMark) questionMark.src = "/src/assets/rock.PNG";
      } else if (shuffleNum % 3 === 1) {
        if (questionMark) questionMark.src = "/src/assets/paper.PNG";
      } else {
        if (questionMark) questionMark.src = "/src/assets/scissors.PNG";
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
  let questionMark = document.getElementById("question-mark") as HTMLImageElement;
  intervalId = setInterval(shufflePic, 400);
  await new Promise(resolve => setTimeout(resolve, 2400)); // Wait for 6 shuffles (6 * 400ms)
  // Convert string choice to number
  questionMark.classList.add('chosen');
  switch (randomChoice) {
    case "rock":
      if (questionMark) questionMark.src = "/src/assets/rock.png";
      console.log(questionMark.src);
      return 0;
    case "paper": 
      if (questionMark) questionMark.src = "/src/assets/paper.png";
      console.log(questionMark.src);
      return 1;
    case "scissors": 
      if (questionMark) questionMark.src = "/src/assets/scissors.png";
      console.log(questionMark.src);
      return 2;
    default: 
      return 3;
  }
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
  } else if (result === 1) {
    // Win
  } else {
    // Loss
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

  playAgain?.addEventListener("click", () => {
    let previoslyChosen = document.querySelectorAll(".chosen");
    let nonPreviouslyChosen = document.querySelectorAll(".not-chosen");
    previoslyChosen.forEach(element => {
      element.classList.remove("chosen");
    });
    nonPreviouslyChosen.forEach(element => {
      element.classList.remove("not-chosen");
    });
    chosen = false;
    shuffleNum = 0;
  });
});
