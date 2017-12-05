class CharacterState extends clinamenfsm.State{

  init(args){
    this.character = args[0];
    this.sprite = this.character.sprite;
  }


  update(){
    this.handleInput();
  }

}



class IdleState extends CharacterState {

  init(args){
    super.init(args);
    this.name = "idle";
  }

  update(){
    super.update();
    //game.physics.arcade.collide(this.sprite, player.sprite);
  }

}

class PlayerMoveState extends CharacterState{


  init(args){
    super.init(args);
    this.name="move";
  }

  update(){
    player.interact(null);
    lightText.visible = false;
    npcText.visible = false;
    this.character.onLight = false;
    game.physics.arcade.collide(this.sprite, layerTablebookshelf);
    game.physics.arcade.collide(this.sprite, layerChairwall);
    game.physics.arcade.collide(this.sprite, doorsGroup);
    game.physics.arcade.collide(this.sprite, exit.sprite);
    game.physics.arcade.overlap(player.detector, key,function(o1,o2){
      player.hasKey = true;
      keySwitch.turn();
      game.add.audio('win').play();
      key.kill();
    });
    game.physics.arcade.overlap(player.detector, exitGroup,function(o1,o2){
      if(o2.name=='gate' && !exit.open && interactKey.isDown && player.hasKey){
        exit.openDoor();
      } else if (o2.name=='exit' && exit.open){
        stats.saved = player.party.length;
        game.state.start('Ending',true,true);
      }
    });
    game.physics.arcade.overlap(player.detector, doorsGroup,function(o1,o2){
      if(doors[o2.handle].active && interactKey.isDown){
        doors[o2.handle].openDoor();
      }
    });
    game.physics.arcade.overlap(player.detector, npcsGroup, function(o1,o2){
      showNpcText(npcs[o2.handle],true);
      player.interact(npcs[o2.handle]);
    });
    game.physics.arcade.overlap(player.detector, switchesGroup, function(o1,o2){
      player.interact(switches[o2.handle]);
    });
    if(game.physics.arcade.overlap(this.sprite, lightsGroup)){
      this.character.onLight = true;
      
    }
    game.physics.arcade.collide(this.sprite, npcsGroup);
    this.handleInput();
  }

  handleInput(){
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    if (cursors.up.isDown){
        this.sprite.body.velocity.y = -player.speed;
        this.character.direction = UP;
        this.sprite.animations.play('up');
        this.character.detector.position.setTo(16,13);
        //this.sprite.body.velocity.x = 0;
    } else if (cursors.down.isDown){
        this.sprite.body.velocity.y = player.speed;
        this.character.direction = DOWN;
        this.sprite.animations.play('down');
        this.character.detector.position.setTo(16,19);
        //this.sprite.body.velocity.x = 0;
    }

    if (cursors.left.isDown){
        this.sprite.body.velocity.x = -player.speed;
        this.character.direction = LEFT;
        //player.sprite.scale.x *=-1;
        this.sprite.animations.play('left');
        this.character.detector.position.setTo(13,16);
        //this.sprite.body.velocity.y = 0;
    } else if (cursors.right.isDown){
        this.sprite.body.velocity.x = player.speed;
        this.character.direction = RIGHT;
        //player.sprite.scale.x *=-1;
        this.sprite.animations.play('right');
        this.character.detector.position.setTo(19,16);
        //this.sprite.body.velocity.y = 0;
    }
    if(this.sprite.body.velocity.x==0 && this.sprite.body.velocity.y==0) {
      player.sprite.animations.stop();
      if(player.direction==UP){
        player.sprite.frame = 3;
      } else if (player.direction==DOWN){
        player.sprite.frame = 0;
      } else if (player.direction==LEFT){
        player.sprite.frame = 6;
      } else if (player.direction==RIGHT){
        player.sprite.frame = 11;
      }
    }

    if(interactKey.isDown && player.interactTarget!=null){

      //this.character.states.change("interact");
      this.character.addToParty(player.interactTarget);
      player.interactTarget = null;
      return;
    }
    if(interactKey.isDown && player.lightTarget!=null){
      player.lightTarget.turn();
    }
  }

}





class FollowState extends CharacterState{

  init(args){
    super.init(args);
    this.name="follow";
  }

  enter(oldStateName){

  }

  update(){
    this.character.onLight = false;
    game.physics.arcade.collide(this.sprite, layerTablebookshelf);
    game.physics.arcade.collide(this.sprite, layerChairwall);
    if(game.physics.arcade.overlap(this.sprite, lightsGroup)){
      this.character.onLight = true;

    }
    if(Phaser.Math.distance(this.character.sprite.x,this.character.sprite.y,player.sprite.x,player.sprite.y)<=42*this.character.index){
      this.character.body.velocity.setTo(0,0);
      this.character.sprite.animations.stop();
      if(this.character.direction==UP){
        this.character.sprite.frame = 3;
      } else if (this.character.direction==DOWN){
        this.character.sprite.frame = 0;
      } else if (this.character.direction==LEFT){
        this.character.sprite.frame = 6;
      } else if (this.character.direction==RIGHT){
        this.character.sprite.frame = 11;
      }
      return;
    }
    var dir = game.physics.arcade.moveToXY(this.character.sprite,player.sprite.x,player.sprite.y,player.speed);

    if(dir<-1 && dir>=-3){
      this.character.direction = UP;
      this.character.sprite.animations.play('up');

    } else if (dir>0 && dir<=1.0){
      this.character.direction = RIGHT;
      this.character.sprite.animations.play('right');

    } else if (dir>0 && dir>2.0){
      this.character.direction = LEFT;
      this.character.sprite.animations.play('left');

    } else if (dir>1.0 && dir<2.0){
      this.character.direction = DOWN;
      this.character.sprite.animations.play('down');

    }
  }

}

class DeathState extends CharacterState{

  init(args){
    super.init(args);
    this.name='death';
  }

}




class ShadowState extends CharacterState{

  init(args){
    super.init(args);
  }

  searchTarget(){
    if(!player.dead && player.onLight && player.party.length==0 && Phaser.Math.distance(this.character.sprite.x,this.character.sprite.y,player.sprite.x,player.sprite.y)<188){
      shadow.targetCharacter = player;
      return true;
    } else if (player.party.length>0){
      shadow.targetCharacter = null;
      var nearest = null;
      for(let npc of player.party){
        if(npc.onLight && !npc.dead){
          if(!nearest || player.party.length==1){
            nearest = npc;
          } else {
            if(Phaser.Math.distance(this.character.sprite.x,this.character.sprite.y,npc.sprite.x,npc.sprite.y)<
              Phaser.Math.distance(this.character.sprite.x,this.character.sprite.y,nearest.sprite.x,nearest.sprite.y)
            ){
              nearest = npc;
            }
          }
        }
      }
      if(nearest && Phaser.Math.distance(this.character.sprite.x,this.character.sprite.y,nearest.sprite.x,nearest.sprite.y)<188){
        shadow.targetCharacter = nearest;
        return true;
      }
    }
    return false;
  }

}


class ShadowIdleState extends ShadowState{

  init(args){
    super.init(args);
    this.name="idle";
    this.timer = 10000;
    this.dt = 0;
  }

  update(){
    if(this.searchTarget()){
      this.character.scream.play('short_scream');
      this.character.states.change("move");
    }
    this.dt += game.time.elapsed;

    if(this.dt+(lightSources.length*1000)>=this.timer){
        this.character.states.change("move");
    }

  }

  exit(newStateName){
    this.dt = 0;
  }

}

class ShadowMoveState extends ShadowState{

  init(args){
    super.init(args);
    this.name="move";
    this.wayPoints = [];
    this.next = null;
    this.returnSpawn = false;
    this.spawn = [];
  }

  enter(oldStateName){
    shadow.moving.play();
    if(shadow.targetCharacter){
      return;
    }
    if(this.returnSpawn){
      return;
    }
    if(this.wayPoints.length==0){
      var sws = [];
      for(let wn in switches){
        var sw = switches[wn];
        if(sw.active){
          sws.push(sw);
        }
      }
      if(sws.length>1){
        shuffle(sws);
      }

      for(let swt of sws){
        var lights = shuffle(swt.lights,true);
        for(let light of lights){
          this.wayPoints.push(light);
        }
      }
    }
    this.next = this.wayPoints.pop();
    if(this.wayPoints.length==0){
      this.returnSpawn = true;
      this.spawn = this.character.spawns[0];
    }
  }

  exit(newStateName){
    shadow.moving.stop();
  }



  update(){
    this.speed = 20+(lightSources.length*20);

    if(shadow.targetCharacter==null && this.searchTarget()){
      this.character.scream.play('short_scream');
      this.character.body.velocity.setTo(0,0);
      return;
    }

    if(shadow.targetCharacter!=null){
      if(!shadow.targetCharacter.onLight){
        shadow.targetCharacter = null;
        if(this.searchTarget()){
          this.character.scream.play('short_scream');
        }
        return;
      }
      game.physics.arcade.moveToXY(this.character.sprite,shadow.targetCharacter.sprite.x,shadow.targetCharacter.sprite.y,this.speed+10);
      if(game.physics.arcade.overlap(this.character.sprite, characterGroup, function(o1,o2){
        if(o2.handle==shadow.targetCharacter.handle){
          if(o2.handle=='player'){
            player.states.change('death');
          } else {
            npcs[o2.handle].states.change('death');
          }
          shadow.body.velocity.setTo(0,0);
          shadow.states.change("attack");
        }
      })){

      }
      return;
    }
    if(this.returnSpawn && this.next == null){
      game.physics.arcade.moveToXY(this.character.sprite,this.spawn[0],this.spawn[1],this.speed);
      if(Phaser.Math.distance(this.character.sprite.x,this.character.sprite.y,this.spawn[0],this.spawn[1])<=10){
        this.returnSpawn = false;
        this.character.body.velocity.setTo(0,0);
        this.character.states.change("idle");
      }
      return;
    }
    if(!this.next){
      this.character.body.velocity.setTo(0,0);
      shadow.states.change('idle');
      return;
    }
    if(this.next && game.physics.arcade.overlap(this.sprite, this.next.sprite)){
      this.character.body.velocity.setTo(0,0);
      this.character.states.change("idle");
      this.next = null;

      return;
    }
    if(!this.next){
      this.character.body.velocity.setTo(0,0);
      shadow.states.change('idle');
      return;
    }
    game.physics.arcade.moveToXY(this.character.sprite,this.next.font.x-16,this.next.font.y-16,this.speed);


  }

}

class ShadowAttackState extends ShadowState{

  init(args){
    super.init(args);
    this.name="attack";
    this.dt = 0;
  }

  enter(oldStateName){
    this.dt = 0;
    this.character.eating.play();
    shadow.targetCharacter.body.velocity.setTo(0,0);
  }

  update(){
    this.dt += game.time.elapsed;
    if(game.physics.arcade.overlap(shadow.sprite,shadow.targetCharacter.sprite)){
      game.physics.arcade.moveToXY(shadow.targetCharacter.sprite,shadow.sprite.x+24,shadow.sprite.y+24,64);
    } else {
      shadow.targetCharacter.body.velocity.setTo(0,0);
    }

    if(this.dt >= 10000){
      this.character.states.change('move');
    }
  }

  exit(newStateName){
    this.dt = 0;
    this.character.eating.stop();
    if(shadow.targetCharacter.handle=='player'){
      stats.lost = true;
      shadow.moving.stop();
      game.state.start('Ending');
      return;
    } else {
      bloodGroup.add(game.add.sprite(shadow.targetCharacter.sprite.x,shadow.targetCharacter.sprite.y,'blood'));
      player.removeFromParty(shadow.targetCharacter);
    }
    characterGroup.remove(shadow.targetCharacter.sprite);
    shadow.targetCharacter.dead = true;
    shadow.targetCharacter = null;
  }

}
