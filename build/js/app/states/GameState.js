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
    }
    
    GameState.prototype = {
        preload: function() {

        },
        create: function() {
            console.log(this.game);
            this.totalPlayers = 1;
            this.players[1] = new Player(this.game);
            this.players[1].start();
        }
    };
    
    return GameState;
});