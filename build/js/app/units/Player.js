define([
    'app/units/gun'
], function (
    Gun
) { 
    'use strict';
    var multSpeedFloor = 1,
        multSpeedAir   = .8,
        multSpeedWall  = 1.5,
        zero           = 0;
    function Player(game,args){
        this.game = game;
        this.playerNumber = args.playerNumber;
        this._default = {
            weight: 80,
            speed: 250,
            life: 100,
            jump: {
                y: 600,
                times: 2
            },
            sprite: args.character,
            avatar: 'avatar'
        };
        this.current = {
            position: {
                face: args.face || 1
            },
            life: null,
            speed: {
                floor: this._default.speed * multSpeedFloor,
                air: this._default.speed * multSpeedAir,
                wall: this._default.speed * multSpeedWall
            },
            jump: {
                floor: this._default.jump.y * -multSpeedFloor,
                air: this._default.jump.y * -multSpeedAir
            },
            weapon: {
                gun: (new Gun(game,this)).start(),
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
        this.game.config.groupColliders.players.add(this.sprite);
    }
    
    Player.prototype = {
        start: function() {
            // =====
            // SPRITE
            this.sprite.scale.setTo(1,1);
            this.sprite.anchor.setTo(0.5, 1);
                // =====
                // ANIMATIONS
                this.sprite.animations.add('still',Phaser.Animation.generateFrameNames('still/still__', 0, 9,'',3),6,false);
                this.sprite.animations.add('run',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                this.sprite.animations.add('jump',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                this.sprite.animations.add('fall',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                this.sprite.animations.add('jump_block',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                this.sprite.animations.add('shoot',Phaser.Animation.generateFrameNames('still/still__', 0, 4,'',3),4,false);
                //this.sprite.animations.add('run',Phaser.Animation.generateFrameNames('run/', 1, 4,'',1),8,true,false);
                //this.sprite.animations.add('jump',Phaser.Animation.generateFrameNames('jump/', 1, 2,'',1),2,true,false);
                //this.sprite.animations.add('fall',Phaser.Animation.generateFrameNames('fall/', 1, 2,'',1),2,true,false);
                //this.sprite.animations.add('shoot',Phaser.Animation.generateFrameNames('shoot/', 1, 2,'',1),4,false,false);
                //this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('jump_shoot/', 1, 2,'',1),4,false,false);
                //this.sprite.animations.add('jump_shoot',Phaser.Animation.generateFrameNames('shoot/', 1, 2,'',1),4,false,false);
                //this.sprite.animations.add('block',Phaser.Animation.generateFrameNames('block/', 1, 1,'',1),4,false,false);
                //this.sprite.animations.add('jump_block',Phaser.Animation.generateFrameNames('jump_block/', 1, 2,'',1),2,true,false);
                //this.sprite.animations.add('jump_block',Phaser.Animation.generateFrameNames('block/', 1, 2,'',1),4,true,false);
                // =====

                // =====
                // PHYSICS
                this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
                this.sprite.enableBody = true;
                this.sprite.body.collideWorldBounds = true;
                //this.sprite.body.bounce.set(0.05); 
                this.sprite.body.setSize(this.sprite.body.width * .7, this.sprite.body.height, 0, 0);
                //this.sprite.body.gravity.y = this.game.physics.arcade.gravity.y;
                // =====

                // =====
                // WEAPON

                // =====

            this.still();
            // =====
        },
        // =====
        // CHECK GAMEPAD INPUT
        checkGamepad: function(){
            //console.log(this.sprite.body.blocked);
            if(this.sprite.body.blocked.down){
            // =====
            // IF FLOOR
                this.current.can.jump = true;
                if(this.current.can.run){
                // =====
                // IF CAN RUN
                    if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                    // =====
                    // RUN LEFT
                        this.changeFacing(-1);
                        this.run(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    // =====
                    }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){
                    // =====
                    // RUN RIGHT
                        this.changeFacing(1);
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
                        this.current.can.jump = false;
                        if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
                            this.changeFacing(-1);
                            this.jump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                        }else if(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1){ 
                            this.changeFacing(1); 
                            this.jump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
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
                if(!(this.sprite.body.deltaX() > 0)
                && (this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0)){
                // =====
                // GO TO LEFT
                    this.changeFacing(-1);
                    if(this.current.can.jump && this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)){
                        this.current.can.jump = false;
                        this.jump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    }else{
                        this.runJump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    }
                // =====
                }else if(!(this.sprite.body.deltaX() < 0)
                && (this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0)){
                // =====
                // GO TO RIGHT
                    this.changeFacing(1);
                    if(this.current.can.jump && this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)){
                        this.current.can.jump = false;
                        this.jump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    }else{
                        this.runJump(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
                    }
                // =====
                }else{
                // =====
                // CENTER
                    if(this.current.can.jump && this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)){
                        this.current.can.jump = false;
                        this.jump(zero);
                    }else{
                        if(this.sprite.body.deltaY() > 0){
                            if(this.sprite.animations.currentAnim.name != 'fall') this.fall();
                        }
                    }
                // =====
                }
            // =====
            }
            if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)){
                this.shoot();
            }
            /*
            if(this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER)){
                    this.block();
            }
            */
            //this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
            //this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
        },
        // =====

        // =====
        // VISUAL FUNCTIONS
        changeFacing: function(x){
            this.current.position.face = x >= 0 ? 1 : -1;
        },
        changeAnimation: function(name,loop,killOnComplete){
            if(this.sprite.animations.currentAnim !== name)
                this.sprite.animations.play(name,loop,killOnComplete);
        },
        // =====

        // =====
        // ACTIONS
        still: function(){
            this.changeAnimation('still');
            this.sprite.body.velocity.x = 0;
        },
        run: function(multX){
            this.sprite.scale.x = this.current.position.face;
            this.sprite.body.velocity.x = this.current.speed.floor * multX;
            this.changeAnimation('run');
        },
        runJump: function(multX){
            this.sprite.scale.x = this.current.position.face;
            this.sprite.body.velocity.x = this.current.speed.floor * multX;
        },
        jump: function(multX){
            this.sprite.body.velocity.y = this.current.jump.floor; 
            this.changeAnimation('jump');
            this.sprite.body.velocity.x = this.current.speed.air * multX;
        },
        fall: function(){
            this.changeAnimation('fall');
        },
        shoot: function(){
            if(this.current.weapon.gun.getReady() < this.game.time.time){
                console.log('BANG');
                this.current.weapon.gun.shoot();
                if(this.sprite.body.blocked.down){
                    this.sprite.animations.play('shoot',false);
                    this.sprite.body.velocity.x = -this.current.weapon.gun.config.recoil * this.current.position.face;
                }else{
                    this.sprite.animations.play('jump_shoot',false);
                    this.sprite.body.velocity.x = -this.current.weapon.gun.config.recoil * this.current.position.face;
                    if(this.sprite.body.velocity.y < 0)
                        this.sprite.body.velocity.y = 0
                }
                this.sprite.animations.currentAnim.onComplete.add(function(){
                    if(this.sprite.body.blocked.down)
                        this.still();
                    else
                        this.fall();
                }.bind(this));
            }
        },
        /*
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