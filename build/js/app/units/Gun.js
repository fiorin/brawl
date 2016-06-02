define([

], function (

) { 
    var multSpeedFloor = 1,
        multSpeedAir   = 1
    function Gun(game,owner,args){
        this.game = game;
        this.owner = owner;
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
            this.bullets.createMultiple(this.getAmmo(), 'bullet');
            this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.destroy);
            this.bullets.callAll('anchor.setTo', 'anchor', .5, .5);
            this.bullets.setAll('checkWorldBounds', true);
            return this;
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
            console.log('---');
            console.log('shoot');
            console.log(this.bullets);
            console.log(this.config);
            console.log('---');
            var bullet = this.bullets.getFirstExists(false);
            console.log(bullet);
            console.log('/\\');
            bullet.reset(this.owner.sprite.position.x, this.owner.sprite.position.y - this.owner.sprite.body.height);
            bullet.body.velocity.x = 1000;
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