define([
    'phaser',
    'app/states/BootState',
    'app/states/PreloadState',
    'app/states/GameState'
], function (
    Phaser,
    BootState,
    PreloadState,
    GameState
) { 
    'use strict';

    function Game() {
        
    }
    
    Game.prototype = {
        start: function() {
            var game = new Phaser.Game(1280, 720, Phaser.AUTO, '');
            game.state.add('Boot', BootState);
            game.state.add('Preload', PreloadState);
            game.state.add('Game', GameState);
            game.state.start('Boot');
        }
    };
    
    return Game;
});

/*
function adjust() { 
    var divgame = document.getElementById("game");  
    divgame.style.width = window.innerWidth + "px"; 
    divgame.style.height = window.innerHeight + "px";
}
window.addEventListener('resize', function() {       
    adjust();   
});
var game = new Phaser.Game(640, 480, Phaser.AUTO, "game");
game.state.add("foo", function(game) {  
    this.preload = function() {     
        // game.load.image("07", "img/07.PNG"); 
    };  
    this.create = function() {      
        console.debug("Setup pointer and scale");       
        game.input.maxPointers = 1;     
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;        
        game.scale.pageAlignHorizontally = true;        
        game.scale.pageAlignVertically = true;      
        game.scale.setScreenSize(true);        
        game.scale.refresh();        
        adjust();   
    };
});
game.state.start("foo"); 
*/