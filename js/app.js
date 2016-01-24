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

// Player to control
var Player = function() {
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



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
