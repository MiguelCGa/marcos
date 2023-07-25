import MainMenu from './mainMenu.js';
import GameScene from './gameScene.js';
import JaviMenu from './javiMenu.js';
import MarioScene from './marioScene.js';
import GDScene from './gdScene.js';
import CinematicScene from './cinematicScene.js';

window.onload = ()=>{

    const config = {
        type: Phaser.AUTO,
        scale: {
            width: 1920,
            height: 1080,
            autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY
        },
		physics: {
			default: 'arcade',
			arcade: {
				gravity: {y: 2000}, 
				debug: false
			}
		},
		
        backgroundColor: '#000000',
        pixelArt: true,
        scene: [MainMenu, MarioScene, GDScene,  JaviMenu, CinematicScene]
    };

    new Phaser.Game(config);
};