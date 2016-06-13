define([
    'phaser',
    'app/units/player'
], function (
    Phaser,
    Player
) { 
    'use strict';
    var game;

    function GameState() {
    }
    
    GameState.prototype = {
        preload: function() {
            game = this.game;
            this.game.info = {
                totalPlayers: 2
            }
            this.game.config = {
                players: [],
                groupColliders: {
                    players: [],
                    bullets: []
                },
                emitters: {
                    blood: null
                },
                level: {
                    tilemap: null,
                    layer: null,
                    gravity: 128
                }
            };
        },
        create: function() {
            //console.log('qhat');
            //console.log(this);
            // =====
            // ENGINE
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setShowAll();
            // =====

            // =====
            // BACKGROUND
            this.game.add.sprite(0,0, 'bg');
            this.game.stage.backgroundColor = "#fff";
            // =====
            
            // =====
            // LEVEL
            this.game.config.level.tilemap = this.game.add.tilemap('level');
            this.game.config.level.tilemap.addTilesetImage('blocks','tiles');
            this.game.config.level.tilemap.setCollisionBetween(10,14);
            this.game.config.level.tilemap.setCollisionBetween(17,18);
            //this.level.tilemap.setCollision(1);
            this.game.config.level.layer = this.game.config.level.tilemap.createLayer('layer');
            //this.level.layer.debug = true;
            this.game.config.level.layer.resizeWorld();
            //this.game.physics.arcade.gravity.y = 1000;
            // =====

            // =====
            // COLLIDERS
            this.game.config.groupColliders.players = this.game.add.group();
            this.game.config.groupColliders.bullets = this.game.add.group();
            var bullets = this.game.config.groupColliders.bullets;
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            bullets.createMultiple(20, 'bullet');
            bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.destroy);
            bullets.callAll('anchor.setTo', 'anchor', .5, .5);
            bullets.setAll('checkWorldBounds', true);
            // =====

            // =====
            // EMMITERS
            this.game.config.emitters.blood = this.game.add.emitter(0, 0, 300);
            var emitterBlood = this.game.config.emitters.blood;
            emitterBlood.makeParticles('blood');
            emitterBlood.minParticleSpeed.setTo(-100, -100);
            emitterBlood.maxParticleSpeed.setTo( 100,  100);
            emitterBlood.setScale(0.8, 1, 0.8, 1, 600, Phaser.Easing.Quintic.Out);
            emitterBlood.gravity =200;
            this.game.config.emitters.dust = this.game.add.emitter(0, 0, 300);
            var emitterDust = this.game.config.emitters.dust;
            emitterDust.makeParticles('dust');
            emitterDust.minParticleSpeed.setTo(-50, -50);
            emitterDust.maxParticleSpeed.setTo( 50,  50);
            emitterDust.setScale(0.5, 1, 0.5, 1, 600, Phaser.Easing.Quintic.Out);
            emitterDust.gravity =-150;
            // =====

            // =====
            // INSTANCE PLAYERS
            var playersConfig = {
                p1: {
                    uiStatus: {x:10,y:10},
                    character: 'barts',
                    startPosition: {x:100,y:400}
                },
                p2: {
                    uiStatus: {x:1207,y:10},
                    character: 'barts',
                    startPosition: {x:900,y:200}
                },
                p3: {
                    uiStatus: {x:10,y:660},
                    character: 'barts',
                    startPosition: {x:500,y:500}
                },
                p4: {
                    uiStatus:{x:1207,y:660},
                    character: 'barts',
                    startPosition: {x:1100,y:600}
                }
            }
            for(var countPlayer = 1; countPlayer <= this.game.info.totalPlayers;countPlayer++){
                //console.log('here');
                var currentPlayer = playersConfig['p'+countPlayer];
                var args = {
                    playerNumber : countPlayer,
                    position: {
                        x: currentPlayer.startPosition.x,
                        y: currentPlayer.startPosition.y
                    },
                    character: currentPlayer.character
                };
                this.game.config.players[countPlayer] = new Player(this.game,args);
                this.game.config.players[countPlayer].start();
            }
            //console.log(this.players);
            // =====
            
            // =====
            // UI
            this.game.add.sprite(600,20, 'brawl');
            for(var countPlayer = 1; countPlayer <= this.game.info.totalPlayers;countPlayer++){
                currentPlayer = playersConfig['p'+countPlayer];
                this.game.add.sprite(currentPlayer.uiStatus.x,currentPlayer.uiStatus.y, 'status');
                this.game.add.sprite(currentPlayer.uiStatus.x+8,currentPlayer.uiStatus.y+9, this.game.config.players[countPlayer]._default.avatar);
            }
            // =====

            // =====
            // GAMEPAD SUPPORT
            this.game.input.gamepad.start();
            // =====
            this.game.time.advancedTiming = true;
        },
        update: function(){
            this.game.physics.arcade.collide(this.game.config.groupColliders.players, this.game.config.level.layer);
            this.game.physics.arcade.overlap(this.game.config.groupColliders.players);
            this.game.physics.arcade.collide(this.game.config.groupColliders.bullets, this.game.config.level.layer, this.shootGround);
            //this.game.physics.arcade.collide(this.game.config.groupColliders.bullets, this.game.config.groupColliders.players);
            this.game.physics.arcade.collide(this.game.config.groupColliders.bullets, this.game.config.groupColliders.players, this.shootPlayer, null, this);
            //this.game.physics.arcade.collide(this.game.config.groupColliders.players);
            for(var countPlayer = 1; countPlayer <= this.game.info.totalPlayers;countPlayer++){
                //this.game.physics.arcade.collide(this.players[countPlayer].sprite, this.level.layer);
                this.game.config.players[countPlayer].checkGamepad();
            }
        },
        render: function(){
            this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
            //this.game.debug.body(this.game.config.players[1].sprite);
        },
        destroy: function(object){
            object.kill();
        },
        overlap: function(object){
            //console.log(object);
            console.log('objeto');
        },
        shootGround: function(bullet,ground){
            console.log(ground);
            console.log('vvvv');
            var emitter = bullet.config.owner.game.config.emitters.dust;
            emitter.x = bullet.body.x + (bullet.width/2);
            emitter.y = bullet.body.y + (bullet.height/2);
            emitter.start(true, 250, null, 4);
            bullet.kill();
        },
        shootPlayer: function(bullet,player){
            bullet.body.velocity.x = 0;
            if(bullet.body.touching.right && player.body.touching.left){
                player._config.owner.bleed(.2);
            }else if(bullet.body.touching.left && player.body.touching.right){
                player._config.owner.bleed(.8);
            }
            this.destroy(bullet);
        }
    };
    
    return GameState;
});