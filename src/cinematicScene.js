
/**
 * Escena de Cinemática.
 * @extends Phaser.Scene
 */
export default class CinematicScene extends Phaser.Scene {
    constructor() {
        super({ key: 'cinematicScene' });
    }
    
	init(data){
        this.cinematicKey = data.key;
        this.nextScene = data.next;
        this.nextData = data.nextData;
        console.log(this.nextScene, this.nextData);
	}

    preload(){
        // Vídeo
        this.load.video(this.cinematicKey, ['assets/cinematic/' + this.cinematicKey + '.mp4', 'assets/cinematic/' + this.cinematicKey + '.mov']);
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Reproducimos la cinemática
        this.cinematic = this.add.video(width / 2, height / 7 * 3, this.cinematicKey).setScale(0.6, 0.6);
        this.cinematic.on('complete', ()=>{this.goToNextScene();});
        this.cinematic.play();

        //this.input.keyboard.once('keydown-ESC', () => {this.goToNextScene();});
    }

    goToNextScene() {
        if (this.nextScene) this.scene.start(this.nextScene, this.nextData);
    }
}