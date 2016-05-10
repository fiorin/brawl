define([

], function (

) { 
    'use strict';
    var multSpeedFloor = 1,
        multSpeedAir   = 1
    function Player(game){
        console.log(game);
        this.game = game;
        this.attr = {
            life: 100,
            speed: {
                _default: 150,
                floor: null,
                air: null
            }
        };
        this.sprite;
        this.gamepad;
    }
    
    Player.prototype = {
        start: function() {
            // =====
            // SPRITE
            this.sprite = this.game.add.sprite(500, 300, 'player');
            this.sprite.scale.setTo(1,1);
            this.sprite.anchor.setTo(0.5, 1);
                // =====
                // ANIMATIONS
                this.sprite.animations.add('still',Phaser.Animation.generateFrameNames('still/', 1, 4,'',1),4,false);
                this.sprite.animations.add('run',Phaser.Animation.generateFrameNames('run/', 1, 4,'',1),8,true,false);
                this.sprite.animations.add('jump',Phaser.Animation.generateFrameNames('jump/', 1, 2,'',1),2,true,false);
                this.sprite.animations.add('fall',Phaser.Animation.generateFrameNames('fall/', 1, 2,'',1),2,true,false);
                this.sprite.animations.add('shoot',Phaser.Animation.generateFrameNames('shoot/', 1, 4,'',1),12,false,false);
                this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('jump_shoot/', 1, 2,'',1),4,false,false);
                this.sprite.animations.add('block',Phaser.Animation.generateFrameNames('block/', 1, 1,'',1),4,false,false);
                this.sprite.animations.add('jump_block',Phaser.Animation.generateFrameNames('jump_block/', 1, 2,'',1),2,true,false);
                // =====

                // =====
                // ATTR DEFAULTS
                this.attr.speed.floor = this.attr.speed._default * multSpeedFloor;
                this.attr.speed.air = this.attr.speed._default * multSpeedAir;
                // =====

                // =====
                // PHYSICS
                this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
                this.sprite.enableBody = true;
                this.sprite.body.collideWorldBounds = true;
                this.sprite.body.bounce.set(0.05);    
                //this.sprite.body.velocity.y = this.game.state.level.gravity;
                // =====
            this.still();
            // =====

            // =====
            // GAMEPAD
            this.gamepad = this.game.input.gamepad.pad1;
            // =====
        },
        // =====
        // STATUS CHECK
        checkGamepad: function(){
            //console.log(this.sprite.body.blocked);
            //console.log(this.attr.speed.floor);
            if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                this.sprite.scale.x = 1;
                if(this.sprite.body.blocked.down){
                    this.run();
                    this.sprite.body.velocity.x = -this.attr.speed.floor;
                }else{
                    this.jump();
                    this.sprite.body.velocity.x = -this.attr.speed.air;
                }
            }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
                this.sprite.scale.x = -1;
                if(this.sprite.body.blocked.down){
                    this.run();
                    this.sprite.body.velocity.x = this.attr.speed.floor;
                }else{
                    this.jump();
                    this.sprite.body.velocity.x = this.attr.speed.air;
                }
            }else{
                this.sprite.body.velocity.x = 0;
                this.checkAnimation();
            }
            if(this.sprite.body.blocked.down && (this.gamepad.isDown(Phaser.Gamepad.XBOX360_A))){
                    this.jump();
                    this.sprite.body.velocity.y = -250; 
            }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1){

            }
            if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)){
                    this.shoot();
            }
            if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER)){
                    this.block();
            }
            //this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
            //this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
        },
        checkAnimation: function(){
            if(this.sprite.animations.currentAnim.loop || (!this.sprite.animations.currentAnim.loop && this.sprite.animations.currentAnim.isFinished)){
                if(this.sprite.body.blocked.down){
                    this.still();
                }else{
                    if(this.sprite.body.deltaY() < 0){
                        this.sprite.animations.play('jump');
                    }else{
                        this.sprite.animations.play('fall');
                    }
                }
            }
        },
        // =====

        // =====
        // MOVE
        checkMove: function(){

        },
        // =====

        // =====
        // ANIMATIONS
        still: function(){
            this.sprite.animations.play('still');
        },
        run: function(){
            this.sprite.animations.play('run');
        },
        runStop: function(){
            this.still();
        },
        jump: function(){
            //console.log(this.sprite.body.deltaY());
            if(this.sprite.body.deltaY() < 0){
                this.sprite.animations.play('jump');
            }else{
                this.sprite.animations.play('fall');
            }
        },
        shoot: function(){
            if(this.sprite.body.blocked.down){
                this.sprite.animations.play('shoot',false);
            }else{
                console.log(this.sprite.scale.x);
                this.sprite.animations.play('jump_shoot',false);
                this.sprite.body.velocity.x = (this.sprite.scale.x > 0) ? 100 : -100;
                if(this.sprite.body.velocity.y < 0)
                    this.sprite.body.velocity.y = 0
            }
            this.sprite.animations.currentAnim.onComplete.add(function(){
                this.checkAnimation();
            }.bind(this));
        },
        block: function(){
            if(this.sprite.body.blocked.down){
                this.sprite.animations.play('block',false);
            }else{
                this.sprite.animations.play('jump_block',false);
            }
            this.sprite.animations.currentAnim.onComplete.add(function(){
                this.checkAnimation();
            }.bind(this));
        }
        // =====
    };
    
    return Player;
});