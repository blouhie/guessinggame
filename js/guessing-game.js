/* generate secret number */
function getNumber() {
    return Math.ceil(Math.random() * 100);
}

/* check if valid guess, display error message if not */
function validGuess(guess) {
    if (!Number(guess)) {
        document.getElementById('msg').innerHTML = 'Guess must be a number.';
        return false;
    } else if (guess < 0 || guess > 100) {
        document.getElementById('msg').innerHTML = 'Guess must be between 0 and 100.';
        return false;
    } else if (previousGuesses.includes(guess)) {
        document.getElementById('msg').innerHTML = 'Please enter a new guess.'
        return false;
    } return true;
}

/* return distance btwn values */
function dist(guess, num) {
    return Math.abs(guess - num);
}

/* generate clues */
function getHotOrCold(guess, num, previousGuesses) {
    if (dist(guess, num) < 5) {
        return "You're super close!";
    } if (previousGuesses.length === 1) { /* no previous guesses */
        if (dist(guess, num) < 30) {
            return "You're getting warmer...";
        } else {
            return "Hmm, nothing here.";
        }
    } else {
        let prev = previousGuesses[previousGuesses.length - 2];
        if (dist(guess, num) < dist(prev, num)) {
            return "You're getting closer!";
        } else {
            if (dist(guess, num) > 50) {
                return "You're ice cold.";
            } else {
                return "Nope, nothing here.";
            }
        }
    }
}

/* set up the game */
let num = getNumber();
let previousGuesses = [];
let attemptsLeft = 5;
let hints = 1;
let won = false;
const submitted = document.getElementById('submit');
const reset = document.getElementById('reset');
const hint = document.getElementById('hint');

/* process guess */
submitted.addEventListener('click', () => {

    if (attemptsLeft > 0 && !won) {
        let guess = document.getElementById('guess').value;
        document.getElementById('guess').value = '';

        /* display messages */
        if (validGuess(guess)) {
            previousGuesses.push(guess);
            attemptsLeft--;

            if (attemptsLeft === 1) { /* remaining guesses */
                document.getElementById('remaining').innerHTML = `${attemptsLeft} guess remaining`;
            } else {
                document.getElementById('remaining').innerHTML = `${attemptsLeft} guesses remaining`;
            }

            document.getElementById(`g${5 - attemptsLeft}`).innerHTML = guess; /* record of guesses */

            if (Number(guess) === num) { /* winning message */
                document.getElementById('msg').innerHTML = `You won! The number was ${num}.`;
                won = true;
            } else if (attemptsLeft === 0) { /* losing message */
                document.getElementById('msg').innerHTML = `The number was ${num}. <br> Better luck next time!`;
            } else { /* clues */
                document.getElementById('msg').innerHTML = getHotOrCold(guess, num, previousGuesses);
            }
        }
    }

});

/* reset the game */
reset.addEventListener('click', () => {
    num = getNumber();
    previousGuesses = [];
    attemptsLeft = 5;
    hints = 1;
    won = false;
    document.getElementById('msg').innerHTML = '&nbsp;';
    for (let i = 1; i < 6; i++) {
        document.getElementById(`g${i}`).innerHTML = ' - ';
    }
    document.getElementById('remaining').innerHTML = '5 guesses remaining';
});

/* give a hint, a single hint */
hint.addEventListener('click', () => {
    if (hints === 0) {
        document.getElementById('msg').innerHTML = 'No more hints!';
    } else if (attemptsLeft > 0 && !won) {
        let hint = [];
        for (let i = 0; i < 3; i++) {
            hint[i] = Math.ceil(Math.random() * 100);
        }
        hint[Math.floor(Math.random() * 3)] = num;
        document.getElementById('msg').innerHTML = `${hint[0]}, ${hint[1]}, ${hint[2]}`;
        hints--;
    }
});