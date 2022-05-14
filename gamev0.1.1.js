let startScene = new Phaser.Scene('start')

let gameScene = new Phaser.Scene('Game');

let gameScene2 = new Phaser.Scene('Game2');

let gameScene3 = new Phaser.Scene('Game3');

// import { Mrpas } from 'mrpas'


class Monsters{
    constructor(){        
    }
}

class HealthBar {

    constructor (gameScene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(gameScene);

        this.x = x;
        this.y = y;
        this.value = 500;
        this.p = 295 / 500;

        this.draw();

        gameScene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 300, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 295, 12);

        if (this.value < 100)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);

        this.bar.setScrollFactor(0,0);
    }
}



// game scene 1
gameScene.init = function() {

    this.player;
    this.rt;
    this.minotaur;
    this.goblin;
    this.goblin2;
    this.enemy;
    this.direction;
    this.healthBar;
    this.health;
    this.exit;
    this.footstep;
    isWalking = false;
    this.attacked = false;

};

var healthBars = [];

var Enemies = [this.goblin, this.goblin2, this.minotaur, this.slime1];


gameScene.preload = function() {

    this.load.tilemapTiledJSON('map', 'assets/level_one.json');
    this.load.image('tiles', 'assets/Dungeon_Tileset.png');
    this.load.image('gameOver','assets/gameOverText.png');
    this.load.image('ladder','assets/ladder.png');
    this.load.atlas('player', 'assets/knight.png', 'assets/knight.json');
    this.load.spritesheet('attack','assets/knight/knight_attack_spritesheet2.png', {frameWidth: 24, frameHeight: 16})
    this.load.atlas('minotaur', 'assets/minotaur.png', 'assets/minotaur.json');
    this.load.atlas('goblin_anim', 'assets/goblin_anim.png', 'assets/goblin_anim.json');
    this.load.atlas('goblin_run', 'assets/goblin_run.png', 'assets/goblin_run.json');
    this.load.atlas('slime', 'assets/slime.png', 'assets/slime.json');
    this.load.image('vision', 'assets/vision.png');

    this.load.json('characters', 'assets/characters.json');
    this.load.json('Goblin', 'assets/goblin.json');
    this.load.json('Slime', 'assets/slime_box.json');
    this.load.json('objects', 'assets/objects.json');

    this.load.audio('footsteps', 'assets/sounds/foootsteps (1).mp3')
    this.load.audio('music','assets/sounds/dungeonMusic.mp3')
};

gameScene.create = function() {

    // player anims
    this.anims.create({
        key: 'player_idle',
        frameRate: 10,
        frames: this.anims.generateFrameNames('player', {
            start: 1,
            end: 5,
            prefix: 'knight_idle_anim_f',
            suffix: '.png'
        }),
        repeat: -1
    });
    //player run
    this.anims.create({
        key: 'player_run',
        frameRate: 10,
        frames: this.anims.generateFrameNames('player', {
            start: 0,
            end: 5,
            prefix: 'knight_run_anim_f',
            suffix: '.png'
        }),
        repeat: -1
    });
    //player attack
    this.anims.create({
        key: 'player_attack',
        frameRate: 3,
        frames: this.anims.generateFrameNames('attack', {
            frames: [0,1,2 ]}),
        frameRate: 3,
        repeat: 0
    });

    //minotaur anims
    this.anims.create({
        key: 'minotaur_idle',
        frameRate: 10,
        frames: this.anims.generateFrameNames('minotaur', {
            start: 0,
            end: 4,
            prefix: 'tile00',
            suffix: '.png'
        }),
        repeat: -1
    });    

    //goblin anims
    this.anims.create({
        key: 'goblin_idle',
        frameRate: 6,
        frames: this.anims.generateFrameNames('goblin_anim', {
            start: 0,
            end: 5,
            prefix: 'goblin_idle_anim_f',
            suffix: '.png'
        }),
        repeat: -1
    });
    this.anims.create({
        key: 'goblin_runs',
        frameRate: 6,
        frames: this.anims.generateFrameNames('goblin_run', {
            start: 0,
            end: 5,
            prefix: 'goblin_run_anim_f',
            suffix: '.png'
        }),
        repeat: -1
    });

    //slime_anims
    this.anims.create({
        key: 'slime_anim',
        frameRate: 6,
        frames: this.anims.generateFrameNames('slime', {
            start: 0,
            end: 5,
            prefix: 'slime_run_anim_f',
            suffix: '.png'
        }),
        repeat: -1
    });


    this.footstep = this.sound.add('footsteps')

    this.music = this.sound.add('music')



    this.music = this.sound.add("music", { 
        volume: 1, 
        loop: true 
      });
    this.music.play();

    //create level and layers
    this.matter.world.disableGravity();
    this.cursors = this.input.keyboard.createCursorKeys();

    const characters = this.cache.json.get("characters");

    const Goblin = this.cache.json.get("Goblin");
    const Slime = this.cache.json.get("Slime");

    // const objects = this.cache.json.get("objects")

    const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    this.stoneFloor = map.createLayer('StoneFloor', tileset, 0,0)
     // this.exit = map.createLayer('Exit', tileset, 0,0); 
    // const dirtFloor = map.createLayer('DirtFloor', tileset, 0,0)
    // const stairs = map.createLayer('Stairs', tileset, 0,0);
    const walls = map.createLayer('Walls', tileset, 0,0);
    // const extra = map.createLayer('Extra', tileset, 0,0);

    walls.setCollisionByProperty({ collides: true });
    // this.exit.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(walls);

    //add player
    this.player = this.matter.add.sprite(100, 125, 'player')
    .setBody(characters.knight)
    .setScale(2)
    .play('player_idle')
    .setFixedRotation();

    // add enemies
    this.minotaur = this.matter.add.sprite(400, 125, 'minotaur')
    .setBody(characters.minotaur)
    // .setScale(1.5)
    .play('minotaur_idle')
    .setFixedRotation();

    this.goblin = this.matter.add.sprite(800, 900, 'goblin_run')
    .setBody(Goblin.Goblin)
    .setScale(2)
    .play('goblin_idle')
    .setFixedRotation();

    // this.goblin2 = this.matter.add.sprite(900, 900, 'goblin_anim')
    // .setBody(Goblin.Goblin)
    // .setScale(2)
    // .play('goblin_idle')
    // .setFixedRotation();


    
    this.slime1 = this.matter.add.sprite(300, 700, 'slime_anim')
    .setBody(Slime.Slime)
    .setScale(2)
    .play('slime_anim')
    .setFixedRotation();

    //add ladder to the scene

    // this.ladder = this.matter.add.sprite(800, 900, 'ladder')
    // .setBody(objects.ladder)
    // .setScale(1.5)
    // .setFixedRotation();
    
    // // FOV
    this.vision = this.make.image({
        x: this.player.x,
        y: this.player.y,
        key: 'vision',
        add: false
    });
    
    this.vision.scale = .75;
    
    const width = this.scale.width;
    const height =  1600;
    
    this.rt = this.make.renderTexture({
        width,
        height
    }, true);
    
    // add Health Bar to a global array in order to access in it the update function
    var healthBar = new HealthBar(gameScene, 200 , 400);

    healthBars.push(healthBar);

    console.log(healthBars[0])

    let myScene = this.scene
    

    gameOver = this.add.image(700,150,'gameOver');
    gameOver.setScale(0.1);
    gameOver.setOrigin(0.5);
    gameOver.visible = false;
    tutorialText = this.add.text(game.config.width/2 -600,game.config.height/2 -250, 'Use the arrow keys to move around!', { fontSize: '32px', fill: '#FFFFFF' });
    tutorialText2 = this.add.text(game.config.width/2 -600,game.config.height/2 -250, 'Use space to attack!', { fontSize: '32px', fill: '#FFFFFF' });
    tutorialText2.visible = false;
    tutorialText.setScrollFactor(0,0);
    tutorialText2.setScrollFactor(0,0);

    this.cameras.main.startFollow(this.player);

    this.rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
    this.rt.mask.invertAlpha = true;    
        
    this.rt.fill(0x000000, 1);
    this.rt.draw(this.stoneFloor);
    this.rt.setTint(0x0a2948); 


}


let EnemyHP =[1,1,1]

gameScene.update = function() {
    // console.log('x', this.player.x, 'y',this.player.y);      
    
	if (this.vision)
	{
		this.vision.x = this.player.x
		this.vision.y = this.player.y
	}

    // let Enemies = [this.goblin, this.goblin2, this.minotaur, this.slime1];
    
    let myScene = this.scene

    this.vision.x = this.player.x
    this.vision.y = this.player.y


    let speed = 3;
    
    isWalking = false;

    //if colliding with goblin
    // this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
    //     if ((bodyA.label == "knight" && bodyB.label == "Slime") || (bodyB.label == "knight" && bodyA.label == "Slime")) {
    //         console.log('damage slime', healthBars[0])
    //         let dead = healthBars[0].decrease(0.5);
    //         // end game
    //         if (dead) {
    //              myScene.pause();
    //             gameOver.visible = true;
    //          }
    //     }
    // });


    if (this.cursors.right.isDown && isWalking == false) {
        this.player.flipX = false
        this.player.setVelocityX(speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        tutorialText2.visible = true;
        // this.footstep.play();
        isWalking = true;

    } 
    else if (this.cursors.left.isDown) {
        this.player.flipX = true
        this.player.setVelocityX(-speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        tutorialText2.visible = true;

    } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        tutorialText2.visible = true;

    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        tutorialText2.visible = true;

    } else {
        // this.footstep.stop();       
        this.isWalking = false;
        this.player.setVelocity(0, 0)
        this.player.play('player_idle', true)

    };

    // HANDLE ATTACK AND COLLISION HERE
    if (this.cursors.space.isDown)
    {
        this.player.play('player_attack',true);
        // remove tutorial text after first attack
        tutorialText2.visible = false;
        tutorialText2 = this.add.text(16, 16, '', { fontSize: '32px', fill: '#FFFFFF' });
        //this.player.body.offset(25.0,25.0) USE THAT TO ATTACK FROM A DISTANCE
        
        
        // TEST ATTACK with minotaur and slime
        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
            if ((bodyA.label == "knight" && bodyB.label == "minotaur") || (bodyB.label == "knight" && bodyA.label == "minotaur" )) {   
                console.log('attacking')
                if (bodyA.label == "knight") {
                    console.log('attacked');

                    Enemies[1].visible = false;
                    Enemies[1].destroy();
                    EnemyHP[1] = 0;
                }
                else{
                    //this.minotaur.setVisible(false);
                }
            }
            else if ((bodyA.label == "knight" && bodyB.label == "Goblin") || (bodyB.label == "knight" && bodyA.label == "Slime")) {
                if (bodyA.label == "knight") {
                    console.log('attacked');

                    Enemies[0].visible = false;
                    Enemies[0].destroy();
                    EnemyHP[0] = 0;
                }
            }

            else if ((bodyA.label == "knight" && bodyB.label == "Slime") || (bodyB.label == "knight" && bodyA.label == "Goblin")) {
                console.log('attacking goblin', healthBars[0])
                if (bodyA.label == "knight") {
                    console.log('attacked');

                    Enemies[2].visible = false;
                    Enemies[2].destroy();
                    EnemyHP[2] = 0;
                }
            }
        });
        

    }
    else{
    // if colliding with minotaur
        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
            if ((bodyA.label == "knight" && bodyB.label == "minotaur") || (bodyB.label == "knight" && bodyA.label == "minotaur" )) {   
                console.log('damage', healthBars[0])
                let dead = healthBars[0].decrease(0.5);
                // end game
                if (dead) {
                    myScene.pause();
                    gameOver.visible = true;
                } 
            }
            else if ((bodyA.label == "knight" && bodyB.label == "Slime") || (bodyB.label == "knight" && bodyA.label == "Slime")) {
                console.log('damage slime', healthBars[0])
                let dead = healthBars[0].decrease(0.5);
                // end game
                if (dead) {
                    myScene.pause();
                    gameOver.visible = true;
                }
            }
            else if ((bodyA.label == "knight" && bodyB.label == "Goblin") || (bodyB.label == "knight" && bodyA.label == "Goblin")) {
                console.log('damage goblin', healthBars[0])
                let dead = healthBars[0].decrease(0.5);
                // end game
                if (dead) {
                    myScene.pause();
                    gameOver.visible = true;
                }
            }
        });

    }
    //beginning of possibly how attacking works
    //check if attack animation is on
    // if (this.player.anims.getName()  == 'player_attack') {
    //     console.log('Player is attacking');
    //     this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
    //         if ((bodyA.label == "knight" && bodyB.label == "minotaur") || (bodyB.label == "knight" && bodyA.label == "minotaur")) {   
    //             console.log('ahhhhh')
                
    //         }
    //     })
    // }    


    // let { velX, velY } = this.enemyFollows(this.minotaur, this.player);
    // this.minotaur.setVelocity(velX, velY);
    // let { velX1, velY1 } = this.enemyFollows(this.goblin, this.player);
    // this.goblin2.setVelocity(velX1, velY1);

    // const Enemies = [this.goblin, this.goblin2, this.minotaur, this.slime1];

    // go through array of enemies to set their velocity

    let Enemies = [this.goblin,this.minotaur, this.slime1];

    // let Enemies = [[this.goblin1,1], [this.goblin2,1], [this.minotaur,1], [this.slime1,1]];
    count = -1
    for (elements of Enemies){
        count += 1
        if (EnemyHP[count] == 0){
            continue
        }
        // make velocity an array and assign array values to enemy x and y velocity
        velocity = this.enemyFollows(elements, this.player);
        elements.setVelocity(velocity[0], velocity[1]);
    }


    //check if all enemies are dead
    if (this.allAreEqual(EnemyHP)){
        console.log('win');
        // roll credits
        // this.scene.start('credits')
    }
}; 

gameScene.allAreEqual = function(array) {
    const result = array.every(element => {
      if (element === 0) {
        return true;
      }
    });
  
    return result;
  }


gameScene.enemyFollows = function(from, to, speed = .5) {

    const direction = Math.atan((to.x - from.x) / (to.y - from.y));
    const speed2 = to.y >= from.y ? speed : -speed;
    //return velocity as an array and then assign each value to x and y
    return [speed2 * Math.sin(direction), speed2 * Math.cos(direction),direction]
    // return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
};


//start screen
startScene.init = function() {

    this.start;
    this.background;
    this.title;
    this.scene;

};

startScene.preload = function(){
    this.load.image('title', 'assets/start.png');
    this.load.image('bg', 'assets/level_three.png');
    this.load.image('startButton', 'assets/button.png');
    this.load.audio('music','assets/sounds/dungeonMusic.mp3')
};

startScene.create = function() {
    
    
    this.startBG = this.add.image(800,300,'bg');

    this.title = this.add.image(900,400,'title');

    title = this.add.text(800, 450, 'By Team13', { fontFamily: 'CustomFont' });
    
    // this.title.y=game.height*.15;

    this.startButton = this.add.image(800,700,'startButton');

    this.title.setInteractive();

    let myScene = this.scene

    this.input.on('pointerup', function (pointer) {
        this.music.stop();

        this.scene.start('Game');

    }, this);

    this.music = this.sound.add('music')

    this.music.play();
    

};

startScene.update = function() {

};


//scene 2

// gameScene2.init = function() {

//     this.player;
//     this.minotaur;
//     this.enemy;
//     this.direction;
//     this.healthBar;
//     this.health;

// };

// gameScene2.preload = function() {

//     this.load.tilemapTiledJSON('map', 'assets/level_two.json');
//     this.load.image('tiles', 'assets/Dungeon_Tileset.png');
//     this.load.image('gameOver','assets/gameOverText.png');
//     this.load.atlas('player', 'assets/knight.png', 'assets/knight.json');
//     this.load.spritesheet('attack','assets/knight/knight_attack_spritesheet2.png', {frameWidth: 24, frameHeight: 16})
//     this.load.atlas('minotaur', 'assets/minotaur.png', 'assets/minotaur.json');
//     this.load.image('vision', 'assets/vision.png');

//     this.load.json('characters', 'assets/characters.json')
// };

// gameScene2.create = function() {

//     this.anims.create({
//         key: 'player_idle',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('player', {
//             start: 1,
//             end: 5,
//             prefix: 'knight_idle_anim_f',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'minotaur_idle',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('minotaur', {
//             start: 0,
//             end: 4,
//             prefix: 'tile00',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'player_run',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('player', {
//             start: 0,
//             end: 5,
//             prefix: 'knight_run_anim_f',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'player_attack',
//         frameRate: 3,
//         frames: this.anims.generateFrameNames('attack', {
//             frames: [0,1,2 ]}),
//         frameRate: 3,
//         repeat: 0
//     });


//     this.matter.world.disableGravity();
//     this.cursors = this.input.keyboard.createCursorKeys();

//     const characters = this.cache.json.get("characters")

//     const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
//     const tileset = map.addTilesetImage('dungeon', 'tiles');
//     this.stoneFloor = map.createLayer('StoneFloor', tileset, 0,0)
//     const dirtFloor = map.createLayer('DirtFloor', tileset, 0,0)
//     const stairs = map.createLayer('Stairs', tileset, 0,0);
//     const walls = map.createLayer('Walls', tileset, 0,0);
//     const extra = map.createLayer('Extra', tileset, 0,0);

//     walls.setCollisionByProperty({ collides: true });
//     this.matter.world.convertTilemapLayer(walls);


//     this.player = this.matter.add.sprite(100, 125, 'player')
//     .setBody(characters.knight)
//     .setScale(2)
//     .play('player_idle')
//     .setFixedRotation();

//     this.minotaur = this.matter.add.sprite(400, 125, 'minotaur')
//     .setBody(characters.minotaur)
//     .play('minotaur_idle')
//     .setFixedRotation();

//     // FOV
//     // this.vision = this.make.image({
//     //     x: this.player.x,
//     //     y: this.player.y,
//     //     key: 'vision',
//     //     add: false
//     // });

//     // this.vision.scale = 1;

//     const width = this.scale.width
//     const height = this.scale.height

//     this.rt = this.make.renderTexture({
//         width,
//         height
//     }, true);



//     // Health Bar
//     let healthBar = new HealthBar(gameScene, 20 , 200);

//     let myScene = this.scene
//     this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
//         if ((bodyA.label == "knight" && bodyB.label == "minotaur") || (bodyB.label == "knight" && bodyA.label == "minotaur")) {
//             let dead = healthBar.decrease(10);
//             // end game
//             if (dead) {
//                 myScene.pause();
//                 gameOver.visible = true;

//              }
//         }
//     });

//     gameOver = this.add.image(700,150,'gameOver');
//     gameOver.setScale(0.1);
//     gameOver.setOrigin(0.5);
//     gameOver.visible = false;
//     tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around!', { fontSize: '32px', fill: '#FFFFFF' });
//     tutorialText2 = this.add.text(16, 16, 'Use space to attack!', { fontSize: '32px', fill: '#FFFFFF' });
//     tutorialText2.visible = false;

//     this.cameras.main.startFollow(this.player);

//     if (this.cursors.space.isDown)
//     {
//         console.log('hello');
//     }
// }

// gameScene2.update = function() {
//     // console.log('x', this.player.x, 'y',this.player.y);

//     let myScene = this.scene

//     if ( 774 < this.player.x && this.player.x < 870 && 863 < this.player.y && this.player.y < 990 ){
//         console.log('hello');
//         console.log('x', this.player.x, 'y',this.player.y);
//         myScene.start(gameScene2);
//     }

//     // this.vision.x = this.player.x
//     // this.vision.y = this.player.y


//     let speed = 3;


//     if (this.cursors.right.isDown) {
//         this.player.flipX = false
//         this.player.setVelocityX(speed);
// 		this.player.play('player_run', true);
//         tutorialText.setVisible(false);
//         tutorialText2.visible = true;

//     } else if (this.cursors.left.isDown) {
//         this.player.flipX = true
//         this.player.setVelocityX(-speed);
// 		this.player.play('player_run', true);
//         tutorialText.setVisible(false);
//         tutorialText2.visible = true;

//     } else if (this.cursors.up.isDown) {
//         this.player.setVelocityY(-speed);
// 		this.player.play('player_run', true);
//         tutorialText.setVisible(false);
//         tutorialText2.visible = true;

//     } else if (this.cursors.down.isDown) {
//         this.player.setVelocityY(speed);
// 		this.player.play('player_run', true);
//         tutorialText.setVisible(false);
//         tutorialText2.visible = true;

//     } else {

//         this.player.setVelocity(0, 0)
//         this.player.play('player_idle', true)

//     };


//     if (this.cursors.space.isDown)
//     {
//         this.player.play('player_attack',true);
//         // remove tutorial text after first attack
//         tutorialText2.visible = false;
//         tutorialText2 = this.add.text(16, 16, '', { fontSize: '32px', fill: '#FFFFFF' });

//     }

//     let { velX, velY } = this.enemyFollows(this.minotaur, this.player);
//     this.minotaur.setVelocity(velX, velY);

// };

// gameScene2.enemyFollows = function(from, to, speed = .5) {

//     const direction = Math.atan((to.x - from.x) / (to.y - from.y));
//     const speed2 = to.y >= from.y ? speed : -speed;

//     return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
// };


// gameScene3.init = function() {

//     this.player;
//     this.minotaur;
//     this.enemy;
//     this.direction;
//     this.healthBar;
//     this.health;

// };

// gameScene3.preload = function() {

//     this.load.tilemapTiledJSON('map', 'assets/level_three.json');
//     this.load.image('tiles', 'assets/Dungeon_Tileset.png');
//     this.load.image('gameOver','assets/gameOverText.png');
//     this.load.atlas('player', 'assets/knight.png', 'assets/knight.json');
//     this.load.spritesheet('attack','assets/knight/knight_attack_spritesheet2.png', {frameWidth: 24, frameHeight: 16})
//     this.load.atlas('minotaur', 'assets/minotaur.png', 'assets/minotaur.json');
//     this.load.image('vision', 'assets/vision.png');

//     this.load.json('characters', 'assets/characters.json')
// };

// gameScene3.create = function() {

//     this.anims.create({
//         key: 'player_idle',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('player', {
//             start: 1,
//             end: 5,
//             prefix: 'knight_idle_anim_f',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'minotaur_idle',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('minotaur', {
//             start: 0,
//             end: 4,
//             prefix: 'tile00',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'player_run',
//         frameRate: 10,
//         frames: this.anims.generateFrameNames('player', {
//             start: 0,
//             end: 5,
//             prefix: 'knight_run_anim_f',
//             suffix: '.png'
//         }),
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'player_attack',
//         frameRate: 3,
//         frames: this.anims.generateFrameNames('attack', {
//             frames: [0,1,2 ]}),
//         frameRate: 3,
//         repeat: 0
//     });


//     this.matter.world.disableGravity();
//     this.cursors = this.input.keyboard.createCursorKeys();

//     const characters = this.cache.json.get("characters")

//     const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
//     const tileset = map.addTilesetImage('dungeon', 'tiles');
//     this.stoneFloor = map.createLayer('StoneFloor', tileset, 0,0)
//     const dirtFloor = map.createLayer('DirtFloor', tileset, 0,0)
//     const stairs = map.createLayer('Stairs', tileset, 0,0);
//     const walls = map.createLayer('Walls', tileset, 0,0);
//     const extra = map.createLayer('Extra', tileset, 0,0);

//     walls.setCollisionByProperty({ collides: true });
//     this.matter.world.convertTilemapLayer(walls);


//     this.player = this.matter.add.sprite(100, 125, 'player')
//     .setBody(characters.knight)
//     .setScale(2)
//     .play('player_idle')
//     .setFixedRotation();

//     this.minotaur = this.matter.add.sprite(400, 125, 'minotaur')
//     .setBody(characters.minotaur)
//     .play('minotaur_idle')
//     .setFixedRotation();

//     FOV
//     this.vision = this.make.image({
//         x: this.player.x,
//         y: this.player.y,
//         key: 'vision',
//         add: false
//     });

//     this.vision.scale = 1;

//     const width = this.scale.width
//     const height = this.scale.height

//     this.rt = this.make.renderTexture({
//         width,
//         height
//     }, true);



//     // Health Bar
//     let healthBar = new HealthBar(gameScene, 20 , 200);

//     let myScene = this.scene
//     this.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
//         if ((bodyA.label == "knight" && bodyB.label == "minotaur") || (bodyB.label == "knight" && bodyA.label == "minotaur")) {
//             let dead = healthBar.decrease(10);
//             // end game
//             if (dead) {
//                 myScene.pause();
//                 gameOver.visible = true;

//              }
//         }
//     });

//     gameOver = this.add.image(700,150,'gameOver');
//     gameOver.setScale(0.1);
//     gameOver.setOrigin(0.5);
//     gameOver.visible = false;
//     tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around!', { fontSize: '32px', fill: '#FFFFFF' });
//     tutorialText2 = this.add.text(16, 16, 'Use space to attack!', { fontSize: '32px', fill: '#FFFFFF' });
//     tutorialText2.visible = false;

//     this.cameras.main.startFollow(this.player);

//     if (this.cursors.space.isDown)
//     {
//         console.log('hello');
//     }
// }





const config = {
	type: Phaser.WEBGL,
	width: 1600,
	height: 1350,
    scale: {
        // Fit to window
        // mode: Phaser.Scale.FIT,
        mode: Phaser.Scale.ENVELOP,
        // mode: Phaser.Scale.RESIZE,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [startScene, gameScene],
	physics: {
		default: 'matter',
		matter: {
			debug: true
		},
	}
};

let game = new Phaser.Game(config);
