var Entity = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.speech = {};
    this.speech['startTime'];
    this.speech['state'] = 0;
    this.speech['show'] = false;
    this.speech['words'] = 'nothing to say';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Entity.prototype.update = function(dt) {
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

// Setup actions
    this.actions['reset'] = false;
    this.actions['pause'] = false;

// TODO: Option to customize inputkeys
    this.bindKey(87, 'move-up');
    this.bindKey(83, 'move-down');
    this.bindKey(65, 'move-left');
    this.bindKey(68, 'move-right');
    this.bindKey(80, 'pause');   

         
};

pInputEngine.prototype.bindKey = function(key, action) {
    this.bindings[key] = action;
};




// Player to control
var Player = function(x, y) {
    Entity.call(this, x, y, 'images/char-boy.png');
    
    this.width = 70;
    this.height = 95;

    this.type = 'player';

// Sound test
    //var snd = new Audio('sounds/river_s-rikkisch-8138_hifi.mp3');
    //snd.play();
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    if(!inputEngine.actions['pause']){
        if(inputEngine.actions['move-up']) this.y -= (100 * dt);
        if(inputEngine.actions['move-down']) this.y += (100 * dt);
        if(inputEngine.actions['move-left']) this.x -= (100 * dt);
        if(inputEngine.actions['move-right']) this.x += (100 * dt);
    }

    if(this.speech['show']) {
        console.log('test speech show');
        //console.log('time:' + Date.now() - this.speech['startTime'])
        if(Date.now() - this.speech['startTime'] > 3000)
            this.speech['show'] = false;
    };
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if(this.speech['show']){
        ctx.fillText(this.speech['words'], this.x + 40, this.y +70);
        ctx.strokeText(this.speech['words'], this.x + 40, this.y +70);        
    }
}

Player.prototype.centerLoc = function() {
    //TODO: Remove whitespace in pictures, or find some other solution!
    // modified location of player due to whitespace in image
    var loc = {x:0, y:0};
    loc.x = this.x + 14;
    loc.y = this.y + 46;
    return loc;
};

Player.prototype.speak = function(words) {
    if(this.speech['state'] == 0){
        this.speech['words'] = words;
        this.speech['show'] = true;
        this.speech['startTime'] = Date.now();
        this.speech['state'] = 1;
        console.log('speak funk state=' + this.speech['state']);
    }
    
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    sprite = 'images/enemy-bug.png';
    Entity.call(this, x, y, sprite);

    this.width = 101;
    this.height = 72;

    this.type = 'enemy';
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.centerLoc = function () {
    //TODO: Remove whitespace in pictures, or find some other solution!
    // modified location of enemy due to whitespace in image
    var loc = {x:0, y:0};
    loc.x = this.x + 0;
    loc.y = this.y + 75;
    return loc;
};


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
    if(inputEngine.bindings[event.keyCode] === 'pause') {
        //console.log(inputEngine.actions['pause']);
        inputEngine.actions['pause'] = inputEngine.actions['pause'] === false ? true : false;
        //console.log(inputEngine.actions['pause']);
    }
    else {
        inputEngine.actions[inputEngine.bindings[event.keyCode]] = false;
    }
};

var onKeyDown = function (event) {
    //TODO: A better solution to filter out the keys not reacted to when pressed down.
    if(inputEngine.bindings[event.keyCode] === 'pause');
    else {
        inputEngine.actions[inputEngine.bindings[event.keyCode]] = true;
    }
    
};


document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);




