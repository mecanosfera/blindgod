class Player extends Character{

  init(args){
    super.init(args);
    this.states.add(new PlayerMoveState(this));
    this.states.add(new DeathState(this));
    this.states.start("move");
    this.body.setSize(16,16,24,48);
    this.interactTarget = null;
    this.lightTarget = null;
    this.detector = game.make.sprite(16,16,null);
    this.sprite.addChild(this.detector);
    game.physics.arcade.enable(this.detector);
    this.detector.body.setSize(32,48,0,16);
    this.party = [];
    characterGroup.add(this.sprite);
    this.speed = 256;
    this.sprite.animations.add('up',[4,5],5,true);
    this.sprite.animations.add('down',[1,2],5,true);
    this.sprite.animations.add('left',[7,8],5,true);
    this.sprite.animations.add('right',[9,10],5,true);
    this.joinParty = game.add.audio('npc');
    this.hasKey = false;
  }


  interact(target){
    if(target instanceof NPC){
      this.interactTarget = target;
    } else if (target instanceof LightSwitch){
      if(!target.active){
        this.lightTarget = target;
        lightText.visible = true;
      }
    } else {
      this.interactTarget = null;
      this.lightTarget = null;
    }
  }

  addToParty(npc){
    this.joinParty.play();
    this.party.push(npc);
    characterGroup.add(npc.sprite);
    npcsGroup.remove(npc.sprite);
    npc.states.change('follow');
    npc.index = this.party.length;
    npc.body.setSize(28,28,18,34);
    stats.found++;

  }

  removeFromParty(npc){
    var index = 0;
    var lightIndex = 0;
    for(let i=0;i<this.party.length;i++){
      if(this.party[i].handle==npc.handle){
        index = i;
        break;
      }
    }
    for(let j=0;j<characterLightSource.length;j++){
      if(characterLightSource[j].font.handle==npc.handle){
        lightIndex = j;
        break;
      }
    }
    this.party.splice(index,1);
    characterLightSource.splice(lightIndex,1);
    stats.killed++;
    npc.sprite.kill();
  }

  update(){
    this.states.update();
    for(let npc of this.party){
      npc.update();
    }
  }


}
