
export default class Gancho extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'gancho');
		this.scene.add.existing(this);
		this.setOrigin(0,0);

        // Fisicas
		this.scene.physics.add.existing(this);
		this.speed = this.scene.scale.height; // propiedad nuestra
	
		// Movimiento
		this.body.setVelocityY(-this.speed);

		// Contador
		this.counter = 0;
		this.counterLimit = 4000;

		// Colision
		this.scene.pompas.forEach(pompa => {
			this.scene.physics.add.collider(this, pompa, () => {
				this.scene.destroyPompa(pompa);
				this.destroy();
			});
		});
	}
	
	preUpdate(t, dt){
		super.preUpdate(t, dt);

		// Limite altura
		if (this.body.velocity != 0 && this.y <= 0) this.body.setVelocityY(0);

		// Contador
		this.counter += dt;
		if (this.counter >= this.counterLimit) {
			this.destroy();
		}
	}
}
