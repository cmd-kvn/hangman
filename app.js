'use strict';

// Global variables
var playerAnswerArr = []; // blank spaces puzzle
var incorrectGuesses = 0;
var maxEasyGuesses = 5; // will correspond with number of easy difficulty body parts
var easyWords = ['four', 'phone', 'mouse', 'bottle', 'notebook']; // subject to change
var gameWord; // word chosen from word array
var remainingLetters; // remaining letters left to guess in the gameWord
var wonGame = false; // used in checkForWin/Loss and updatePlayerStats
var letterButton = document.getElementById('letter_buttons');
letterButton.addEventListener('click', handleClick); // listens for a button click
var display = document.getElementById('display_player_array');
var playAgainButton = document.getElementById('play_again_btn');
playAgainButton.addEventListener('click', handlePlayAgain);
var endMessage = document.getElementById('end_of_game_msg');
//JSON VARIABLES
var localStorageNameArr = localStorage.getItem('allPlayerNames');
var localStorageObjArr  = localStorage.getItem('players');
var parsedLclStrgNameArr = JSON.parse(localStorageNameArr);   // get the name array from local storage and parse from JSON to js
var parsedlclStrgObjArr  = JSON.parse(localStorageObjArr);   // get the player object array from local storage and parse from JSON to js

retrieveLocal();
var currentPlayer = parsedlclStrgObjArr[0];
var numberWon = 0;
findCurrentPlayer();
renderPlayerStatsRow(currentPlayer);

// - generate a hanging man
// _______ADDRESS______________________

// FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS // FUNCTIONS //
//retrieve local storage
function retrieveLocal() {
  if (localStorageNameArr) {
    parsedLclStrgNameArr = JSON.parse(localStorageNameArr);
    parsedlclStrgObjArr = JSON.parse(localStorageObjArr);
  }
};

// find current player
function findCurrentPlayer() {
  var playerToCheck = parsedLclStrgNameArr.pop(); // pop off the last element (the current logged in user) and store it on a variable
  for (var i = 0; i < parsedlclStrgObjArr.length; i++) {  // compare the playerToCheck to the player names in the object array
    if (playerToCheck === parsedlclStrgObjArr[i].playerName) {// if there's a name match, update other object properties
      currentPlayer = parsedlclStrgObjArr[i];
    }
  }
};

// handles the event when 'play again' button is clicked
function handlePlayAgain(event) {
  // reloads the page and starts it at the top
  window.location.reload();
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

// handles the event of a letter button click
function handleClick(event) {
  event.preventDefault(); // prevent page refresh

  // determine if the event.target.value is in the gameWord array
  if (gameWord.includes(event.target.value) === true) {
    // loop through the gameWord to match target value (letter) with any same letter in the gameword
    for (var i = 0; i < gameWord.length; i++) {
      if (event.target.value === gameWord[i]) {

        playerAnswerArr[i] = gameWord[i]; // replace the blank index with the matching letter

        displayPlayerArray(playerAnswerArr); // update the display for the player
        remainingLetters--;
        // disable the button to prevent the player from selecting it again
        event.target.disabled = true;
        checkForWin();
      }
    }
  } else if (gameWord.includes(event.target.value) === false) {
    // if user selects a invalid letter, nothing changes in the playerAnswerArr
    displayPlayerArray(playerAnswerArr);

    //       - one body part gets added to the hangman

    incorrectGuesses += 1; // incorrectGuesses increases by 1
    // disable the button to prevent the player from selecting it again
    event.target.disabled = true;
    checkForLoss();
  }
}

function checkForWin() {
  if (remainingLetters === 0) { // if the player has guessed all the letters
    wonGame = true;
    // disable the buttons, display the solved gameWord, inform the player that they won, and updatePlayerStats
    letterButton.removeEventListener('click', handleClick);
    displayPlayerArray(playerAnswerArr);
    endMessage.textContent = 'Congrats! You won and saved the hangman!';
    updatePlayerStats();
    //   - refresh page?
  }
}

function checkForLoss() {
  if (remainingLetters > 0 && incorrectGuesses === maxEasyGuesses) {
    wonGame = false;
    //   - hangman will have all parts
    //   - display correct letters in the puzzle as the answer

    // disable the buttons, inform the player that they lost, and updatePlayerStats
    letterButton.removeEventListener('click', handleClick);
    endMessage.textContent = 'You failed to guess \'' + gameWord + '.\' A man has been hanged today. You lose.';
    updatePlayerStats();
    //   - refresh page?
  }
}

function updatePlayerStats() {
  currentPlayer.gamesPlayed ++;
  if (wonGame === true) {
    currentPlayer.totalPoints += 23; ////////THIS WILL PROBABLY CHANGE///////////////
    currentPlayer.gamesWon ++;
  }
  calculatePercentage(currentPlayer);
  numberWon = currentPlayer.percentWon;
  currentPlayer.percentDisplay = numberWon + '%';
  clearRow();
  renderPlayerStatsRow(currentPlayer);
  // stringify the updated array and set it back to local storage
  storeLocal();
};

function calucatePecentage(currentPlayer) {
  numberWon = Math.round((currentPlayer.gamesWon / currentPlayer.gamesPlayed) * 100);
};

function storeLocal() {
  var playersJSON = JSON.stringify(parsedlclStrgObjArr);
  localStorage.setItem('players', playersJSON);
};

// pass in a word array to select a random word from it to assign to gameWord
function pickWord (wordArr) {
  gameWord = wordArr[generateRandomNumber(wordArr)];
  return gameWord;

  function generateRandomNumber(arr) {
    return Math.floor(Math.random() * arr.length);
  }
}

// initiate the playerAnswerArr to '_' characters, the length of the gameWord
function generatePlayerAnswerArray (gameWord) {
  for (var i = 0; i < gameWord.length; i++) {
    playerAnswerArr.push('_');
  };
}

// display the playerAnswerArr in html
function displayPlayerArray(playerAnswerArr) {
  display.textContent = playerAnswerArr.join(' ');
}

function runGame(){
  playerAnswerArr = [];
  // letterButton.addEventListener('click', handleClick); // listens for a button click
  // letterButton.disabled = false;
  // assign the gameWord
  gameWord = pickWord(easyWords);
  // set the remainingLetters left to guess
  remainingLetters = gameWord.length;
  // generate a playerAnswerArr blank puzzle that is the length of the gameWord and display it
  generatePlayerAnswerArray(gameWord);
  displayPlayerArray(playerAnswerArr);
}

//*****EXECUTE CODE*******************EXECUTE CODE**********************
runGame();




function renderPlayerStatsRow(currentPlayer) {

  var playerStatsTable = document.getElementById('stats_table_body');
  var playerTableRow = document.createElement('tr');
  var rankingPlayer = document.createElement('td');
  var playerNamePlayer = document.createElement('td');
  var gamesPlayedPlayer = document.createElement('td');
  var gamesWonPlayer = document.createElement('td');
  var percentageWonPlayer = document.createElement('td');
  var totalPointsPlayer = document.createElement('td');

  playerTableRow.appendChild(rankingPlayer);

  playerNamePlayer.textContent = currentPlayer.playerName;
  playerTableRow.appendChild(playerNamePlayer);

  gamesPlayedPlayer.textContent = currentPlayer.gamesPlayed;
  playerTableRow.appendChild(gamesPlayedPlayer);

  gamesWonPlayer.textContent = currentPlayer.gamesWon;
  playerTableRow.appendChild(gamesWonPlayer);

  percentageWonPlayer.textContent = currentPlayer.percentDisplay;
  playerTableRow.appendChild(percentageWonPlayer);

  totalPointsPlayer.textContent = currentPlayer.totalPoints;
  playerTableRow.appendChild(totalPointsPlayer);

  if (currentPlayer.ranking <= 5) {
    rankingPlayer.textContent = currentPlayer.ranking;
  } else {
    rankingPlayer.textContent = 'Not Ranked';
  }
  playerStatsTable.appendChild(playerTableRow);
};

function clearRow() {
  var playerStatsTable = document.getElementById('stats_table_body');
  playerStatsTable.textContent = '';
}

// function clearTable(){
//   var playerStatsTable = document.getElementById('stats_table_body');
//   playerStatsTable.textContent = '';
// };
