define([
    'phaser'
], function (
    Phaser
) { 
    'use strict';

    function PreloadState() {}
    
    PreloadState.prototype = {
        preload: function() {
            this.game.load.atlasJSONHash('player', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
            this.game.load.tilemap('level','assets/levels/map.json',null,Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tiles','assets/levels/tiles.png');
            this.game.load.image('ship','assets/levels/ship.jpg');
        },
        create: function() {
            this.game.state.start('Game');
        }
    };
    
    return PreloadState;
});