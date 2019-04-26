// Last updated February 5, 2019
// Changes: - Created two levels
//              - Level 2 increases stick movement speed and
//                increases the minimum score requirement to win
//          - Increased original stick movement speed by 0.5 pixels
//          - Created new victory/game over screens

var Beaver = function(x, y) {
    this.x = x;
    this.y = y;
    this.img = getImage("creatures/Hopper-Happy");
    this.sticks = 0;
};

Beaver.prototype.draw = function() {
    fill(255, 0, 0);
    this.y = constrain(this.y, 0, height-88);
    image(this.img, this.x, this.y, 40, 40);
};

Beaver.prototype.hop = function() {
    this.img = getImage("creatures/Hopper-Jumping");
    this.y -= 5;
};

Beaver.prototype.fall = function() {
    this.img = getImage("creatures/Hopper-Happy");
    this.y += 5;
};

Beaver.prototype.checkForStickGrab = function(stick) {
    if ((stick.x >= this.x && stick.x <= (this.x + 40)) &&
        (stick.y >= this.y && stick.y <= (this.y + 40))) {
        stick.y = -400;
        this.sticks++;
    }
};

var Stick = function(x, y) {
    this.x = x;
    this.y = y;
};

Stick.prototype.draw = function() {
    fill(89, 71, 0);
    rectMode(CENTER);
    rect(this.x, this.y, 5, 40);
};

// Declaring variables
var beaver = new Beaver(200, 300);
var sticks = [];
var grassXs = [];
var levelState = 0;
var stickSpeed = 1.5;

for (var i = 0; i < 40; i++) {
    sticks.push(new Stick(i * 40 + 300, random(20, 260)));
}

for (var i = 0; i < 25; i++) {
    grassXs.push(i*20);
}

var gameFunction = function () {
    background(227, 254, 255);
    fill(130, 79, 43);
    rectMode(CORNER);
    textAlign(CORNER);
    rect(0, height*0.90, width, height*0.10);

    for (var i = 0; i < grassXs.length; i++) {
        image(getImage("cute/GrassBlock"), grassXs[i], height*0.85, 20, 20);
        grassXs[i] -= 1;
        if (grassXs[i] <= -20) {
            grassXs[i] = width;
        }
    }

    for (var i = 0; i < sticks.length; i++) {
        sticks[i].draw();
        beaver.checkForStickGrab(sticks[i]);
        sticks[i].x -= stickSpeed;
    }

    textSize(18);
    text("Score: " + beaver.sticks, 20, 30);

    if (keyIsPressed && keyCode === 0) {
        beaver.hop();
    } else {
        beaver.fall();
    }
    beaver.draw();
};

var resetGame = function() {
    beaver.sticks = 0;
    sticks = [];
    for (var i = 0; i < 40; i++) {
        sticks.push(new Stick(i * 40 + 300, random(20, 260)));
    }
};

var levelOne = function() {
    gameFunction();
    if (beaver.sticks >= 30 && sticks[39].x < 0) {
        background(227, 254, 255);
        fill(0);
        textAlign(CENTER, CENTER);
        text("level one cleared yay", width/2, height/2-15);
        text("press shift to continue", width/2, height/2+15);
        if (keyIsPressed && keyCode === SHIFT) {
            stickSpeed += 2;
            levelState += 1;
            resetGame();
        }
    } else if (beaver.sticks < 30 && sticks[39].x < 0) {
        background(227, 254, 255);
        fill(0);
        textAlign(CENTER, CENTER);
        text("you lose :(", width/2, height/2-15);
        text("press shift to try again", width/2, height/2+15);
        if (keyIsPressed && keyCode === SHIFT) {
            levelState = 0;
            resetGame();
        }
    }
};

var levelTwo = function() {
    gameFunction();
    if (beaver.sticks >= 35 && sticks[39].x < 0) {
        background(227, 254, 255);
        fill(0);
        textAlign(CENTER, CENTER);
        text("you win yay fantastic", width/2, height/2-15);
        text("press shift to restart", width/2, height/2+15);
        if (keyIsPressed && keyCode === SHIFT) {
            levelState = 0;
            resetGame();
        }
    } else if (beaver.sticks < 35 && sticks[39].x < 0) {
        background(227, 254, 255);
        fill(0);
        textAlign(CENTER, CENTER);
        text("you lose :(", width/2, height/2-15);
        text("press shift to try again", width/2, height/2+15);
        if (keyIsPressed && keyCode === SHIFT) {
            levelState = 1;
            resetGame();
        }
    }
};

draw = function() {
    if (levelState === 0) {
        levelOne();
    } else if (levelState >= 1) {
        levelTwo();
    }
};
