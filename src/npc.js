class NPC extends Character{

  init(args){
    super.init(args);
    this.states.add(new IdleState(this));
    this.states.add(new FollowState(this));
    this.states.add(new DeathState(this));
    this.states.start("idle");
    this.body.immovable = true;
    this.body.setSize(32,48,16,16);
    this.talkStart = "start";
    this.thoughtStart = "start";
    this.talk = {};
    this.thought = {};
    this.index = 0;
    this.sprite.animations.add('up',[4,5],5,true);
    this.sprite.animations.add('down',[1,2],5,true);
    this.sprite.animations.add('left',[7,8],5,true);
    this.sprite.animations.add('right',[9,10],5,true);
  }


  interact(dir,type){
    if(dir==LEFT){
      this.direction = RIGHT;
    } else if (dir==RIGHT){
      this.direction = LEFT;
    } else if (dir==UP){
      this.direction = DOWN;
    } else if (dir==DOWN){
      this.direction = UP;
    }
    this.states.change('interact');
  }

  addText(text,textName,textStart){
    if(text.type=="talk"){
      this.talk[textName] = text;
      if(textStart){
        this.talkStart = textStart;
      }
    } else if (text.type=="thought"){
      this.thought[textName] = text;
      if(textStart){
        this.thoughtStart = textStart;
      }
    }
  }

  light(){
    characterLightSource.push(new LightSource(null,this.sprite,200,[32,42]));
  }
}


class Shadow extends Character {

  init(args){
    super.init(args);
    this.states.add(new ShadowIdleState(this));
    this.states.add(new ShadowMoveState(this));
    this.states.add(new ShadowAttackState(this));
    this.states.start("idle");
    this.body.immovable = true;
    this.body.setSize(64,64,16,16);
    this.sprite.animations.add('normal',[0,1,2],5,true);
    this.sprite.animations.add('angry',[0,1,2],10,true);
    this.sprite.animations.play('normal');
    this.spawns = [[1600,1440],[500,600],[100,500],[700,100]];
    this.scream = game.add.audio('scream');
    this.scream.addMarker('short_scream',0,2);
    this.eating = game.add.audio('eating');
    this.moving = game.add.audio('monster',0.2,true);
    this.targetCharacter = null;

  }


  update(){
    if(isDark){
      this.states.update();
    }
  }


}
