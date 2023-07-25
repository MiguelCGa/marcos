
export default class GDScene extends Phaser.Scene {

    constructor() {
        super({key: 'GDScene'});
        this.cocodrile;
        this.enemies = [];
        this.counter = 0;
        this.generateTime = Math.floor(Math.random()*3000)+2000; // Genera un valor de tiempo entre 2-4
        this.enemyCounter = 0;
    }

    preload() {
        // Imagenes
        this.load.spritesheet('cocodrile2', 'assets/gdmarcos.png', {frameWidth: 478, frameHeight: 478});
        this.load.image('enemy2', 'assets/pinchos.jpg');
        this.load.image('floor', 'assets/floor.png');
        this.load.image('sky', 'assets/Betanzos.jpg');
        // Sonido
        this.load.audio('gdmusic', 'assets/sfx/gd.m4a');
    }

    create() {

        const width = this.scale.width;
        const height = this.scale.height;
 		
        // Fondo
        this.parallaxScrolling();


        // Animacion cocodrilo
        this.cocodrile2 = this.add.sprite(width/4, height*3/4, 'cocodrile2');
        this.cocodrile2.setScale(0.2);
        // Animacion de correr
        this.anims.create({
            key: 'run2',
            frames: this.anims.generateFrameNumbers('cocodrile2', {start: 0, end: 1}),
            frameRate: 5,
            repeat: -1
        });
        // Animacion de salto arriba
        this.anims.create({
            key: 'jump_up',
            frames: this.anims.generateFrameNumbers('cocodrile2', {start: 2, end: 2}),
            frameRate: 5,
            repeat: -1
        });
        // Animacion de salto abajo
        this.anims.create({
            key: 'jump_down',
            frames: this.anims.generateFrameNumbers('cocodrile2', {start: 3, end: 3}),
            frameRate: 5,
            repeat: -1
        });
        // Por predeterminado corre
        this.cocodrile2.play('run2');

        // Suelo
        this.floor = this.add.image(width/2, height, 'floor');

        // Le añadimos fisicas al cocodrilo y al suelo
        // Al cocodrilo le influye la gravedad
        this.physics.add.existing(this.cocodrile2);
        // Al suelo lo hacemos estatico
        this.physics.add.existing(this.floor).body.setAllowGravity(false).setImmovable(true);
        // Le añadimos colision entre cocodrilo y el suelo
        this.physics.add.collider(this.cocodrile2, this.floor);

        // Audio
        this.music = this.sound.add('gdmusic');
        this.music.play();
    }


    update(t, dt) {

        super.update(t, dt);

        // Input
        this.input.keyboard.once('keydown', () => {this.jump()});
        this.input.on('pointerdown', () => {this.jump()});

        // Contador para la generación de enemigos
        this.counter += dt;
        if (this.counter >= this.generateTime) {

            this.createEnemy(); // Crea enemigos

            this.generateTime = Math.floor(Math.random()*3000)+2000; // Genera un valor de tiempo entre 2-4
            this.counter = 0; // Resetea el contador
        }
        
        this.destroyEnemy();
        
        // Animaciones
        if (this.cocodrile2.body.velocity.y < 0) this.cocodrile2.play('jump_up');
        else if (this.cocodrile2.body.velocity.y > 0) {
            this.cocodrile2.play('jump_down');
        }
        else if (this.cocodrile2.anims.getName() !== 'run2') this.cocodrile2.play('run2');
    }

    jump() {
        if (this.cocodrile2.body.onFloor()){
            this.cocodrile2.body.setVelocityY(-Math.sqrt(this.physics.config.gravity.y*this.cocodrile2.height)); // salta 5xL
        }
    }

    createEnemy() {
        
        let enemy = this.add.image(this.scale.width, this.scale.height/4*3, 'enemy2');
        enemy.setScale(0.25);
        this.physics.add.existing(enemy);
        // Le añadimos colision entre cocodrilo y el suelo
        this.physics.add.collider(enemy, this.floor);
        this.physics.add.collider(enemy, this.cocodrile2, () => {
            this.music.stop();
            this.scene.start('cinematicScene', {key:'troliado', next:'cinematicScene', nextData:{key:'final', next: 'JaviMenu'}});
        });

        enemy.body.setVelocityX(-500);
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
                    this.music.stop();
                    this.scene.start('cinematicScene', {key:'gdado', next:'cinematicScene', nextData:{key:'final', next: 'JaviMenu'}});
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
        this.cocodrile2.setPosition(this.scale.width/4, this.scale.height*3/4);
        this.cocodrile2.body.setVelocityX(0);
    }
}