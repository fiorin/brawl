define([
    'phaser'
], function (
    Phaser
) { 
    'use strict';

    function PreloadState() {}
    
    PreloadState.prototype = {
        preload: function() {
            //this.game.load.atlasJSONHash('player', 'assets/sprites/barts.png', 'assets/sprites/barts.json');
            this.game.load.atlasJSONHash('player', 'assets/sprites/barts.png', 'assets/sprites/barts.json');
            this.game.load.tilemap('level','assets/levels/map.json',null,Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tiles','assets/levels/blocks.jpg');
            this.game.load.image('ship','assets/levels/ship.jpg');
        },
        create: function() {
            this.game.state.start('Game');
        }
    };
    
    return PreloadState;
});