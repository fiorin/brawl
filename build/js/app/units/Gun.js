define([

], function (

) { 
    var multSpeedFloor = 1,
        multSpeedAir   = 1
    function Gun(game,args){
        this.game = game;
        this.config = {
            recoil: 10,
            reload: 10,
            firerate: 2000,
            ammo: 10
        };
        this.sprite = {
            bullet: null
        };
        this.status = {
            ammo: null,
            whenReady: null
        };
        this.bullets;
    }
    
    Gun.prototype = {
        start: function() {
            this.setAmmo(this.config.ammo);
            this.setReady();
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(this.getAmmo, 'bullets');
            this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.destroy);
            this.bullets.callAll('anchor.setTo', 'anchor', .5, .5);
            this.bullets.setAll('checkWorldBounds', true);
        },
        // =====
        // STATUS
        setReady: function(){
            this.status.whenReady = this.game.time.time + this.config.firerate;
            console.log(this.getReady());
        },
        getReady: function(){
            return this.status.whenReady;
        },
        setAmmo: function(ammoNumber){
            this.status.ammo = ammoNumber;
        },
        getAmmo: function(){
            return this.status.ammo;
        },
        // =====

        // =====
        // ACTIONS
        shoot: function(){
            this.status.ammo--;
            this.setReady();
        },
        destroy: function(bullet){
            bullet.kill();
        }
        // =====
    }
    
    return Gun;
});