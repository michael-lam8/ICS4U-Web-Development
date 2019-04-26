// Last updated February 5, 2019
// Changes: - Tiles brighten when mouse hovers
//          - Added elapsed time counter
//          - Added game victory screen
//          - Added replay functionality (resets game state)

// Declaring variables
var NUM_COLS = 5, NUM_ROWS = 4, numTries = 0, numMatches = 0, flippedTiles = [], delayStartFC = null;
var faces = [
    getImage("avatars/leafers-seed"),
    getImage("avatars/leafers-seedling"),
    getImage("avatars/leafers-sapling"),
    getImage("avatars/leafers-tree"),
    getImage("avatars/leafers-ultimate"),
    getImage("avatars/marcimus"),
    getImage("avatars/mr-pants"),
    getImage("avatars/mr-pink"),
    getImage("avatars/old-spice-man"),
    getImage("avatars/robot_female_1")
];

// Setting Tile object
var Tile = function(x, y, face) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.face = face;
    this.isFaceUp = false;
    this.isMatch = false;
};

// Draws cards and brightens background when hovered over
Tile.prototype.draw = function() {
    if (!this.isUnderMouse(mouseX, mouseY)) {
        fill(214, 247, 202);
    } else {
        fill(244, 255, 240);
    }
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
    if (this.isFaceUp) {
        image(this.face, this.x, this.y, this.width, this.width);
    } else {
        image(getImage("avatars/leaf-green"), this.x, this.y, this.width, this.width);
    }
};

// Returns true if mouse hovers a tile
Tile.prototype.isUnderMouse = function(x, y) {
    return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
};

// Make an array which has 2 of each, then randomize it
var possibleFaces = faces.slice(0);
var selected = [];
for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
    // Randomly pick one from the array of remaining faces
    var randomInd = floor(random(possibleFaces.length));
    var face = possibleFaces[randomInd];
    // Push twice onto array
    selected.push(face);
    selected.push(face);
    // Remove from array
    possibleFaces.splice(randomInd, 1);
}

// Now shuffle the elements of that array
var shuffleArray = function(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var ind = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[ind];
        array[ind] = temp;
    }
};
shuffleArray(selected);

// Create the tiles
var tiles = [];
for (var i = 0; i < NUM_COLS; i++) {
    for (var j = 0; j < NUM_ROWS; j++) {
        var tileX = i * 78 + 10;
        var tileY = j * 78 + 40;
        var tileFace = selected.pop();
        tiles.push(new Tile(tileX, tileY, tileFace));
    }
}

mouseClicked = function() {
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile.isUnderMouse(mouseX, mouseY)) {
            if (flippedTiles.length < 2 && !tile.isFaceUp) {
                tile.isFaceUp = true;
                flippedTiles.push(tile);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                        flippedTiles.length = 0;
                        numMatches++;
                    }
                    delayStartFC = frameCount;
                }
            }
            loop();
        }
    }
};

var resetGame = function() {
    numTries = 0;
    numMatches = 0;
    flippedTiles = [];
    delayStartFC = null;
    frameCount = 0;
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        tile.isFaceUp = false;
        tile.isMatch = false;
    }
    draw();
};

draw = function() {
    background(255, 255, 255);
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (!tile.isMatch) {
                tile.isFaceUp = false;
            }
        }
        flippedTiles = [];
        delayStartFC = null;
        noLoop();
    }

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].draw();
    }

    if (numMatches === tiles.length/2) {
        background(255, 255, 255);
        fill(0, 0, 0);
        textSize(24);
        text("You found them all in " + numTries + " tries!", width/2, height/2-10);
        text("Press Shift to play again.", width/2, height/2+10);
        if (keyIsPressed && keyCode === SHIFT) {
            resetGame();
        }
    }
    fill(0, 0, 0);
    textAlign(CENTER);
    textSize(24);
    text("Time elapsed: " + Math.round(frameCount/60), width/2, 380);
};

noLoop();
