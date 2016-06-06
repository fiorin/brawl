define([
    'phaser',
    'app/units/player'
], function (
    Phaser,
    Player
) { 
    'use strict';

    function GameState() {
        this.totalPlayers = 4;
        this.players = [];
        this.level = {
            tilemap: null,
            layer: null,
            gravity: 128
        };
    }
    
    GameState.prototype = {
        preload: function() {

        },
        create: function() {
            console.log(this.game);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.add.sprite(0,0, 'bg');
            this.game.add.sprite(600,20, 'brawl');
            // =====
            // BACKGROUND
            this.game.stage.backgroundColor = "#fff";
            this.level.tilemap = this.game.add.tilemap('level');
            this.level.tilemap.addTilesetImage('blocks','tiles');
            this.level.tilemap.setCollisionBetween(10,14);
            this.level.tilemap.setCollisionBetween(17,18);
            //this.level.tilemap.setCollision(1);
            this.level.layer = this.level.tilemap.createLayer('layer');
            //this.level.layer.debug = true;
            this.level.layer.resizeWorld();
            this.game.physics.arcade.gravity.y = 1000;
            // =====
            
            // =====
            // INSTANCE PLAYERS
            var playersConfig = {
                p1: {
                    uiStatus: {x:10,y:10},
                    character: 'drake',
                    startPosition: {x:100,y:400}
                },
                p2: {
                    uiStatus: {x:1207,y:10},
                    character: 'barts',
                    startPosition: {x:300,y:200}
                },
                p3: {
                    uiStatus: {x:10,y:660},
                    character: 'drake',
                    startPosition: {x:500,y:500}
                },
                p4: {
                    uiStatus:{x:1207,y:660},
                    character: 'drake',
                    startPosition: {x:900,y:600}
                }
            }
            for(var countPlayer = 1; countPlayer <= this.totalPlayers;countPlayer++){
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
                this.game.add.sprite(currentPlayer.uiStatus.x,currentPlayer.uiStatus.y, 'status');
                this.players[countPlayer] = new Player(this.game,args);
                this.players[countPlayer].start();
                this.game.add.sprite(currentPlayer.uiStatus.x+8,currentPlayer.uiStatus.y+9, this.players[countPlayer]._default.avatar);
            }
            //console.log(this.players);
            // =====

            // =====
            // GAMEPAD SUPPORT
            this.game.input.gamepad.start();
            // =====
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setShowAll();
            this.game.time.advancedTiming = true;
        },
        update: function(){
            for(var countPlayer = 1; countPlayer <= this.totalPlayers;countPlayer++){
                this.game.physics.arcade.collide(this.players[countPlayer].sprite, this.level.layer);
                this.players[countPlayer].checkGamepad();
            }
        },
        render: function(){
            this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
            this.game.debug.body(this.players[1].sprite);
        }
    };
    
    return GameState;
});