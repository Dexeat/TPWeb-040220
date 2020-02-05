var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var saut;
var sauvesaut;

function init(){
 	var platforms;
	var player;
	var cursors; 
	var stars;
	var scoreText;
	var bomb;
}

function preload(){
	this.load.image('background','assets/sky.png');	
	this.load.image('fond','assets/fond.png');
	this.load.image('etoile','Assets/Sprites/08-Box/idle.png');
	this.load.image('sol','Assets/sol.png');
	this.load.spritesheet('bomb','Assets/Sprites/09-Bomb/Bomb On (52x56).png',{frameWidth: 16,frameHeight: 21});
	this.load.spritesheet('perso','Assets/Sprites/01-King Human/Idle (78x58).png',{frameWidth: 38, frameHeight: 28});
	this.load.spritesheet('persoR','Assets/Sprites/01-King Human/run.png',{frameWidth: 38, frameHeight: 29});
}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,568,'sol').setScale(2).refreshBody();
	platforms.create(600,400,'sol');
	platforms.create(50,250,'sol');
	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('persoR', {start: 0, end: 8}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: this.anims.generateFrameNumbers('perso', {start: 0,end: 10}),
		frameRate: 10
	});
	
	this.anims.create({
		key:'bombA',
		frames: this.anims.generateFrameNumbers('bomb', {start: 0,end: 3}),
		frameRate: 10,
		repeat: -1
	})

	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	//saut
	if(cursors.up.isUp && player.body.touching.down){
		saut = 2
	}
	if(cursors.up.isDown && sauvesaut == 1 && saut>0){
		sauvesaut = 0;
		saut -=1;
		player.setVelocityY(-340);
	}
	if(cursors.up.isUp){
		sauvesaut = 1;
	}


}
function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.anims.play('bombA',true);
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}