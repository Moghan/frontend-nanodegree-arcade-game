/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.setAttribute('id', 'canvas');
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);

    canvas.width = 606;
    canvas.height = 707;
    doc.body.appendChild(canvas);

    ctx.font = '11pt Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';

    //gameStates = {};
    //gameStates['paused'] = false;



    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    
    function init() {
        lastTime = Date.now();
        main();
    }

    function initNextLevel() {
        allBubbles.push(new TextBubble(Levels[game.level+1].levelMessage));
        game.timeStamp = Date.now() + 500;
        
    }

    function startNextLevel() {
        game.level++;
        player.resetLocation();
        allEnemies = [];
        var currLevel = Levels[game.level];
        player.speed = currLevel.playerSpeed;
        for (var enemies = 0 ; enemies < currLevel.numberOfEnemies ; enemies++) {
            var e = new Enemy(1000, (50 + (100*enemies)));
            e.baseSpeed = currLevel.enemySpeed;
            e.speedRandomizer = currLevel.enemySpeedRandomizer;
            allEnemies.push(e);
        }        
    }


    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        switch(game.mode){
            case state.running :
                updateEntities(dt);
                checkCollisions();
                if(isWaterReached()) {
                    if(game.level === 10) {
                        game.mode = state.gameover;
                        allBubbles.push(new TextBubble('SUCCESS! All levels passed.\\nPress Space to play again.'));
                    }
                    else{
                        game.mode = state.newLevel;
                        game.isChangingLevel = true;
                    }
                }
                
                if(inputEngine.actions.pause) {
                    game.mode = state.paused;
                    allBubbles.push(new TextBubble('paused'));
                    inputEngine.actions.pause = false;
                }
            break;
            case state.paused :
                if(inputEngine.actions.pause) {
                    game.mode = state.running;
                    allBubbles.pop();
                    inputEngine.actions.pause = false;                    
                }
            break;
            case state.gameover :
                if(inputEngine.actions['space-bar']) {
                    inputEngine.actions['space-bar'] = false;
                    allBubbles.pop();
                    reset();
                    player.isCollision = false;
                }
            break;
            case state.newLevel :
                if(game.isChangingLevel) {
                    initNextLevel();
                    game.isChangingLevel = false;
                }
                if (game.timeStamp + 1000 < Date.now()) {
                    allBubbles.pop();
                    startNextLevel();
                    game.mode = state.running;
                }
            break;
        }
    }

    function isWaterReached() {
        if((player.y + player.image.offsetTop) < (map.boundaryTop + 5)){
            
            return true;
        }
        else return false;
    }

    function checkCollisions() {
        // Axis-Aligned Bounding Box
        loc_player = player.location();

        // TODO: this makes the function do more then check for collision !
        //checkBoundaries(loc_player);

        allEnemies.forEach(function(enemy) {
            loc_enemy = enemy.location();
            if ((loc_player.x < loc_enemy.x + enemy.image.width) && 
                (loc_enemy.x < loc_player.x + player.image.width) &&
                (loc_player.y < loc_enemy.y + enemy.image.height) &&
                (loc_enemy.y < loc_player.y + player.image.height)) {
                // Collision detected
                    //var snd = new Audio('sounds/river_s-rikkisch-8138_hifi.mp3');
                    //snd.play();
                    enemy.isCollision = true;
                
                    if(!player.isCollision) {
                        if(player.lifes === 0) {
                            allBubbles.push(new TextBubble('game over'));
                            game.mode = state.gameover;
                        }
                        else player.lifes--;

                        player.collisionTime = Date.now();
                        player.isCollision = true;
                    }                    
            }                
        });
        if(player.isCollision && player.collisionTime + 500 < Date.now()) {
            player.isCollision = false;
            allEnemies.forEach(function(e) {e.isCollision = false;});
            player.resetLocation();
        }

    }

    


    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

            var numRows = 7,
            numCols = 6,
            row, col,            
            currLevel = Levels[game.level];


        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < map.numRows; row++) {
            for (col = 0; col < map.numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                 var rowImage;
                 //console.log(currLevel.rowImages[row]);
                 switch(currLevel.rowImages[row]){
                    case 'w' : rowImage = 'images/water-block.png'; break;
                    case 's' : rowImage = 'images/stone-block.png'; break;
                    case 'g' : rowImage = 'images/grass-block.png'; break;
                 }

                ctx.drawImage(Resources.get(rowImage), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        allBubbles.forEach(function(bubble) {
            bubble.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        player.x = 200;
        player.y = 400;
        player.lifes = 3;
        game.level = 0;
        game.mode = state.newLevel;
        game.isChangingLevel = true;
    }



    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart.png', 
        'images/bubble.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
