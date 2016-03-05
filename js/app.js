var ImagePlayer = function() {
    this.sprite = 'images/char-boy.png';
    this.width = 60;
    this.height = 85;
    this.offsetLeft = 20;
    this.offsetTop = 65;
    this.offsetRight = 20;
    this.offsetBottom = 35;
    this.width = 60;
    this.height = 70;

};

var ImageEnemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.width = 91;
    this.height = 62;
    this.offsetLeft = 5;
    this.offsetTop = 80;
};

var MapData = function() {
    this.boundaryLeft = 5;
    this.boundaryTop = 60;
    this.boundaryBottom = 630;
    this.boundaryRight = 600;
    this.numRows = 7;
    this.numCols =6;
};

var State = function() {
    this.running = 'running';
    this.paused = 'paused';
    this.gameover = 'gameover';
    this.newLevel = 'new level';
};

var Game = function() {
    this.mode = state.newLevel;
    this.level = 0;
    this.timeStamp = 0;
    this.isChangingLevel = true;
};

var InputEngine = function() {
    this.bindings = {};
    this.actions = {};

// TODO: Option to customize inputkeys
    this.bindKey(87, 'move-up');
    this.bindKey(83, 'move-down');
    this.bindKey(65, 'move-left');
    this.bindKey(68, 'move-right');
    this.bindKey(80, 'pause');
    this.bindKey(32, 'space-bar'); 
};

InputEngine.prototype.bindKey = function(key, action) {
    this.bindings[key] = action;
};

var Entity = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.isCollision = false;
    this.collisionTime = 0;
};

Entity.prototype.update = function(dt) {
};

Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var TextBubble = function(text) {
    Entity.call(this, 300, 300, 'images/bubble.png');
    this.lines = text.split('\\n');
    this.numberOfLines = this.lines.length;
};

TextBubble.prototype = Object.create(Entity.prototype);
TextBubble.prototype.constructor = TextBubble;

TextBubble.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    for (var i = 0 ; i < this.numberOfLines ; i++) {
        ctx.fillText(this.lines[i], this.x + 10, this.y + 30 + (i*20));
        ctx.strokeText(this.lines[i], this.x + 10, this.y + 30+ (i*20));        
    }
};



var Player = function(x, y) {
    this.image = new ImagePlayer();
    Entity.call(this, x, y, this.image.sprite);
    
    this.type = 'player';
    this.lifes = 3;
    this.speed = 170;
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.resetLocation = function() {
    this.x = 200;
    this.y = Levels[game.level].playerStartPosY;
};

Player.prototype.update = function(dt) {
    if(!this.isCollision){
        if(inputEngine.actions['move-up']) this.y -= (this.speed * dt);
        if(inputEngine.actions['move-down']) this.y += (this.speed * dt);
        if(inputEngine.actions['move-left']) this.x -= (this.speed * dt);
        if(inputEngine.actions['move-right']) this.x += (this.speed * dt);
    }
    this.checkBoundaries();
};

Player.prototype.checkBoundaries = function() {
        if(this.x + this.image.offsetLeft < map.boundaryLeft) this.x = map.boundaryLeft - this.image.offsetLeft;
        if(this.x + this.image.offsetLeft + this.image.width > map.boundaryRight) this.x = map.boundaryRight - this.image.offsetLeft - this.image.width;
        if(this.y + this.image.offsetTop < map.boundaryTop) this.y = map.boundaryTop - this.image.offsetTop;
        if(this.y + this.image.offsetTop + this.image.height > map.boundaryBottom) this.y = map.boundaryBottom - this.image.offsetTop - this.image.height;
};

Player.prototype.location = function() {
    // Return modified location of player due to whitespace in image
    var loc = {x:0, y:0};
    loc.x = this.x + this.image.offsetLeft;
    loc.y = this.y + this.image.offsetTop;
    return loc;
};

// Enemies our player must avoid
var Enemy = function(x, y) {
    this.image = new ImageEnemy();
    Entity.call(this, x, y, this.image.sprite);

    //this.type = 'enemy';
    this.speedRandomizer = 0;
    this.baseSpeed = 0;
    this.randSpeed = 0;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// Returns modified location of enemy due to whitespace in image
Enemy.prototype.location = function () {
    var loc = {x:0, y:0};
    loc.x = this.x + this.image.offsetLeft;
    loc.y = this.y + this.image.offsetTop;
    return loc;
};

Enemy.prototype.update = function(dt) {
    if(!this.isCollision) {
        if(this.x > 600) {
            this.x = -100;
            this.randSpeed =  Math.floor(Math.random() * this.speedRandomizer);  

            // count the number of stone-rows on this level
            var numberOfStoneRows = 0;
            for(var i = 0 ; i < map.numRows ; i++)
                if(Levels[game.level].rowImages[i] === 's') numberOfStoneRows++;

            // Randomize new y pos for enemy that match a row of stones
            var randStoneRow = Math.floor(Math.random() * numberOfStoneRows + 1);  
            this.y = -20;
            i = 1;
            while (0 < randStoneRow) {
                if(Levels[game.level].rowImages[i] === 's')
                    randStoneRow--;

                this.y += 83;
                i++;
            }
        }

        this.x += (this.baseSpeed + this.randSpeed) * dt;
    }
};


// Now instantiate your objects.
var state = new State();
var game = new Game();
var map = new MapData();
var inputEngine = new InputEngine();
var allEnemies = [];

//Bubbles are used to show messages. At the moment only one bubble at a time is used.
var allBubbles = [];
var player = new Player(200,350);



var onKeyUp = function (event) {
    if(inputEngine.bindings[event.keyCode] === 'pause')
        inputEngine.actions.pause = true;
    else 
        inputEngine.actions[inputEngine.bindings[event.keyCode]] = false;
};

var onKeyDown = function (event) {
    if(inputEngine.bindings[event.keyCode] === 'pause');
    else {
        inputEngine.actions[inputEngine.bindings[event.keyCode]] = true;
    }
};


// ******************************************************************************************************
// The code below is for playing the game on phone or tablet.
// Its early beta at this point, but it does not interfere with user experiance when playing on computer.
//
// ******************************************************************************************************

document.addEventListener('keyup', onKeyUp);
document.addEventListener('keydown', onKeyDown);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {   
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
}                                            

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }
    
    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {            
            /* left swipe */ 
            inputEngine.actions['move-up'] = false;
            inputEngine.actions['move-down'] = false;
            inputEngine.actions['move-left'] = true;
            inputEngine.actions['move-right'] = false;

        } else {
            /* right swipe */
            inputEngine.actions['move-up'] = false;
            inputEngine.actions['move-down'] = false;
            inputEngine.actions['move-left'] = false;
            inputEngine.actions['move-right'] = true;        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
            inputEngine.actions['move-up'] = true;
            inputEngine.actions['move-down'] = false;
            inputEngine.actions['move-left'] = false;
            inputEngine.actions['move-right'] = false;
        } else { 
            /* down swipe */
            inputEngine.actions['move-up'] = false;
            inputEngine.actions['move-down'] = true;
            inputEngine.actions['move-left'] = false;
            inputEngine.actions['move-right'] = false;
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;
}