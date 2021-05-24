//create global variables //
const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");
//create global variable with the value of magnolia
let word = "magnolia";
let guessedLetters = [];
//create a global variable with value of 8//
let remainingGuesses = 8;

///create a variable
const getWord = async function () {
  const response = await fetch(
    "https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt"
  );
  const words = await response.text();
  const wordArray = words.split("\n");
  const randomIndex = Math.floor(Math.random() * wordArray.length),
    word = wordArray[randomIndex].trim();
  placeholder(word);
};
// Fire off the game
getWord();

// Create a function to display symbols as placeholders for the chosen word's letters
const placeholder = function (word) {
  const placeholderLetters = [];
  for (const letter of word) {
    //console.log(letter);
    placeholderLetters.push("●");
  }
  wordInProgress.innerText = placeholderLetters.join("");
};
//placeholder(word);

//add click event
guessLetterButton.addEventListener("click", function (e) {
  ///to prevent the page from reloading after submitting the letter add:
  e.preventDefault();
  //empty message paragraph
  message.innerText = "";
  //create a name and variable to capture the value of the input
  const guess = letterInput.value;
  //log out the value of the variable capturing the input
  //console.log(guess);
  // Let's make sure that it is a single letter
  const goodGuess = validateInput(guess);
  if (goodGuess) {
    // We've got a letter! Let's guess!
    makeGuess(guess);
  }
  //empty the value of the input
  letterInput.value = "";
});

//create a function that accepts input as the value
const validateInput = function (input) {
  //create a variable for accepted letter sequence in a regular expression
  const acceptedLetter = /[a-zA-Z]/;
  if (input.length === 0) {
    // Is the input empty?
    message.innerText = "Please enter a letter.";
  } else if (input.length > 1) {
    // Did you type more than one letter?
    message.innerText = "Please enter a single letter.";
  } else if (!input.match(acceptedLetter)) {
    // Did you type a number, a special character or some other non letter thing?
    message.innerText = "Please enter a letter from A to Z.";
  } else {
    // We finally got a single letter
    return input;
  }
};

const makeGuess = function (guess) {
  guess = guess.toUpperCase();
  if (guessedLetters.includes(guess)) {
    message.innerText = "You already guessed that letter. Try again.";
  } else {
    guessedLetters.push(guess);
    console.log(guessedLetters);
    updateGuessesRemaining(guess);
    showGuessedLetters();
    ///call the function so the letter displays when it hasn't been guessed before
    updateWordInProgress(guessedLetters);
  }
};

//create a function to update the page with letters guessed
const showGuessedLetters = function () {
  //clear the list first
  guessedLettersElement.innerHTML = "";
  //create a new list item for each letter and add it to the unordered list
  for (const letter of guessedLetters) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLettersElement.append(li);
  }
};

//create a function to update the word in progress, with guessed letters as parameters
//this will replace the circle symbols
const updateWordInProgress = function (guessedLetters) {
  //create a variable wordUpper to change the word variable to uppercase
  const wordUpper = word.toUpperCase();
  //create a variable to split the word string into an array
  const wordArray = wordUpper.split("");
  const revealWord = [];
  for (const letter of wordArray) {
    if (guessedLetters.includes(letter)) {
      revealWord.push(letter.toUpperCase());
    } else {
      revealWord.push("●");
    }
  }
  //Log out revealWord
  //  console.log("revealWord")
  wordInProgress.innerText = revealWord.join("");
  checkIfWin();
};

//create a new function that accepts guess input as a parameter
const updateGuessesRemaining = function (guess) {
  //in the function grab the word and make it uppercase
  const upperWord = word.toUpperCase();
  //find out if the word contains the guessedLetter, if doesnt subtract 1 from remaining guesses
  if (!upperWord.includes(guess)) {
    // bad guess, lose a chance
    message.innerText = `Sorry, the word has no ${guess}.`;
    remainingGuesses -= 1;
  } else {
    message.innerText = `Good guess! The word has the letter ${guess}.`;
  }
  if (remainingGuesses === 0) {
    message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
  } else if (remainingGuesses === 1) {
    remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
  } else {
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  }
};

//create a function to check if player won//
const checkIfWin = function () {
  if (word.toUpperCase() === wordInProgress.innerText) {
    message.classList.add("win");
    message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
    startOver();
  }
};

//create a function called startOver to hide the guess button, the paragraph where the remaining
//guesses will display, and the unordered list where the guesses letters appear
const startOver = function () {
  guessLetterButton.classList.add("hide");
  remainingGuessesElement.classList.add("hide");
  guessedLettersElement.classList.add("hide");
  playAgainButton.classList.remove("hide");
};
//add eventListener to the playAgainButton and give the class of win applied to the
//msg element. Empty the msg text and the unordered list where the guesses appear
playAgainButton.addEventListener("click", function () {
  // reset all original values - grab new word
  message.classList.remove("win");
  guessedLetters = [];
  remainingGuesses = 8;
  remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  guessedLettersElement.innerHTML = "";
  message.innerText = "";
  // Grab a new word
  getWord();
  // show the right UI elements
  guessLetterButton.classList.remove("hide");
  playAgainButton.classList.add("hide");
  remainingGuessesElement.classList.remove("hide");
  guessedLettersElement.classList.remove("hide");
});
