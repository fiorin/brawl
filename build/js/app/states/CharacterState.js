define([
    'phaser'
], function (
    Phaser
) { 
    'use strict';
    var game;

    function CharacterState() {
        this.selectors = [];
    }
    
    CharacterState.prototype = {
        preload: function() {
            game = this.game;
            game.input.gamepad.start();
            game.options = {
                players: {
                    p1:{
                        status: null,
                        character: null,
                        points: 0,
                        gamepad: this.game.input.gamepad['pad1'],
                        sprite: {
                            gamepad: null,
                            selector: null
                        }
                    },
                    p2:{
                        status: null,
                        character: null,
                        points: 0,
                        gamepad: this.game.input.gamepad['pad2'],
                        sprite: {
                            gamepad: null,
                            selector: null
                        }
                    },
                    p3:{
                        status: null,
                        character: null,
                        points: 0,
                        gamepad: this.game.input.gamepad['pad3'],
                        sprite: {
                            gamepad: null,
                            selector: null
                        }
                    },
                    p4:{
                        status: null,
                        character: null,
                        points: 0,
                        gamepad: this.game.input.gamepad['pad4'],
                        sprite: {
                            gamepad: null,
                            selector: null
                        }
                    },

                },
                characters: {
                    bonny: {
                        status: true
                    },
                    barts: {
                        status: true
                    },
                    drake: {
                        status: true
                    }
                }
            };
        },
        create: function() {
            this.game.add.sprite(0,0, 'bg');
            this.game.stage.backgroundColor = "#fff";
            this.buildControllerMenu();
            this.buildCharacterMenu();
        },
        update: function(){
            var players = Object.keys(game.options.players).length;
            for(var count = 1;count <= players;count++){
                this.checkGamepad(this.game.options.players['p'+count]);
            }
        },
        buildControllerMenu: function(){
            //var players = Object.keys(game.options.characters).length;
            var players = Object.keys(game.options.players).length;
            for(var count = 1;count <= players;count++){
                this.game.options.players['p'+count].sprite.gamepad = this.game.add.sprite(18 + (100*count),118, 'controller');
                this.game.options.players['p'+count].sprite.gamepad.frame = 0;
            }
        },
        buildCharacterMenu: function(){
            var charactersAvailable = Object.keys(game.options.characters).length;
            for(var count = 0;count < charactersAvailable;count++){
                this.game.add.sprite(18 + (100*count),18, 'avatar');
                this.selectors[count] = {
                    character: 'bonny',
                    position:{
                        x: 100*count,
                        y: 0,
                    }
                };
            }
        },
        buildSelector: function(player){
            player.sprite.selector = this.game.add.sprite(this.selectors[0].position.x,this.selectors[0].position.y, 'selector');
            this.changePlayerStatus(player,true);
        },
        destroySelector: function(player){
            if(player.sprite.selector !== null){
                player.sprite.selector.destroy();
            }
            this.changePlayerStatus(player,false);
        },
        changePlayerStatus: function(player,status){
            player.status = status;
        },
        checkGamepad: function(player){
            if(player.gamepad.isDown(Phaser.Gamepad.XBOX360_A)){
                player.sprite.gamepad.frame = 4;
                this.buildSelector(player);
            }else if(player.gamepad.isDown(Phaser.Gamepad.XBOX360_B)){
                player.sprite.gamepad.frame = 0;
                this.destroySelector(player);
            }else if(player.gamepad.isDown(Phaser.Gamepad.XBOX360_START)){
                this.game.state.start('Game');
            }
        }
    };
    
    return CharacterState;
});