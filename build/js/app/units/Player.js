define([

], function (

) { 
	'use strict';

    function Player(game){
    	this.game = game;
    	this.life;
    	this.sprite;
    }
    
    Player.prototype = {
        start: function() {
        	console.log(this.game);
            this.sprite = this.game.add.sprite(0, 180, 'player');
   			this.sprite.scale.setTo(0.5,0.5);
        	console.log('aqui');
        	console.log(Phaser.Animation.generateFrameNames('run/', 1, 4, '', 4));
   			this.sprite.animations.add('run',Phaser.Animation.generateFrameNames('', 0, 3,'',1),4,true,false);
   			this.sprite.animations.add('still',Phaser.Animation.generateFrameNames('', 4, 7,'',1),4,true);
   			console.log(this.sprite.animations);
    		this.sprite.animations.play('run');
    		this.sprite.animations.play('still');
        }
    };
    
    return Player;
});