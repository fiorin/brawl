define([
    'app/units/gun'
], function (
    Gun
) { 
    'use strict';
    var multSpeedFloor = 1,
        multSpeedAir   = .8,
        left           = -1,
        right          = 1,
        zero           = 0;
    function Player(game,args){
        this.game = game;
        this.playerNumber = args.playerNumber;
        this._default = {
            speed: 250,
            life: 100,
            jump: 600,
            sprite: 'player'
        };
        this.current = {
            life: null,
            speed: {
                floor: this._default.speed * multSpeedFloor,
                air: this._default.speed * multSpeedAir
            },
            weapon: {
                gun: (new Gun(this.game)).start(),
                sword: null
            },
            can: {
                die: true,
                run: true,
                shoot: true,
                block: true,
                jump: true
            }
        };
        this.sprite = this.game.add.sprite(args.position.x, args.position.y, this._default.sprite);
        this.gamepad = this.game.input.gamepad['pad'+this.playerNumber];
    }
    
    Player.prototype = {
        start: function() {
            // =====
            // SPRITE
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
        },
        // =====
        // CHECK GAMEPAD INPUT
        checkGamepad: function(){
            //console.log(this.sprite.body.blocked);
            //console.log(this.current.speed.floor);
            if(this.sprite.body.blocked.down){
            // =====
            // IF FLOOR
                if(this.current.can.run){
                // =====
                // IF CAN RUN
                    if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                    // =====
                    // RUN LEFT
                        this.run(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    // =====
                    }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
                    // =====
                    // RUN RIGHT
                        this.run(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    // =====
                    }else{
                        this.still();
                    }
                // =====
                }
                if(this.current.can.jump){
                // =====
                // IF CAN JUMP
                    if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)){
                    // =====
                    // JUMP
                        if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                            this.jump(left);
                        }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){  
                            this.jump(right);
                        }else{
                            this.jump(zero);
                        }
                    // =====
                    }
                // =====
                }
            // =====
            }else{
            // =====
            // IF AIR
                if(this.current.can.run){
                // =====
                // IF CAN RUN
                    if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                        this.runJump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
                        this.runJump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    }  
                }
                // =====


                if(this.sprite.body.deltaY() > 0){
                // =====
                // IF FALLING
                    this.fall();
                // =====
                }

                if(this.current.can.jump){
                // =====
                // IF CAN DOUBLE JUMP

                // =====
                }
            // =====
            }

            /*
            if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)){
                    this.shoot();
            }
            if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER)){
                    this.block();
            }
            */
            //this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
            //this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
        },
        // =====

        /*checkAnimation: function(){
            if(this.sprite.animations.currentAnim.loop || (!this.sprite.animations.currentAnim.loop && this.sprite.animations.currentAnim.isFinished)){
                
            }
        },*/

        // =====
        // ACTIONS
        still: function(){
            this.sprite.animations.play('still');
            this.sprite.body.velocity.x = 0;
        },
        run: function(multX){
            this.sprite.scale.x = multX < 0 ? 1 : -1;
            this.sprite.body.velocity.x = this.current.speed.floor * multX;
            this.sprite.animations.play('run');
        },
        runJump: function(multX){
            this.sprite.scale.x = multX < 0 ? 1 : -1;
            this.sprite.body.velocity.x = this.current.speed.floor * multX;
        },
        jump: function(multX){
            this.sprite.body.velocity.y = -600; 
            this.sprite.animations.play('jump');
            this.sprite.body.velocity.x = this.current.speed.air * multX;
        },
        fall: function(){
            this.sprite.animations.play('fall');
        },
        /*
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
        }*/
        // =====
    };
    
    return Player;
});