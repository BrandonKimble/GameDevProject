

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
    this.minotaur;
    this.healthBar;
    this.health;

};

gameScene.preload = function() {

    this.load.tilemapTiledJSON('map', 'assets/tutorial_map.json');
    this.load.image('tiles', 'assets/Dungeon_Tileset.png');
    this.load.atlas('player', 'assets/knight.png', 'assets/knight.json');
    this.load.atlas('minotaur', 'assets/minotaur.png', 'assets/minotaur.json');
    this.load.image('vision', 'assets/vision.png');

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
    this.stoneFloor = map.createLayer('StoneFloor', tileset, 0,0)
    const dirtFloor = map.createLayer('DirtFloor', tileset, 0,0)
    const stairs = map.createLayer('Stairs', tileset, 0,0);
    const walls = map.createLayer('Walls', tileset, 0,0);
    const extra = map.createLayer('Extra', tileset, 0,0);
    
    walls.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(walls);
    
    
    this.player = this.matter.add.sprite(100, 125, 'player', 'knight_idle_anim_f1.png', { characters: characters.knight })
    .setScale(2)
    .play('player_idle')
    .setFixedRotation();
    
    this.minotaur = this.matter.add.sprite(400, 125, 'minotaur', 'tile000.png', { characters: characters.minotaur })
    .play('minotaur_idle')
    .setFixedRotation();
    
    // FOV
    this.vision = this.make.image({
        x: this.player.x,
        y: this.player.y,
        key: 'vision',
        add: false
    });
    
    this.vision.scale = 2;
    
    const width = this.scale.width
    const height = this.scale.height
    
    this.rt = this.make.renderTexture({
        width,
        height
    }, true);


    // Health Bar
    let healthBar = new HealthBar(gameScene, 20 , 200);
    
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        if ((bodyA.label == "player" && bodyB.label == "minotaur") || (bodyB.label == "minotaur" && bodyA.label == "player")) {
            let dead = healthBar.decrease(10);
            if (dead) this.scene.restart();       
        }
    });
    
    tutorialText = this.add.text(16, 16, 'Use the arrow keys to move around', { fontSize: '32px', fill: '#FFFFFF' });
    
}


gameScene.update = function() {
    
    // FOV
    this.enemyFollows(this.minotaur, this.player);

    this.rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
    this.rt.mask.invertAlpha = true;    
    
    this.rt.fill(0x000000, 1);
    this.rt.draw(this.stoneFloor);
    this.rt.setTint(0x0a2948);

    this.vision.x = this.player.x
    this.vision.y = this.player.y
    

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

gameScene.enemyFollows = function(from, to, speed = 1) {

    const direction = Math.atan((to.x - from.x) / (to.y - from.y));
    const speed2 = to.y >= from.y ? speed : -speed;

    return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
};


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