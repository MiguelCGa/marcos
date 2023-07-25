import Player from './player.js';
import Pompa from './pompa.js';
export default class GameScene extends Phaser.Scene {

	constructor (){
		super({key: 'GameScene'});
		this.pompas = [];
		this.lives = 3;
	}
	
	init(obj){
		this.numPompas = obj.pompas;
	}
	preload() {
		this.load.spritesheet('player', 'assets/player.png', {frameWidth: 16, frameHeight: 16});
		this.load.image('pompa1', 'assets/pompa1.png');
		this.load.image('pompa2', 'assets/pompa2.png');
		this.load.image('pompa3', 'assets/pompa3.png');
		this.load.image('gancho', 'assets/gancho.png');
	}
	
	create(){
		const width = this.scale.width;
		const height = this.scale.height;
		
		this.levelSize = width*2;
		this.add.rectangle(0, 0, this.levelSize, height, 0xffffff).setOrigin(0,0);

		this.player = new Player(this, width / 2, height - 40);

		for (let i = 0; i < this.numPompas; i++) {
			let pom = new Pompa(this);
			this.physics.add.collider(this.player, pom, () => {
				this.restart();
			})
			this.pompas.push(pom);
		}


		// UI  Vidas
		this.ui = this.add.text(0, 0, 'Vidas: ' + this.lives).setOrigin(0, 0).setScrollFactor(0, 0);
	}

	restart() {
		this.lives--;
		if (this.lives <= 0) {
			this.lives = 3;
			this.scene.start('EndMenu', {win: false});
		}
		else {
			for (let i = 0; i < this.pompas.length; i++) {
				this.pompas[i].destroy();
			}
			this.player.destroy();
			this.ui.destroy();
			this.create();	
		}
	}
	
	destroyPompa(pompa) {
		this.numPompas--;
		pompa.destroy();
		if (this.numPompas <= 0) this.scene.start('EndMenu', {win: true});
	}
}
