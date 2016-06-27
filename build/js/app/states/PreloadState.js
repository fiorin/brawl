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
            this.game.load.atlasJSONHash('drake', 'assets/sprites/drake.png', 'assets/sprites/drake.json');
            this.game.load.atlasJSONHash('barts', 'assets/sprites/barts.png', 'assets/sprites/barts.json');
            this.game.load.atlasJSONHash('bonny', 'assets/sprites/bonny.png', 'assets/sprites/bonny.json');
            this.game.load.tilemap('level','assets/levels/map.json',null,Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tiles','assets/sprites/blocks.png');
            this.game.load.image('bg','assets/sprites/bg.jpg');
            this.game.load.image('status','assets/sprites/status.png');
            this.game.load.image('bullet','assets/sprites/bullet.png');
            this.game.load.spritesheet('particles','assets/sprites/particles.png',32,32);
            this.game.load.spritesheet('controller','assets/sprites/controller.png',64,64);
            this.game.load.image('avatar','assets/sprites/bonny-avatar.png');
            this.game.load.image('selector','assets/sprites/selector.png');
        },
        create: function() {
            this.game.state.start('CharacterState');
        }
    };
    
    return PreloadState;
});