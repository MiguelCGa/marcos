
export default class MarioScene extends Phaser.Scene {

    constructor() {
        super({key: 'MarioScene'});
        this.cocodrile;
        this.enemies = [];
        this.counter = 0;
        this.generateTime = Math.floor(Math.random()*3000)+2000; // Genera un valor de tiempo entre 2-4
        this.enemyCounter = 0;
    }

    preload() {
        // Imagenes
        this.load.spritesheet('cocodrile', 'assets/mario.png', {frameWidth: 480, frameHeight: 640});
        this.load.image('enemy', 'assets/goomba.png');
        this.load.image('floor', 'assets/floor.png');
        this.load.image('sky', 'assets/Betanzos.jpg');
        this.load.image('left', 'assets/left.png');
        this.load.image('right', 'assets/right.png');
        this.load.image('up', 'assets/up.png');
        // Sonido
        this.load.audio('jumpSound', 'assets/sfx/C_MELMAN.mp3')
        this.load.audio('impactSound', 'assets/sfx/Saul Goodman dice XD.mp3')
    }

    create() {

        const width = this.scale.width;
        const height = this.scale.height;
 		
        // Fondo
        this.parallaxScrolling();

        // Animacion cocodrilo
        this.cocodrile = this.add.sprite(width/4, height*2/4, 'cocodrile');
        this.cocodrile.setScale(0.4);
        // Animacion de correr
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('cocodrile', {start: 0, end: 1}),
            frameRate: 5,
            repeat: -1
        });
        // Por predeterminado corre
        this.cocodrile.play('run');

        // Suelo
        this.floor = this.add.image(width/2, height, 'floor');

        // Le añadimos fisicas al cocodrilo y al suelo
        // Al cocodrilo le influye la gravedad
        this.physics.add.existing(this.cocodrile);
        // Al suelo lo hacemos estatico
        this.physics.add.existing(this.floor).body.setAllowGravity(false).setImmovable(true);
        // Le añadimos colision entre cocodrilo y el suelo
        this.physics.add.collider(this.cocodrile, this.floor);

        // Audio
        this.jumpSound = this.sound.add('jumpSound');
        this.impactSound = this.sound.add('impactSound');

        this.way = 0;

        // Input
        this.input.keyboard.on('keydown-A', () => {this.enemies.forEach(enemy => {
        	enemy.setX(enemy.x + 30);
        });});
        this.input.keyboard.on('keydown-D', () => {this.enemies.forEach(enemy => {
        	enemy.setX(enemy.x - 30);
        });});

        this.add.sprite(width/4, height/4, 'left').setInteractive().on('pointerdown', () => {
			this.way = 1;
        }).on('pointerup', () => {
			this.way = 0;
        });
        this.add.sprite(2*width/4, height/4, 'right').setInteractive().on('pointerdown', () => {
			this.way = -1;
        }).on('pointerup', () => {
			this.way = 0;
        });
        this.add.sprite(width/4*3, height/4, 'up').setScale(0.3).setInteractive().on('pointerdown', () => {
			this.jump();
        });
    }


    update(t, dt) {

        super.update(t, dt);


    	this.enemies.forEach(enemy => {
        	enemy.setX(enemy.x + 30 * this.way);
        });

        // Contador para la generación de enemigos
        this.counter += dt;
        if (this.counter >= this.generateTime) {

            this.createEnemy(); // Crea enemigos

            this.generateTime = Math.floor(Math.random()*3000)+2000; // Genera un valor de tiempo entre 2-4
            this.counter = 0; // Resetea el contador
        }
        
        this.destroyEnemy();
        
        // Animaciones
        if (this.cocodrile.body.velocity.y < 0) {}//this.cocodrile.play('jump_up');
        else if (this.cocodrile.body.velocity.y > 0) {
            //this.cocodrile.play('jump_down');
            //this.jumpSound.stop();
        }
        else if (this.cocodrile.anims.getName() !== 'run') this.cocodrile.play('run');
    }

    jump() {
        if (this.cocodrile.body.onFloor()){
            this.jumpSound.play();
            this.cocodrile.body.setVelocityY(-Math.sqrt(this.physics.config.gravity.y*this.cocodrile.height)); // salta 5xL
        }
    }

    createEnemy() {
        
        let enemy = this.add.image(this.scale.width, this.scale.height/4*3, 'enemy');
        enemy.setScale(0.25);
        this.physics.add.existing(enemy);
        // Le añadimos colision entre cocodrilo y el suelo
        this.physics.add.collider(enemy, this.floor);
        this.physics.add.collider(enemy, this.cocodrile, () => {
        	if (enemy.x - this.cocodrile.x < enemy.width && enemy.x - this.cocodrile.x > -enemy.width
        		&& this.cocodrile.y < enemy.y - enemy.height/3) {
        		enemy.destroy();
        	}

        	else {
        		   this.scene.start('cinematicScene', {key:'muelto', next:'cinematicScene', nextData:{key:'gd', next: 'GDScene'}});
        	}
        });

        this.enemies.push(enemy);
    }

    destroyEnemy() {
        for (let i = 0; i < this.enemies.length; ++i) {
            if (this.enemies[i].x <= 0) {
                this.enemies[i].destroy();
                this.enemies.splice(i, 1);
                this.enemyCounter++;
                if (this.enemyCounter >= 4) {
                    // pausar jogo
                    this.scene.start('cinematicScene', {key:'marieado', next:'cinematicScene', nextData:{key:'gd', next: 'GDScene'}});
                }
            }
        }
    }

    parallaxScrolling() {
        this.sky = this.add.image(0, 0, 'sky').setOrigin(0,0).setScale(2);
    }

    restart(){
        // Elimina todos los enemigos en escena
        for (let i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].destroy();
        }
        this.enemies = [];
        // Resetea la posicion del Crocodelo
        this.cocodrile.setPosition(this.scale.width/4, this.scale.height*3/4);
        this.cocodrile.body.setVelocityX(0);
        this.impactSound.stop();
    }
}