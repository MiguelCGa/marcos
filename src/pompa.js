
export default class Pompa extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		let type = 'pompa' + Math.floor(Math.random() * 3 + 1);
		let rX = Math.floor(Math.random() * scene.levelSize);
		let rY = Math.floor(Math.random() * scene.scale.height);
		super(scene, rX, rY, type);
		this.scene.add.existing(this);
		this.setOrigin(0, 0);

		// Direccion
		this.dirX = Math.random()*2 - 1;
		this.dirY = Math.random()*2 - 1;

        // Fisicas
		this.scene.physics.add.existing(this);
		this.speed = 50; // propiedad nuestra
	
		// Movimiento
		this.body.setVelocityX(this.dirX * this.speed);
		this.body.setVelocityY(this.dirY * this.speed);	
	}
	
	preUpdate(t, dt){
		super.preUpdate(t, dt);
		// Colision con paredes laterales
		if ((this.x < 0 && this.dirX < 0) || 
			(this.x + this.width > this.scene.levelSize && this.dirX > 0)) {
			this.dirX = -this.dirX;
			this.body.setVelocityX(this.dirX * this.speed);
		}
		
		// Colision con paredes verticales
		if ((this.y  < 0 && this.dirY < 0) || 
			(this.y + this.height > this.scene.scale.height && this.dirY > 0)) {
			this.dirY = -this.dirY;
			this.body.setVelocityY(this.dirY * this.speed);
		}
	}
}
