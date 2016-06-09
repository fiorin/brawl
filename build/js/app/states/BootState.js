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
            //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.setShowAll();
           // window.addEventListener('resize', function () {
            //    this.game.scale.refresh();
            //}.bind(this));
           // this.game.scale.refresh();
            //console.log('scale');
            //console.log(this.game.scale);
            //this.game.stage.smoothed = false;
            this.game.state.start('Preload');
        }
    };
    
    return BootState;
});