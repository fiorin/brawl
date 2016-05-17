define([
    'app/units/gun'
], function (
    Gun
) { 
    'use strict';
    var multSpeedFloor = 1,
        multSpeedAir   = 1
    function Player(game,args){
        this._default = {
            speed: 250,
            life: 100,
            sprite: 'player',
            position: {
                x: args.position.x,
                y: args.position.y
            }
        };
        this.playerNumber = args.playerNumber;
        this.game = game;
        this.current = {
            life: null,
            speed: {
                floor: null,
                air: null
            },
            gun: null
        };
        this.sprite;
        this.gamepad;
    }
    
    Player.prototype = {
        start: function() {
            // =====
            // SPRITE
            this.sprite = this.game.add.sprite(this._default.position.x, this._default.position.x, this._default.sprite);
            this.sprite.scale.setTo(1,1);
            this.sprite.anchor.setTo(0.5, 1);
                // =====
                // ANIMATIONS
                this.sprite.animations.add('still',Phaser.Animation.generateFrameNames('still/', 1, 4,'',1),4,false);
                this.sprite.animations.add('run',Phaser.Animation.generateFrameNames('run/', 1, 4,'',1),8,true,false);
                this.sprite.animations.add('jump',Phaser.Animation.generateFrameNames('jump/', 1, 2,'',1),2,true,false);
                this.sprite.animations.add('fall',Phaser.Animation.generateFrameNames('fall/', 1, 2,'',1),2,true,false);
                this.sprite.animations.add('shoot',Phaser.Animation.generateFrameNames('shoot/', 1, 2,'',1),4,false,false);
                //this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('jump_shoot/', 1, 2,'',1),4,false,false);
                this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('shoot/', 1, 2,'',1),4,false,false);
                this.sprite.animations.add('block',Phaser.Animation.generateFrameNames('block/', 1, 1,'',1),4,false,false);
                //this.sprite.animations.add('jump_block',Phaser.Animation.generateFrameNames('jump_block/', 1, 2,'',1),2,true,false);
                this.sprite.animations.add('jump_block',Phaser.Animation.generateFrameNames('block/', 1, 2,'',1),4,true,false);
                // =====

                // =====
                // PHYSICS
                this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
                this.sprite.enableBody = true;
                this.sprite.body.collideWorldBounds = true;
                this.sprite.body.bounce.set(0.05); 
                this.sprite.body.setSize(this.sprite.body.width * .4, this.sprite.body.height * .94, 0, this.sprite.body.height * -.03);
                this.sprite.body.velocity.y = this.game.state.callbackContext.level.gravity;
                // =====

            this.still();
            // =====

            // =====
            // ATTR DEFAULTS
            this.current.speed.floor = this._default.speed * multSpeedFloor;
            this.current.speed.air = this._default.speed * multSpeedAir;
            this.current.gun = new Gun(this.game);
            this.current.gun.start();
            // =====

            // =====
            // GAMEPAD
            if(this.playerNumber == 1){
                this.gamepad = this.game.input.gamepad.pad1;
            }else if(this.playerNumber == 2){
                this.gamepad = this.game.input.gamepad.pad2;
            }
            // =====
        },
        // =====
        // STATUS CHECK
        checkGamepad: function(){
            //console.log(this.sprite.body.blocked);
            //console.log(this.current.speed.floor);
            if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                this.sprite.scale.x = 1;
                if(this.sprite.body.blocked.down){
                    this.run();
                    this.sprite.body.velocity.x = -this.current.speed.floor;
                }else{
                    this.jump();
                    this.sprite.body.velocity.x = -this.current.speed.air;
                }
            }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
                this.sprite.scale.x = -1;
                if(this.sprite.body.blocked.down){
                    this.run();
                    this.sprite.body.velocity.x = this.current.speed.floor;
                }else{
                    this.jump();
                    this.sprite.body.velocity.x = this.current.speed.air;
                }
            }else{
                this.sprite.body.velocity.x = 0;
                this.checkAnimation();
            }
            if(this.sprite.body.blocked.down && (this.gamepad.isDown(Phaser.Gamepad.XBOX360_A))){
                    this.jump();
                    this.sprite.body.velocity.y = -600; 
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
        // ACTIONS
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
            if(this.current.gun.getReady() < this.game.time.time){
                console.log('BANG');
                this.current.gun.shoot();
                if(this.sprite.body.blocked.down){
                    this.sprite.animations.play('shoot',false);
                    this.sprite.body.velocity.x = (this.sprite.scale.x > 0) ? 10 : -10;
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
            }
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