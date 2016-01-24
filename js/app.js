var Entity = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Entity.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

}

// Draw the enemy on the screen, required method for game
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
var pInputEngine = function() {
    this.bindings = {};
    this.actions = {};

// TODO: Option to customize inputkeys
    this.setupKeys();
        
};

pInputEngine.prototype.setupKeys = function() {
    this.bindings[87] = 'move-up';
    this.bindings[83] = 'move-down';
    this.bindings[65] = 'move-left';
    this.bindings[68] = 'move-right';
};

// Player to control
var Player = function() {
    this.inputEngine = new pInputEngine();

    x = 100;
    y = 200;

    Entity.call(this, x, y, 'images/char-boy.png');
};


Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

var player = new Player();
console.log('x' + player.x +':sprite = ' + player.sprite);
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    x = 150;
    y = 150;
    sprite = 'images/enemy-bug.png';
    

    Entity.call(this, x, y, sprite);
};

Player.prototype.update = function() {
    /*
    if(this.keyState[87]) this.y -= 5;
    if(this.keyState[83]) this.y += 5;
    if(this.keyState[65]) this.x -= 5;
    if(this.keyState[68]) this.x += 5;
    */
    if(this.inputEngine.actions['move-up']) this.y -= 5;
    if(this.inputEngine.actions['move-down']) this.y += 5;
    if(this.inputEngine.actions['move-left']) this.x -= 5;
    if(this.inputEngine.actions['move-right']) this.x += 5;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var e1 = new Enemy();
var e2 = new Enemy();

var allEnemies = [e1,e2];
// Place the player object in a variable called player


var onKeyUp = function (event) {
    player.inputEngine.actions[player.inputEngine.bindings[event.keyCode]] = false;
};

var onKeyDown = function (event) {
    player.inputEngine.actions[player.inputEngine.bindings[event.keyCode]] = true;
}

document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);




