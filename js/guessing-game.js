/* generate secret number */
function getNumber() {
    return Math.ceil(Math.random() * 100);
}

/* check if valid guess, display error message if not */
function validGuess(guess, msg, previousGuesses) {
    if (isNaN(guess)) {
        msg.innerHTML = 'Guess must be a number.';
        return false;
    } if (guess < 1 || guess > 100) {
        msg.innerHTML = 'Guess must be between 1 and 100.';
        return false;
    } if (previousGuesses.includes(guess)) {
        msg.innerHTML = 'Please enter a new guess.'
        return false;
    } return true;
}

/* return distance btwn values */
function dist(guess, num) {
    return Math.abs(guess - num);
}

/* generate clues */
function getHotOrCold(guess, num, previousGuesses) {
    let guessHigher = num > guess ? true : false;
    let clue = '';
    if (guessHigher) {
        clue += 'higher';
    } else {
        clue += 'lower';
    }

    if (dist(guess, num) <= 5) {
        return "You're super close!";
    } if (dist(guess, num) <= 10) {
        return `You're warming up! Try ${clue}.`;
    } if (dist(guess, num) >= 50) {
        return `You're ice cold. Go ${clue}.`;
    }

    if (previousGuesses.length === 1) { /* no previous guesses */
        if (dist(guess, num) <= 30) {
            return `You're getting warmer... Try ${clue}.`;
        } else {
            return `Hmm, nothing here. Try ${clue}.`;
        }
    } else { /* compare to previous guesses */
        let prev = previousGuesses[previousGuesses.length - 2];
        if (dist(guess, num) < dist(prev, num)) {
            return `You're getting warmer. Try ${clue}.`;
        } else {
            return `Nope, getting colder. Try ${clue}.`;
        }
    }
}

function main() {

    /* set up the game */
    let num = getNumber();
    let previousGuesses = [];
    let attemptsLeft = 5;
    let hints = 1;
    let won = false;
    const msg = document.getElementById('msg');
    const remaining = document.getElementById('remaining');
    const submitted = document.getElementById('submit');
    const inputBox = document.getElementById('guess');
    const reset = document.getElementById('reset');
    const hint = document.getElementById('hint');

    function processGuess() {
        if (attemptsLeft > 0 && !won) {
            let guess = document.getElementById('guess').value;
            document.getElementById('guess').value = '';

            /* display messages */
            if (validGuess(guess, msg, previousGuesses)) {
                previousGuesses.push(guess);
                attemptsLeft--;

                if (attemptsLeft === 1) { /* remaining guesses */
                    remaining.innerHTML = `${attemptsLeft} guess remaining`;
                } else {
                    remaining.innerHTML = `${attemptsLeft} guesses remaining`;
                }

                document.getElementById(`g${5 - attemptsLeft}`).innerHTML = guess; /* record of guesses */

                if (Number(guess) === num) { /* winning message */
                    msg.innerHTML = `You won! The number was ${num}.`;
                    won = true;
                } else if (attemptsLeft === 0) { /* losing message */
                    msg.innerHTML = `Aw, shucks. The number was ${num}.`;
                } else { /* clues */
                    msg.innerHTML = getHotOrCold(guess, num, previousGuesses);
                }
            }
        }
    }

    submitted.addEventListener('click', () => { /* listen for click */
        processGuess();
    });

    inputBox.addEventListener('keydown', (e) => { /* listen for enter */
        if (e.key === 'Enter') {
            processGuess();
        }
    });

    reset.addEventListener('click', () => { /* reset the game */
        num = getNumber();
        previousGuesses = [];
        attemptsLeft = 5;
        hints = 1;
        won = false;
        msg.innerHTML = '&nbsp;';
        for (let i = 1; i < 6; i++) {
            document.getElementById(`g${i}`).innerHTML = ' - ';
        }
        remaining.innerHTML = '5 guesses remaining';
    });

    hint.addEventListener('click', () => { /* give a hint, a single hint */
        if (hints === 0) {
            msg.innerHTML = 'No more hints!';
        } else if (attemptsLeft > 0 && !won) {
            let hint = [];
            for (let i = 0; i < 3; i++) {
                hint[i] = Math.ceil(Math.random() * 100);
            }
            hint[Math.floor(Math.random() * 3)] = num;
            msg.innerHTML = `${hint[0]}, ${hint[1]}, ${hint[2]}`;
            hints--;
        }
    });
}

main();