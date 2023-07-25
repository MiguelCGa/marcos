import Gancho from './gancho.js';

export default class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'player');
		this.scene.add.existing(this);
		this.setOrigin(0,0);

		// Seguimiento cámara
        this.scene.cameras.main.startFollow(this, false, 1, 0, 0, 70);

        // Fisicas
		this.scene.physics.add.existing(this);
		this.speed = 100; // propiedad nuestra

		// Animacion
		this.scene.anims.create({
			key: 'idle',
			frames: this.scene.anims.generateFrameNames('player', {start:0, end:2}),
			frameRate: 7,
			repeat: -1
		});
		this.play('idle');

		// input
		this.cursorA = this.scene.input.keyboard.addKey('A');
		this.cursorD = this.scene.input.keyboard.addKey('D');
		this.cursorSPACE = this.scene.input.keyboard.addKey('SPACE');

		// cooldown
		this.ganchoCounter = 2000;
		this.ganchoCooldown = 2000;
	}
	
	preUpdate(t, dt){
		super.preUpdate(t, dt);
		
		// Movimiento
		if(this.cursorA.isDown && this.x > 0) {
			this.body.setVelocityX(-this.speed);
		}
		else if(this.cursorD.isDown && this.x < this.scene.levelSize) {
			this.body.setVelocityX(this.speed);
		}
		else this.body.setVelocityX(0);

		// Disparo
		if (Phaser.Input.Keyboard.JustDown(this.cursorSPACE)) this.shoot();

		// Disparo cooldown
		if (this.ganchoCounter < this.ganchoCooldown) 
			this.ganchoCounter += dt;
	}
	
	shoot() {
		if (this.ganchoCounter >= this.ganchoCooldown) {
			new Gancho(this.scene, this.x, this.y);
			this.ganchoCounter = 0;
		}
	}
}
