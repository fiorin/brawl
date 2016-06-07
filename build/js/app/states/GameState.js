define([
    'phaser',
    'app/units/player'
], function (
    Phaser,
    Player
) { 
    'use strict';

    function GameState() {
            
    }
    
    GameState.prototype = {
        preload: function() {
            this.game.info = {
                totalPlayers: 4
            }
            this.game.config = {
                players: [],
                groupColliders: {
                    players: [],
                    bullets: []
                },
                level: {
                    tilemap: null,
                    layer: null,
                    gravity: 128
                }
            };
        },
        create: function() {
            console.log('qhat');
            console.log(this);
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
            this.game.physics.arcade.gravity.y = 1000;
            // =====

            // =====
            // COLLIDERS
            this.game.config.groupColliders.players = this.game.add.group();
            this.game.config.groupColliders.bullets = this.game.add.group();
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
                    startPosition: {x:300,y:200}
                },
                p3: {
                    uiStatus: {x:10,y:660},
                    character: 'barts',
                    startPosition: {x:500,y:500}
                },
                p4: {
                    uiStatus:{x:1207,y:660},
                    character: 'barts',
                    startPosition: {x:900,y:600}
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
            //this.game.physics.arcade.collide(this.game.config.groupColliders.players);
            for(var countPlayer = 1; countPlayer <= this.game.info.totalPlayers;countPlayer++){
                //this.game.physics.arcade.collide(this.players[countPlayer].sprite, this.level.layer);
                this.game.config.players[countPlayer].checkGamepad();
            }
        },
        render: function(){
            return;
            this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
            this.game.debug.body(this.players[1].sprite);
        }
    };
    
    return GameState;
});