

let gameScene = new Phaser.Scene('Game');


gameScene.init = function() {

    this.player;
    this.enemy;
    this.direction;
   

};

gameScene.preload = function() {

    this.load.tilemapTiledJSON('map', 'assets/demo_map.json');
    this.load.image('tiles', 'assets/Dungeon_Tileset.png');
    this.load.image('player', 'assets/knight/knight1.png');
    this.load.spritesheet('minotaur_idle', 'assets/minotaur_idle.png', { frameWidth: 95, frameHeight: 96 });

    this.load.spritesheet('idle_right', 'assets/knight/knight_idle_spritesheet.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('idle_left', 'assets/knight/knight_idle_spritesheet2.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('right_run', 'assets/knight/knight_run_spritesheet.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('left_run', 'assets/knight/knight_run_spritesheet2.png', { frameWidth: 16, frameHeight: 16 });
};

gameScene.create = function() {

    this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
    this.tileset = this.map.addTilesetImage('tileset-images', 'tiles');
    this.floor = this.map.createLayer('Floors', this.tileset, 0,0)
    this.stairs = this.map.createLayer('Stairs', this.tileset, 0,0);
    this.walls = this.map.createDynamicLayer('Walls/Holes', this.tileset, 0,0);
    this.walls.setCollisionByProperty({ collides: true });
    // this.physics.add.collider(this.player, this.walls, null, null, this);
    
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setScale(2.25);
    // this.player.setBounce(1)

    this.enemy = this.physics.add.sprite(400, 450, 'minotaur_idle');
    this.enemy.setScale(1.25);
    
    
    this.physics.add.collider(this.player, this.enemy); 

    

    this.cursors = this.input.keyboard.createCursorKeys();

    tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around', {fontSize: '32px', fill: '#FFFFFF' });

    this.anims.create({
        key:'idle_right',
        frames: this.anims.generateFrameNumbers('idle_right', { start: 0, end: 5 }),
        frameRate:10,
        repeat: 0
    });
    
    this.anims.create({
        key:'idle_right',
        frames: this.anims.generateFrameNumbers('idle_right', { start: 0, end: 5 }),
        frameRate:10,
        repeat: 0
    });

    this.anims.create({

        key:'idle_left',
        frames: this.anims.generateFrameNumbers('idle_left', { start: 0, end: 5 }),
        frameRate:10,
        repeat: 0
    });
    
    this.anims.create({
        key:'right_run',
        frames: this.anims.generateFrameNumbers('right_run', { start: 0, end: 5 }),
        frameRate:10,
        repeat: 0
    });

    this.anims.create({
        key:'left_run',
        frames: this.anims.generateFrameNumbers('left_run', { start: 0, end: 5 }),
        frameRate:10,
        repeat: 0
    });
    
    this.anims.create({
        key:'minotaur',
        frames: this.anims.generateFrameNumbers('minotaur_idle', { start: 0, end: 4 }),
        frameRate:10,
        repeat: 0
    });
};


gameScene.showDebugWalls = function() {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.walls.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    };


gameScene.update = function() {
    this.showDebugWalls();

	this.player.setCollideWorldBounds(true);
    this.enemy.anims.play('minotaur', true);
    
    if (this.cursors.right.isDown) {
        this.player.setVelocity(50, 0);
		this.player.anims.play('right_run', true);
        this.direction = 1;
        tutorialText.setVisible(false);

    } else if (this.cursors.left.isDown) {
        this.player.setVelocity(-50, 0);
		this.player.anims.play('left_run', true);
        this.direction = -1;
        tutorialText.setVisible(false);

    } else if (this.cursors.up.isDown) {
        this.player.setVelocity(0, -50);
        tutorialText.setVisible(false);

        if (this.direction == 1) {
            this.player.anims.play('right_run', true);
        } else if (this.direction == -1) {
            this.player.anims.play('left_run', true);
        }

    } else if (this.cursors.down.isDown) {
        this.player.setVelocity(0, 50);
        tutorialText.setVisible(false);

        if (this.direction == 1) {
            this.player.anims.play('right_run', true);
        } else if (this.direction == -1) {
            this.player.anims.play('left_run', true);
        }
        
    } else {
        if (this.direction == 1) {
            this.player.anims.play('idle_right', true);
        } else if (this.direction == -1) {
            this.player.anims.play('idle_left', true)
        }
    };
};


const config = {
	type: Phaser.AUTO,
	width: 670,
	height: 640,
	scene: gameScene,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		},
	}
};

let game = new Phaser.Game(config);