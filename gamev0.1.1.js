let gameScene = new Phaser.Scene('Game');


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
    }

}





gameScene.init = function() {

    this.player;
    this.enemy;
    this.direction;
    this.healthBar;
    this.health;

};

gameScene.preload = function() {

    this.load.tilemapTiledJSON('map', 'assets/tutorial_map.json');
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
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    const stoneFloor = map.createLayer('StoneFloor', tileset, 0,0)
    const dirtFloor = map.createLayer('DirtFloor', tileset, 0,0)
    const stairs = map.createLayer('Stairs', tileset, 0,0);
    const walls = map.createLayer('Walls', tileset, 0,0);
    const extra = map.createLayer('Extra', tileset, 0,0);


    const width = this.scale.width;
	const height = this.scale.height;

    const rt = this.make.renderTexture({
		width,
		height
	}, true);

    rt.fill(0x000000, 1);

	// draw the floorLayer into it
	rt.draw(stoneFloor);

	// set a dark blue tint
	rt.setTint(0x0a2948);
        
    this.player = this.physics.add.sprite(100, 125, 'player');
    this.player.setScale(2);

    this.vision = this.make.image({
		x: this.player.x,
		y: this.player.y,
		key: 'vision',
		add: false
	});
	this.vision.scale = 2.5;

	rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
	rt.mask.invertAlpha = true;
    
    this.physics.add.collider(this.player, walls);
    walls.setCollisionByProperty({ collides: true });
    
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    walls.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    let healthBar = new HealthBar(gameScene, 20 , 200);
    this.enemy = this.physics.add.sprite(400, 125, 'minotaur_idle');
    let myScene = this.scene
    this.physics.add.collider(this.player, this.enemy, function(){
        let dead = healthBar.decrease(10);
        if(dead){
            myScene.restart();       
        }
    });

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
 
    this.cursors = this.input.keyboard.createCursorKeys();


    tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around', {fontSize: '32px', fill: '#FFFFFF' });
}


gameScene.update = function() {
    
    this.enemyFollows();
	this.player.setCollideWorldBounds(true);
    //this.enemy.anims.play('minotaur', true);
    this.player.anims.play('idle_right', true);

    if (this.vision)
	{
		this.vision.x = this.player.x
		this.vision.y = this.player.y
	}
    
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
        this.player.setVelocity(0, 0);
        if (this.direction == 1) {
            this.player.anims.play('idle_right', true);
        } else if (this.direction == -1) {
            this.player.anims.play('idle_left', true)
        }
    };
};

gameScene.enemyFollows = function() {
    this.physics.moveToObject(this.enemy, this.player, 20);
}

const config = {
	type: Phaser.AUTO,
	width: 1650,
	height: 225,
	scene: gameScene,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		},
	}
};

let game = new Phaser.Game(config);