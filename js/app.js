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

};

// Draw the enemy on the screen, required method for game
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var pInputEngine = function() {
    this.bindings = {};
    this.actions = {};

// TODO: Option to customize inputkeys
    this.bindKey(87, 'move-up');
    this.bindKey(83, 'move-down');
    this.bindKey(65, 'move-left');
    this.bindKey(68, 'move-right');        
};

pInputEngine.prototype.bindKey = function(key, action) {
    this.bindings[key] = action;
};

// Player to control
var Player = function(x, y) {
    Entity.call(this, x, y, 'images/char-boy.png');
    var snd = new Audio('sounds/river_s-rikkisch-8138_hifi.mp3');
    snd.play();
};


Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;


// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    sprite = 'images/enemy-bug.png';
    

    Entity.call(this, x, y, sprite);
};

Player.prototype.update = function() {
    if(inputEngine.actions['move-up']) this.y -= 5;
    if(inputEngine.actions['move-down']) this.y += 5;
    if(inputEngine.actions['move-left']) this.x -= 5;
    if(inputEngine.actions['move-right']) this.x += 5;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var e1 = new Enemy(150, 150);
var e2 = new Enemy(300, 50);

var allEnemies = [e1,e2];
// Place the player object in a variable called player
var player = new Player(200,200);
console.log('x' + player.x +':sprite = ' + player.sprite);

inputEngine = new pInputEngine();


var onKeyUp = function (event) {
    inputEngine.actions[inputEngine.bindings[event.keyCode]] = false;
};

var onKeyDown = function (event) {
    inputEngine.actions[inputEngine.bindings[event.keyCode]] = true;
};

document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);




