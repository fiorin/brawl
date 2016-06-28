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
                players: {},
                characters: {
                    character0:  { 
                        status: true,
                        sprite: 'bonny',
                        avatar: 0,
                    },
                    character1:  { 
                        status: true,
                        sprite: 'barts',
                        avatar: 1,
                    },
                    character2:  { 
                        status: true,
                        sprite: 'drake',
                        avatar: 2,
                    },
                    character3:  { 
                        status: false,
                        sprite: 'unknow',
                        avatar: 3,
                    }
                }
            };
            for(var count = 1;count<=4;count++){
                game.options.players['p'+count] = {
                    current: {
                        status: false,
                        points: 0, 
                        selector: -1,
                        character: null
                    },
                    config: {
                        number: count-1
                    },
                    gamepad: this.game.input.gamepad['pad'+count],
                    can: {
                        gamepad: this.game.time.time + 1000
                    },
                    sprite: {
                        gamepad: null,
                        selector: null
                    }
                }
            }
            console.log(game.options.players);
        },
        create: function() {
            this.game.add.sprite(0,0, 'bg');
            this.game.stage.backgroundColor = "#fff";
            this.buildCharacterMenu();
            this.buildControllerMenu();
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setShowAll();
        },
        update: function(){
            var players = Object.keys(game.options.players).length;
            for(var count = 1;count <= players;count++){
                this.checkGamepad(this.game.options.players['p'+count]);
            }
        },
        buildControllerMenu: function(){
            //var players = Object.keys(game.options.characters).length;
            for(var count = 1;count <= 4;count++){
                this.game.options.players['p'+count].sprite.gamepad = this.game.add.sprite(108 + (100*(count-1)),208, 'controller');
                this.game.options.players['p'+count].sprite.gamepad.frame = 0;
            }
        },
        buildCharacterMenu: function(){
            var charactersAvailable = Object.keys(game.options.characters).length;
            for(var count = 0;count < charactersAvailable;count++){
                this.selectors[count] = {
                    character: 'bonny',
                    position:{
                        x: 100 + 100*count,
                        y: 100,
                    },
                    player: null,
                    sprite: this.game.add.sprite(108 + (100*count),108, 'avatar')
                };
                this.selectors[count].sprite.frame = game.options.characters['character'+count].avatar;
            }
                console.log(this.selectors);
        },
        buildSelector: function(player){
            if(player.sprite.selector == null){
                this.changeSelector(player,true);
                player.sprite.gamepad.frame = 4;
                this.changePlayerStatus(player,true);
            }
        },
        destroySelector: function(player){
            if(player.sprite.selector !== null){
                player.sprite.selector.destroy();
                player.sprite.selector = null;
                player.current.selector = -1;
                player.sprite.gamepad.frame = 0;
                this.changePlayerStatus(player,false);
            }
        },
        changeSelector: function(player,direction){
            var selectors = this.selectors,
                totalSelectors = this.selectors.length,
                position  = player.current.selector;
                console.log(player.current.selector);
            if(direction){
                player.current.selector++;
                if(player.current.selector == totalSelectors)
                    player.current.selector = 0;
            }else{
                if(player.current.selector == 0)
                    player.current.selector = totalSelectors;
                player.current.selector--;
            }
            console.log(player.current.selector);
            var selector = selectors[player.current.selector];
            selector.player = 1;
            if(player.sprite.selector === null){
                player.sprite.selector = this.game.add.sprite(selector.position.x,selector.position.y, 'selector');
                player.sprite.selector.frame = player.config.number;
            }else{
                player.sprite.selector.position.x = selector.position.x;
                player.sprite.selector.position.y = selector.position.y;
            }
        },
        changePlayerStatus: function(player,status){
            player.current.status = status;
        },
        checkGamepad: function(player){
            if(player.can.gamepad < this.game.time.time){
                player.can.gamepad = this.game.time.time + 100;
                if(player.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.3){
                    this.changeSelector(player,true);
                }else if(player.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.3){
                    this.changeSelector(player,false);
                }else if(player.gamepad.isDown(Phaser.Gamepad.XBOX360_A)){
                    this.buildSelector(player);
                }else if(player.gamepad.isDown(Phaser.Gamepad.XBOX360_B)){
                    this.destroySelector(player);
                }else if(player.gamepad.isDown(Phaser.Gamepad.XBOX360_START)){
                    this.game.state.start('Game');
                }
            }
        },
    };
    
    return CharacterState;
});