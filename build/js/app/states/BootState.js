define([
    'phaser'
], function (
    Phaser
) { 
    'use strict';

    function BootState() {}
    
    BootState.prototype = {
        preload: function() {

        },
        create: function() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setShowAll();
            window.addEventListener('resize', function () {
                this.game.scale.refresh();
            });
            this.game.scale.refresh();
            this.game.state.start('Preload');
        }
    };
    
    return BootState;
});