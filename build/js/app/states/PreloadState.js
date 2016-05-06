define([
    'phaser'
], function (
    Phaser
) { 
    'use strict';

    function PreloadState() {}
    
    PreloadState.prototype = {
        preload: function() {
            this.game.load.atlasJSONHash('player', 'assets/sprite/sprite.png', 'assets/sprite/sprite.json');
        },
        create: function() {
            this.game.state.start('Game');
        }
    };
    
    return PreloadState;
});