var State = function() {
    this.running = 'running';
    this.paused = 'paused';
    this.gameover = 'gameover';
};
var state = new State();

var Game = function() {
    this.mode = state.running;
    this.level = 0;
}

var game = new Game();

var Entity = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.speech = {};
    this.speech.startTime ='';
    this.speech.state = 0;
    this.speech.show = false;
    this.speech.words = 'nothing to say';
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


var InputEngine = function() {
    this.bindings = {};
    this.actions = {};

// Setup actions
 //   this.actions.pause = false;

// TODO: Option to customize inputkeys
    this.bindKey(87, 'move-up');
    this.bindKey(83, 'move-down');
    this.bindKey(65, 'move-left');
    this.bindKey(68, 'move-right');
    this.bindKey(80, 'pause');
    this.bindKey(32, 'space-bar') 
};

InputEngine.prototype.bindKey = function(key, action) {
    this.bindings[key] = action;
};




// Player to control
var Player = function(x, y) {
    Entity.call(this, x, y, 'images/char-boy.png');
    
    this.width = 60;
    this.height = 85;

    this.type = 'player';
    this.lifes = 3;
    this.speed = 170;


// Sound test
    //var snd = new Audio('sounds/river_s-rikkisch-8138_hifi.mp3');
    //snd.play();
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

var TextBubble = function(text) {
    Entity.call(this, 300, 300, 'images/bubble.png');
    this.text = text;
};

TextBubble.prototype = Object.create(Entity.prototype);
TextBubble.prototype.constructor = TextBubble;

TextBubble.prototype.setText = function(text) {
    this.text = text;
};

TextBubble.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillText(this.text, this.x + 10, this.y +30);
    ctx.strokeText(this.text, this.x + 10, this.y +30);        
};

Player.prototype.update = function(dt) {
    if(!inputEngine.actions.pause){
        if(inputEngine.actions['move-up']) this.y -= (this.speed * dt);
        if(inputEngine.actions['move-down']) this.y += (this.speed * dt);
        if(inputEngine.actions['move-left']) this.x -= (this.speed * dt);
        if(inputEngine.actions['move-right']) this.x += (this.speed * dt);
    }

    if(this.speech.show) {
        console.log('test speech show');
        //console.log('time:' + Date.now() - this.speech['startTime'])
        if(Date.now() - this.speech.startTime > 3000)
            this.speech.show = false;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if(this.speech.show){
        ctx.fillText(this.speech.words, this.x + 40, this.y +70);
        ctx.strokeText(this.speech.words, this.x + 40, this.y +70);        
    }
};

Player.prototype.centerLoc = function() {
    //TODO: Remove whitespace in pictures, or find some other solution!
    // modified location of player due to whitespace in image
    var loc = {x:0, y:0};
    loc.x = this.x + 14;
    loc.y = this.y + 56;
    return loc;
};

Player.prototype.speak = function(words) {
    if(this.speech.state === 0){
        this.speech.words = words;
        this.speech.show = true;
        this.speech.startTime = Date.now();
        this.speech.state = 1;
        console.log('speak funk state=' + this.speech.state);
    }
    
};

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    sprite = 'images/enemy-bug.png';
    Entity.call(this, x, y, sprite);

    this.width = 91;
    this.height = 62;

    this.type = 'enemy';
    this.baseSpeed = 100;
    this.randSpeed = 50;
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

Enemy.prototype.update = function(dt) {
    if(this.x > 600) {
        this.x = -100;
        this.randSpeed =  Math.floor(Math.random() * 400);  
    }
    this.x += (this.baseSpeed + this.randSpeed) * dt;
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var e1 = new Enemy(150, 150);
var e2 = new Enemy(300, 50);
var b1 = new TextBubble('hej hå');
var allEnemies = [e1,e2];
var allBubbles = [];
// Place the player object in a variable called player
var player = new Player(200,300);
console.log('x' + player.x +':sprite = ' + player.sprite);

inputEngine = new InputEngine();



var onKeyUp = function (event) {
    if(inputEngine.bindings[event.keyCode] === 'pause')
        inputEngine.actions.pause = true;
    else 
        inputEngine.actions[inputEngine.bindings[event.keyCode]] = false;
};

var onKeyDown = function (event) {
    //console.log(event.keyCode);
    //TODO: A better solution to filter out the keys not reacted to when pressed down.
    if(inputEngine.bindings[event.keyCode] === 'pause');
    else {
        inputEngine.actions[inputEngine.bindings[event.keyCode]] = true;
    }
};




document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);




