export default class JaviMenu extends Phaser.Scene {
	
	constructor (){
		super({key: 'JaviMenu'});
	}

	preload() {
		this.load.image('javi', 'assets/javi.png');
	}

	create(){
		this.add.image(this.scale.width / 2, this.scale.height / 2, 'javi');
	}	
}