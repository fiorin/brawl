define([
    'phaser',
    'app/units/player'
], function (
    Phaser,
    Player
) { 
    'use strict';

    function GameState() {
        this.totalPlayers = 1;
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
            this.game.add.sprite(0,0, 'ship');
            this.game.add.sprite(20,20, 'brawl');
            // =====
            // BACKGROUND
            this.game.stage.backgroundColor = "#fff";
            this.level.tilemap = this.game.add.tilemap('level');
            this.level.tilemap.addTilesetImage('blocks','tiles');
            this.level.tilemap.setCollisionBetween(1,16);
            //this.level.tilemap.setCollision(1);
            this.level.layer = this.level.tilemap.createLayer('layer');
            //this.level.layer.debug = true;
            this.level.layer.resizeWorld();
            this.game.physics.arcade.gravity.y = 800;
            // =====
            
            // =====
            // INSTANCE PLAYERS
            for(var countPlayer = 1; countPlayer <= this.totalPlayers;countPlayer++){
                //console.log('here');
                var args = {
                    playerNumber : countPlayer,
                    position: {
                        x: 350 * countPlayer,
                        y: 100
                    }
                };
                this.players[countPlayer] = new Player(this.game,args);
                this.players[countPlayer].start();
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
                //this.game.physics.arcade.collide(this.players[2].sprite, this.level.layer);
                //this.game.physics.arcade.collide(this.players[1].sprite, this.level.layer);
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