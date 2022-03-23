

let gameScene = new Phaser.Scene('Game');


gameScene.init = function() {

    this.player;
    this.minotaur;
    this.direction;

};

gameScene.preload = function() {

    this.load.tilemapTiledJSON('map', 'assets/tutorial_map.json');
    this.load.image('tiles', 'assets/Dungeon_Tileset.png');
    this.load.atlas('player', 'assets/knight.png', 'assets/knight.json');
    this.load.atlas('minotaur', 'assets/minotaur.png', 'assets/minotaur.json');

    this.load.json('characters', 'assets/characters.json')
};

gameScene.create = function() {
    
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

    this.matter.world.disableGravity();

    characters = this.cache.json.get("characters")

    this.cursors = this.input.keyboard.createCursorKeys();
	
    const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    const stoneFloor = map.createLayer('StoneFloor', tileset, 0,0)
    const dirtFloor = map.createLayer('DirtFloor', tileset, 0,0)
    const stairs = map.createLayer('Stairs', tileset, 0,0);
    const walls = map.createLayer('Walls', tileset, 0,0);
    const extra = map.createLayer('Extra', tileset, 0,0);
    
    walls.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(walls);

    this.player = this.matter.add.sprite(100, 125, 'player', 'knight', {characters: characters.knight})
        .setScale(2)
        .play('player_idle')
        .setFixedRotation();
    
        
    this.minotaur = this.matter.add.sprite(400, 125, 'minotaur', 'minotaur', {characters: characters.minotaur})
        .play('minotaur_idle')
        .setFixedRotation();
    

    tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around', {fontSize: '32px', fill: '#FFFFFF' });

    // make health bar
    // let healthBar = this.makeBar(20,100,0x2ecc71);
 
    // this.setValue(healthBar,100);

}


gameScene.update = function() {

    let speed = 3;
    
    if (this.cursors.right.isDown) {
        this.player.flipX = false
        this.player.setVelocityX(speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);

    } else if (this.cursors.left.isDown) {
        this.player.flipX = true
        this.player.setVelocityX(-speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        
    } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
		this.player.play('player_run', true);
        tutorialText.setVisible(false);
        
    } else {
        this.player.setVelocity(0, 0)
        this.player.play('player_idle', true)
    };
};


// gameScene.makeBar = function(x,y,color)
//     // draw the bar
//     let bar = this.add.graphics();

//     // color the bar
//     bar.fillStyle(color, 1);

//     // fill the bar with a rectangle
//     bar.fillRect(0, 0, 200, 50);
    
//     // position the bar
//     bar.x = x;
//     bar.y = y;

//     // return the bar
//     return bar;
// };

// gameScene.setValue = function(bar,percentage) {
//     //scale the bar
//     bar.scaleX = percentage/100;
// }

const config = {
	type: Phaser.AUTO,
	width: 1650,
	height: 225,
	scene: gameScene,
	physics: {
		default: 'matter',
		matter: {
			debug: true
		},
	}
};

let game = new Phaser.Game(config);