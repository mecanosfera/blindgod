class LightSource {

  constructor(lightSwitch,font,radius,offset,color){
    this.lightSwitch = lightSwitch;
    this.font = font;
    this.radius = radius;
    this.offset = {x:16,y:16};
    this.name = font.name;
    if(offset){
      this.offset = {x:offset[0],y:offset[1]};
    }
    this.color = 'rgba(207, 192, 91,1.0)';
    if(color){
      this.color = color;
    }
    var ldsprite = null;
    if(debug){
      ldsprite = 'detector4';
    }
    this.sprite = game.make.sprite(this.font.x,this.font.y,null);
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.setSize(32,32,0,0);
    this.lightDetector = game.make.sprite(this.font.x-(this.radius-(this.radius*0.7))-(this.offset.x),this.font.y-(this.radius*0.7)+(this.offset.y),ldsprite);
    game.world.addChild(this.lightDetector);
    this.lightDetector.width = (this.radius*0.7)*2;
    this.lightDetector.height = (this.radius*0.7)*2;
    game.physics.arcade.enable(this.lightDetector);
    //this.lightDetector.body.setSize(this.radius-5,this.radius-5,0,0));


  }

  pos(){
    return {x:(this.font.x-game.camera.x)+this.offset.x,y:(this.font.y-game.camera.y)+this.offset.y};
  }

}


class LightSwitch {

  constructor(ob){
      this.flick = false;
      this.active = false;
      this.name = ob.name;
      this.lightSourceName = ob.properties.light;
      this.sprite = game.add.sprite(ob.x,ob.y-64,'interruptor');
      this.sprite.name = ob.name;
      this.sprite.handle = ob.name;
      game.physics.arcade.enable(this.sprite);
      this.body = this.sprite.body;
      this.body.allowGravity = false;
      this.body.allowDrag = false;
      this.body.allowRotation = false;
      this.body.immovable = true;
      this.body.setSize(32,96,0,0);
      this.lights = [];
      this.click = game.add.audio('switch');
      switchesGroup.add(this.sprite);
      var lights = getLightSource(this.lightSourceName);
      for(let light of lights){
        this.lights.push(new LightSource(this,light,parseInt(light.properties.radius)));
      }
      this.door = null;
  }

  flick(){

  }

  turn(){
    if(this.active){
      return;
    }
    this.click.play();
    this.active = true;
    for(let light of this.lights){
      lightSources.push(light);
      lightsGroup.add(light.lightDetector);
    }
    if(this.door){
      this.door.active = true;
    }
  }

}


class SecretDoor {

  constructor(font){
    this.font = font;
    this.lightSwitch = switches[this.font.properties.switch];
    this.name = this.lightSwitch.name;
    this.active = false;
    this.open = false;
    this.lightSwitch.door = this;
    this.sprite = game.add.sprite(font.x,font.y,'door1');
    this.sprite.handle = this.name;
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;
    doorsGroup.add(this.sprite);
    this.sound = game.add.audio('door');
  }

  openDoor(){
    this.sound.play();
    var npc = this.getNpc();
    if(npc){
      npc.light();
    }
    this.sprite.kill();
  }

  getNpc(){
    for(let n in npcs){
      if(npcs[n].spawn==this.font.properties.spawn){
        return npcs[n];
      }
    }
    return null;
  }
}


class Gate {

  constructor(font1,font2){
    this.font1 = font1;
    this.font2 = font2;
    this.active = true;
    this.open = false;
    this.sprite = game.add.sprite(this.font1.x,this.font1.y,'gate');
    this.sprite.handle = 'gate';
    this.exit = game.add.sprite(this.font2.x,this.font2.y,'exit');
    this.exit.handle = 'exit';
    game.physics.arcade.enable(this.sprite);
    game.physics.arcade.enable(this.exit);
    this.sprite.body.immovable = true
    this.sprite.name = 'gate';
    this.exit.body.immovable = true;
    this.exit.name = 'exit';
    exitGroup.add(this.sprite);
    exitGroup.add(this.exit);
    //this.sound = game.add.audio('door');
  }

  openDoor(){
    this.open = true;
    this.sprite.kill();
  }





}
