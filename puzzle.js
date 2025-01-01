/*********************************
 * puzzle.js
 *********************************/

// Puzzle dimensions
var rows = 5;
var columns = 5;

// Drag-related variables
var currTile = null;   // The tile being dragged
var otherTile = null;  // The tile being dropped on

// Stats
var turns = 0;
var time = 0;
var timerInterval = null;

let hintsUsed = 0; // Track number of hints used
const baseScore = 1000; // Starting score
const hintPenalty = 50; // Deduct 50 points for each hint used


// Wait for the window to load so the DOM elements exist
window.onload = function () {
    // Initialize the board
    const board = document.getElementById("board");
    board.style.width = "400px";
    board.style.height = "400px";
    board.style.display = "grid";
    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Fill board with blank tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.src = "./images/blank.jpg"; // All board tiles start as blank
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            board.append(tile);
        }
    }

    // Shuffle puzzle pieces (1.jpg to 25.jpg)
    let pieces = [];
    for (let i = 1; i <= 25; i++) {
        pieces.push(i.toString());
    }
    pieces.sort(() => Math.random() - 0.5);

    // Place puzzle pieces in the "pieces" container
    const piecesContainer = document.getElementById("pieces");
    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = `./images/${pieces[i]}.jpg`;
        tile.addEventListener("dragstart", dragStart);
        piecesContainer.append(tile);
    }

    // Start the timer
    startTimer();

    // Hook up the hint button
    document.getElementById("hintButton").addEventListener("click", highlightCorrectPieces);
};

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("timer").innerText = time;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Drag & drop handlers
function dragStart() {
    currTile = this; // This is the piece (or tile) being dragged
}

function dragOver(e) {
    e.preventDefault(); // Required to allow a drop
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop(e) {
    e.preventDefault();
    otherTile = this;

    // Defensive checks
    if (!currTile || !otherTile) return;

    // Allow swapping of images between tiles
    let currImg = currTile.src;
    let otherImg = otherTile.src;

    // Swap the images
    currTile.src = otherImg;
    otherTile.src = currImg;

    // Increase turn count
    turns++;
    document.getElementById("turns").innerText = turns;

    // Check if the puzzle is complete
    if (checkPuzzleCompletion()) {
        showCongratulations();
        stopTimer();
    }

    // Clean up references
    currTile = null;
    otherTile = null;
}


function dragEnd() {
    currTile = null;
    otherTile = null;
}

// Highlight correct pieces
/**
 * highlightCorrectPieces()
 * Highlights the correct puzzle piece and blank tile for the next move.
 */
function highlightCorrectPieces() {
    const boardTiles = document.getElementById("board").children;
    const puzzlePieces = document.getElementById("pieces").children;

    // Increment hints used
    hintsUsed++;

    // Clear existing highlights
    for (let tile of boardTiles) {
        tile.style.outline = "none";
    }
    for (let piece of puzzlePieces) {
        piece.style.outline = "none";
    }

    // Define the correct arrangement for the board (1.jpg to 25.jpg)
    const correctArrangement = [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
        '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
        '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
        '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg'
    ];

    // Find all blank tiles
    let blankIndices = [];
    for (let i = 0; i < boardTiles.length; i++) {
        if (
            boardTiles[i].src.includes("blank.jpg") ||
            boardTiles[i].src.includes("blank2.jpg")
        ) {
            blankIndices.push(i);
        }
    }

    if (blankIndices.length === 0) {
        console.log("No blank tiles found. Puzzle might be complete.");
        return;
    }

    // Pick the first blank tile to assist
    const tileIndex = blankIndices[0];

    // Highlight the blank tile in neon green
    boardTiles[tileIndex].style.outline = "4px solid #00FF00"; // Neon green

    // Determine the correct puzzle piece for this blank tile
    const neededFilename = correctArrangement[tileIndex];

    // Highlight the needed puzzle piece in neon green
    let foundPiece = false;
    for (let piece of puzzlePieces) {
        const pieceFilename = piece.src.split('/').pop(); // Extract filename only
        if (pieceFilename === neededFilename) {
            piece.style.outline = "4px solid #00FF00"; // Neon green
            foundPiece = true;
            break;
        }
    }

    if (!foundPiece) {
        console.log(`Couldn't find the puzzle piece ${neededFilename} in the pieces container.`);
    }
}




// Check puzzle completion
function checkPuzzleCompletion() {
    const boardTiles = document.getElementById("board").children;
    const correctArrangement = [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
        '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
        '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
        '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg'
    ];

    for (let i = 0; i < boardTiles.length; i++) {
        const tileFilename = boardTiles[i].src.split('/').pop();
        if (tileFilename !== correctArrangement[i]) {
            return false;
        }
    }
    return true;
}

// Show congratulations modal
function showCongratulations() {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    const messageDiv = document.createElement("div");
    messageDiv.id = "congratsMessage";
    messageDiv.style.padding = "30px";
    messageDiv.style.backgroundColor = "#ffffff";
    messageDiv.style.color = "#333";
    messageDiv.style.textAlign = "center";
    messageDiv.style.borderRadius = "15px";
    messageDiv.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";

    const title = document.createElement("h1");
    title.innerText = "🎉 Congratulations! 🎉";
    title.style.color = "#4CAF50";
    title.style.marginBottom = "20px";

    const subtitle = document.createElement("p");
    subtitle.innerText = "You successfully completed the puzzle!";
    subtitle.style.fontSize = "18px";
    subtitle.style.marginBottom = "30px";

    // Calculate final score
    const finalScore = Math.max(0, baseScore - hintsUsed * hintPenalty);

    const scoreDisplay = document.createElement("p");
    scoreDisplay.innerText = `Your Final Score: ${finalScore}`;
    scoreDisplay.style.fontSize = "22px";
    scoreDisplay.style.color = "#4CAF50";
    scoreDisplay.style.marginBottom = "20px";

    const closeButton = document.createElement("button");
    closeButton.innerText = "Play Again";
    closeButton.style.padding = "10px 20px";
    closeButton.style.backgroundColor = "#4CAF50";
    closeButton.style.color = "white";
    closeButton.style.fontSize = "16px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.onclick = function () {
        document.body.removeChild(overlay);
        location.reload();
    };

    messageDiv.appendChild(title);
    messageDiv.appendChild(subtitle);
    messageDiv.appendChild(scoreDisplay);
    messageDiv.appendChild(closeButton);
    overlay.appendChild(messageDiv);
    document.body.appendChild(overlay);
}








