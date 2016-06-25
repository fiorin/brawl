define([

], function (

) { 
    var multSpeedFloor = 1,
        multSpeedAir   = 1
    function Gun(game,owner,args){
        this.game = game;
        this.owner = owner;
        this.config = {
            recoil: 50,
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
            var bullet = this.game.config.groupColliders.bullets.getFirstExists(false);
            bullet.reset(this.owner.sprite.position.x + (this.owner.sprite.body.height*.1), this.owner.sprite.position.y - (this.owner.sprite.body.height*.45));
            bullet.body.gravity.y = 200;
            bullet.body.mass = 0;
            bullet.config = {owner: this.owner};
            bullet.body.velocity.x = this.owner.current.position.face * 1000;
            this.status.ammo--;
            this.setReady();
        }
        // =====
    }
    
    return Gun;
});