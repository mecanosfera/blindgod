class Character {

  constructor(...args){
    this.init(args);
  }


  init(args){
    this.handle = args[0]
    this.name = args[1];
    this.states = new clinamenfsm.StateMachine({states:{}});
    this.sprite = game.add.sprite(args[2][0],args[2][1],args[2][2]);
    this.sprite.name = this.name;
    this.sprite.handle = this.handle;
    game.physics.arcade.enable(this.sprite);
    this.body = this.sprite.body;
    this.body.allowGravity = false;
    this.body.allowDrag = false;
    this.body.allowRotation = false;
    //this.body.immovable = true;
    this.direction = DOWN;
    this.horizontalDir = 0;
    this.verticalDir = -1;
    this.onLight = false;
    this.dead = false;
    //this.body.collideWorldBounds = true;

  }

  changeDir(){

  }


  update(){
    this.states.update();
  }
}
