define([
    'phaser',
    'app/units/player'
], function (
    Phaser,
    Player
) { 
    'use strict';

    function GameState() {
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
            // =====
            // BACKGROUND
            this.game.stage.backgroundColor = "#fff";
            this.level.tilemap = this.game.add.tilemap('level');
            this.level.tilemap.addTilesetImage('tiles','tiles');
            this.level.tilemap.setCollisionBetween(1,8);
            this.level.layer = this.level.tilemap.createLayer('layer1');
            //this.level.layer.debug = true;
            this.level.layer.resizeWorld();
            this.game.physics.arcade.gravity.y = 250;
            // =====
            
            // =====
            // INSTANCE PLAYERS
            this.totalPlayers = 1;
            this.players[1] = new Player(this.game);
            this.players[1].start();
            console.log(this.players[1]);
            // =====

            // =====
            // GAMEPAD SUPPORT
            this.game.input.gamepad.start();
            // =====
        },
        update: function(){
            this.game.physics.arcade.collide(this.players[1].sprite, this.level.layer);
            this.players[1].checkGamepad();
        }
    };
    
    return GameState;
});