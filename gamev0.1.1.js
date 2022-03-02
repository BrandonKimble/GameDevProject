


let gameScene = new Phaser.Scene('Game');


gameScene.init = function() {

    this.player;
    this.playerSpeed = 1.5;

};

gameScene.preload = function() {

    this.load.tilemapTiledJSON('map', 'assets/demo_map.json');
    this.load.image('tiles', 'assets/Dungeon_Tileset.png');
    this.load.image('player', 'assets/knight/knight1.png')
    this.load.spritesheet('idle', 'assets/knight/knight_idle_spritesheet.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('run', 'assets/knight/knight_run_spritesheet.png', { frameWidth: 16, frameHeight: 16 });

};

gameScene.create = function() {
	
    const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight:32 });
    const tileset = map.addTilesetImage('dungeon tiles', 'tiles');
    const layer3 = map.createLayer('Floors', tileset, 0,0)
    const layer2 = map.createLayer('Stairs', tileset, 0,0);
    const layer1 = map.createLayer('Walls/Holes', tileset, 0,0);
    
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setScale(2);
    
    
    this.anims.create({
        key:'run',
        frames: this.anims.generateFrameNumbers('run', { start: 0, end: 5 }),
        frameRate:10,
        repeat: 0
    });
    
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.collider(this.player, layer1);   

}


gameScene.update = function() {

	this.player.setCollideWorldBounds(true);
    
    if (this.cursors.right.isDown) {
        this.player.x += this.playerSpeed;
		this.player.anims.play('run', true);
    } else if (this.cursors.left.isDown) {
        this.player.x -= this.playerSpeed;
		this.player.anims.play('run', true);
    } else if (this.cursors.up.isDown) {
        this.player.y -= this.playerSpeed;
		this.player.anims.play('run', true);
    } else if (this.cursors.down.isDown) {
        this.player.y += this.playerSpeed;
		this.player.anims.play('run', true);
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
			debug: true
		},
	}
};

let game = new Phaser.Game(config);