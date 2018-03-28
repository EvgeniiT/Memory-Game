 //
 // List that holds all of your cards
 //
 let listOfCards = [
 	"fa-diamond",
 	"fa-diamond",
 	"fa-paper-plane-o",
 	"fa-paper-plane-o",
 	"fa-anchor",
 	"fa-anchor",
 	"fa-bolt",
 	"fa-bolt",
 	"fa-cube",
 	"fa-cube",
 	"fa-leaf",
 	"fa-leaf",
 	"fa-bicycle",
 	"fa-bicycle",
 	"fa-bomb",
 	"fa-bomb"
 ];
let moves = $(".moves");
let movesCount;
let cards = $(".card");
let gameTimer;
let totalSeconds;


//
// Display the cards on the page
// 	- shuffle the list of cards using the provided "shuffle" method below
// 	- loop through each card and create its HTML
// 	- add each card's HTML to the page
// 	- set move counter to 0
//	- set 3 stars
//	- detach event listeners
//
newDeck();

//
//	Timer function
//
function setTime() {
	let minutesLabel = $(".minutes");
	let secondsLabel = $(".seconds");
  totalSeconds++;
  secondsLabel.html(pad(totalSeconds % 60));
  minutesLabel.html(pad(parseInt(totalSeconds / 60)));
}

//
//	Add 0 (if needed) on first position of min and sec
//	and return string with time.
//
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

//
// 	Draw stars depend on moves counter
//
function checkStars() {
	if (movesCount > 20) {
		$(".stars").find("i").slice(1,2).removeClass("fa-star");
	}
	if (movesCount > 30) {
		$(".stars").find("i").slice(2,3).removeClass("fa-star");
	}
}

//
//	Check if two open cards got same classes and add match class
//	or hide cards
//
function checkMatch(openCards) {
	if ( openCards.length == 2 ) {
		if ( openCards.first().html() == openCards.last().html() ) {
			setMatch(openCards);
		} else {
			hideCards(openCards);
		}
	}
}

//
// 	Shuffles deck, hide cards, reset moves counter, reset Timer
//	reset stars, hide pop window, show deck, reset event listeners
//
function newDeck() {
	listOfCards = shuffle(listOfCards);
	cards.removeClass("match open show");
	cards.find("i").removeClass();
	cards.each(function(index) {
		$(this).find("i").addClass("fa " + listOfCards[index]);
	});

	movesCount = 0;
	moves.html(movesCount);

	totalSeconds = 0;
	gameTimer = setInterval(setTime, 1000);

	$(".stars").find("i").addClass("fa-star")

	$(".popWindow").css("display", "none");
	$(".deck").css("display", "flex");
	$(".restart").off("click");
	$(".score-panel .restart").click(function() {
		clearInterval(gameTimer);
		newDeck();
	});

	cards.off("click");
	cards.click(function() {
		runGame($(this));
	});
}

//
// 	Run game logic
//
function runGame(card) {
	showCard(card);
	setOpen(card);
	checkMatch($(".open"));
	checkStars();
	checkWin();
}

function showCard(card) {
	card.addClass("show");
}

function setOpen(card) {
	card.addClass("open");
}

//
//	Hides cards after 1s delay. Detachs click event from cards while they
// 	are opened to prevent more than two cards opened.
//
function hideCards(cardsToHide) {
	cards.off("click");
	movesCount = incMove(movesCount);
	setTimeout(function(){
		cardsToHide.removeClass("open show");
		cards.not(".match").click(function() {
			runGame($(this));
		});
	}, 1000);
}

//
//	Sets cards as matched, detachs click event listener for them
//
function setMatch(openCards) {
	cards.off("click");
	openCards.addClass("match");
	openCards.removeClass("open show");
	movesCount = incMove(movesCount);
	cards.not(".match").click(function() {
		runGame($(this));
	});
}

function incMove(counter) {
	counter ++;
	$(".moves").html(counter);
	return counter;

}

//
//	Checks end of the game. Draw pop window.
//
function checkWin() {
	if ($(".match").length == 16) {
		clearInterval(gameTimer);
		$(".deck").css("display", "none");
		$(".popWindow").css("display", "block");
		$(".popWindow").html("<h1>You win!</h1><p>You spend " +
			pad(parseInt(totalSeconds / 60)) + " min and " +
			pad(totalSeconds % 60) + " sec and " + movesCount +
			"moves. You earn " + $(".fa-star").length +
			" stars.</p><div class=\"restart\"><p>Play again!</p></div>"
		);
		$(".popWindow .restart").click(function() {
			clearInterval(gameTimer);
			newDeck();
		});
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
