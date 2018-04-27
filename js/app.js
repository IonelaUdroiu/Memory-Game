/*
 * Create a list that holds all of your cards
 */
const deck = document.getElementById("cards-deck");
let card = document.getElementsByClassName("card");
let cards = [...card];
/*
 * Declare the variables
 */
//variables for open and matched cards
let openedCards = [];
let matchedCard = document.getElementsByClassName("match");
let matchedCards = 0;
// variables for star icons
const stars = document.querySelectorAll(".fa-star");
//variables for moves
let countMoves = 0;
let moves = document.getElementsByClassName("moves");
let movesNumber = document.getElementById("moves-number");
//variables for timer
let second, minute;
let timer = document.querySelector(".timer");
let interval;
//variable for modal
let modal = document.getElementById("modal");
let heading = document.getElementById("modal-content").childNodes[1];
let closeicon = document.querySelector(".close");
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
//refresh all game data at page load
document.body.onload = startGame();
//start the game
function startGame() {
	//shuffle the cards
	cards = shuffle(cards);
	for (let i = 0; i < cards.length; i++) {
		deck.innerHTML = "";
		[].forEach.call(cards, function(item) {
			deck.appendChild(item);
		});
		//remove action classes
		cards[i].classList.remove("open", "show", "match", "disable");
		//add click events on a card
		cards[i].addEventListener("click", displayCard);
		cards[i].addEventListener("click", openCard);
	};
	//reset moves
	countMoves = 0;
	movesNumber.innerHTML = countMoves;
	//reset star rating
	for (let i = 0; i < stars.length; i++) {
		stars[i].className = 'fa fa-star';
	}
	//reset timer
	second = 0;
	minute = 0;
	timer.innerHTML = "0 mins 0 secs";
	clearInterval(interval);
}
//add new class names to flipped cards
function displayCard() {
	this.classList.add("open", "show", "disable");
}
//if two cards match add "match" class name
function matched(openCard) {
	openCard.classList.add("match");
}
//if two cards don't match add "unmatch" class name
function unmatched(openCard) {
	openCard.classList.add("unmatch");
	//remove new classes from unmatched cards
	setTimeout(function() {
		openCard.classList.remove("open", "show", "disable", "unmatch");
	}, 1000);
}
//check if two flipped cards match (function from https://patibugaj.github.io/fend-project-memory-game/)
function openCard() {
	openedCards.push(this);
	let len = openedCards.length;
	if (len === 2) {
		moveCounter();
		if (openedCards[0].className == openedCards[1].className) {
			openedCards.forEach(matched);
			openedCards = [];
			matchedCards += 2;
			//display modal when all cards match
			if (matchedCards == 16) {
				gameOver('win');
			}
		} else {
			openedCards.forEach(unmatched);
			openedCards = [];
		}
	}
}
//count moves and start timer after first click on a pair of cards
function moveCounter() {
	countMoves++;
	movesNumber.innerHTML = countMoves;
	if (countMoves >= 1 && second == 0 && minute == 0) {
		startTimer();
	}
	//rating score
	if (countMoves >= 8 && countMoves <= 15) {
		const star3 = document.getElementById('star3');
		star3.className = 'fa fa-star-o';
	} else if (countMoves >= 16 && countMoves <= 24) {
		const star2 = document.getElementById('star2');
		star2.className = 'fa fa-star-o';
	} else if (countMoves >= 25) {
		const star1 = document.getElementById('star1');
		star1.className = 'fa fa-star-o';
		setTimeout(function() {
			gameOver("outOfMoves");
		}, 1000);
	}
}
// display modal when end game conditions are met
function gameOver(result) {
	clearInterval(interval);
	finalTime = timer.innerHTML;
	// star rating variable
	const starRating = document.querySelector(".stars").innerHTML;
	if (result == 'outOfMoves') {
		heading.innerHTML = 'You are out of moves.';
	} else if (result == 'win') {
		heading.innerHTML = 'Congratulations! You win!';
	}
	if (result == 'win' || result == 'outOfMoves') {
		document.getElementById("finalMove").innerHTML = countMoves + ' moves';
		document.getElementById("starRating").innerHTML = starRating;
		document.getElementById("totalTime").innerHTML = finalTime;
	}
	// add class "show" to display modal
	modal.classList.add("show");
}
// 'play again' button on modal
function playAgain() {
	modal.classList.remove("show");
	startGame();
}
// timer
function startTimer() {
	interval = setInterval(function() {
		timer.innerHTML = minute + "mins " + second + "secs";
		second++;
		if (second == 60) {
			minute++;
			second = 0;
		}
		if (minute == 60) {
			hour++;
			minute = 0;
		}
	}, 1000);
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
