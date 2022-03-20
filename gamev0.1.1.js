


let gameScene = new Phaser.Scene('Game');


gameScene.init = function() {

    this.player;
    this.enemy;
    this.playerSpeed = 1.5;
    x=1;

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
	
    const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
    const tileset = map.addTilesetImage('dungeon tiles', 'tiles');
    const layer3 = map.createLayer('Floors', tileset, 0,0)
    const layer2 = map.createLayer('Stairs', tileset, 0,0);
    const layer1 = map.createLayer('Walls/Holes', tileset, 0,0);
    
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setScale(2);


    this.enemy = this.physics.add.sprite(400, 450, 'minotaur_idle');

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
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.collider(this.player, layer1);    
   
    tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around', {fontSize: '32px', fill: '#FFFFFF' });
}


gameScene.update = function() {

	this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.player2); 
       

    this.enemy.anims.play('minotaur', true);
    
    if (this.cursors.right.isDown) {
        this.player.x += this.playerSpeed;
		this.player.anims.play('right_run', true);
        x=1;
        tutorialText.setVisible(false);
    } else if (this.cursors.left.isDown) {
        this.player.x -= this.playerSpeed;
		this.player.anims.play('left_run', true);
        x=0;
        tutorialText.setVisible(false);
    } else if (this.cursors.up.isDown) {
        this.player.y -= this.playerSpeed;
        if (x==1){
		this.player.anims.play('right_run', true);
        tutorialText.setVisible(false);
        }
        else if (x==0) {
            this.player.anims.play('left_run', true);
            tutorialText.setVisible(false);
        }
    } else if (this.cursors.down.isDown) {
        this.player.y += this.playerSpeed;
        if (x==1){
            this.player.anims.play('right_run', true);
            tutorialText.setVisible(false);
            }
            else if (x==0) {
                this.player.anims.play('left_run', true);
                tutorialText.setVisible(false);
            }
    }
    else{
        if (x==1){
        this.player.anims.play('idle_right', true);
        }
        else if (x==0){
            this.player.anims.play('idle_left', true);
        }
    }

}

const config = {
	type: Phaser.AUTO,
	width: 670,
	height: 640,
	scene: gameScene,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		},
	}
};

let game = new Phaser.Game(config);