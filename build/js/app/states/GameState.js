define([
    'phaser',
    'app/units/player'
], function (
    Phaser,
    Player
) { 
    'use strict';

    function GameState() {
        this.totalPlayers = 2;
        this.players = [];
        this.level = {
            tilemap: null,
            layer: null,
            gravity: 150
        };
    }
    
    GameState.prototype = {
        preload: function() {

        },
        create: function() {
            console.log(this.game);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.add.sprite(0,0, 'ship');
            // =====
            // BACKGROUND
            this.game.stage.backgroundColor = "#fff";
            this.level.tilemap = this.game.add.tilemap('level');
            this.level.tilemap.addTilesetImage('tiles32','tiles');
            this.level.tilemap.setCollisionBetween(1,45);
            //this.level.tilemap.setCollision(1);
            this.level.layer = this.level.tilemap.createLayer('layer');
            //this.level.layer2 = this.level.tilemap.createLayer('layer2');
            //this.level.layer.debug = true;
            this.level.layer.resizeWorld();
            this.game.physics.arcade.gravity.y = 1000;
            // =====
            
            // =====
            // INSTANCE PLAYERS
            for(var countPlayer = 1; countPlayer <= this.totalPlayers;countPlayer++){
                //console.log('here');
                var args = {
                    playerNumber : countPlayer,
                    position: {
                        x: 500 * countPlayer,
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
        },
        update: function(){
                //this.game.physics.arcade.collide(this.players[2].sprite, this.level.layer);
                //this.game.physics.arcade.collide(this.players[1].sprite, this.level.layer);
            for(var countPlayer = 1; countPlayer <= this.totalPlayers;countPlayer++){
                this.game.physics.arcade.collide(this.players[countPlayer].sprite, this.level.layer);
                this.players[countPlayer].checkGamepad();
            }
        }
    };
    
    return GameState;
});