export default class MainMenu extends Phaser.Scene {
	
	constructor (){
		super({key: 'MainMenu'});
	}
	
	preload() {
        this.load.audio('main', 'assets/sfx/main.m4a');
	}

	create(){
		this.music = this.sound.add('main');
		this.music.play();
		this.music.loop = true;

		this.add.text(this.game.config.width / 2, this.game.config.height / 5, 'CUM', {fontSize: 64, color: '#FFFFFF'}). setOrigin(0.5, 0.5).setAlign('center');
		
		this.createButton(this.game.config.height / 5 * 2, 'PULSA PARA EMPEZAR A JUGAR', 3);
	}
	
	createButton(y, texto, num){
		let boton = this.add.text(this.game.config.width / 2, y, texto , {fontSize: 48, color: '#FFFFFF'})
		. setOrigin(0.5, 0.5).setAlign('center')
		.setInteractive();
		
		this.input.on('pointerdown', () => {
			this.music.stop();
			this.scene.start('cinematicScene',{key:'start', next: 'MarioScene'});
		});
		return boton;
	}
	
}