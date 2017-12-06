var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

const UP = 1;
const RIGHT = 0.5;
const DOWN = -1;
const LEFT = -0.5;


var Main = function(){};
var Title = function(){};
var Ending = function(){};
var Help = function(){};
var Credits = function(){};

var map;
var layer;
var layerOvertable;
var layerTablebookshelf;
var layerChairwall;
var layerFloor;
var cursors;
var player;
var shadow;
var npcsGroup;
var characterGroup;
var objectsGroup;
var wallsGroup;
var switchesGroup;
var doorsGroup;
var lightsGroup;
var exitGroup;
var bloodGroup;
var exit;

var interactKey;
var actionKey;
var cancelKey;
var shadowTexture;
var lightSprite;
var playerX;
var playerY;
var lightText;
var npcText;
var isDark = false;
var exitKey;
var npcs = {};
var switches = {};
var doors = {};
var lightSources = [];
var characterLightSource = [];
var keySwitch;
var stats = {
  found: 0,
  saved: 0,
  killed: 0,
  leftBehind: 0,
  lost: false
};

function reset(){
  npcs = {};
  switches = {};
  doors = {};
  lightSources = [];
  characterLightSource = [];
  stats = {
    found: 0,
    saved: 0,
    killed: 0,
    leftBehind: 0,
    lost: false
  };
}

var debug = false;

Title.prototype = {
  preload: function(){
    game.load.image('title', 'assets/sprites/title.png');
  },

  create: function(){
    game.stage.backgroundColor = "#000000";
    interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    actionKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    cancelKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.E,Phaser.Keyboard.F,Phaser.Keyboard.C ]);
    game.add.sprite(0,0,'title');
  },

  update: function(){
    if(interactKey.isDown){
      game.state.start('Help',true,true);
      return;
    }
    if(actionKey.isDown){
      game.state.start('Credits',true,true);
      return;
    }
  }
}

Help.prototype = {
  preload: function(){
    game.load.image('instructions', 'assets/sprites/instructions.png');
  },

  create: function(){
    game.stage.backgroundColor = "#000000";
    interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    actionKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    cancelKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.E,Phaser.Keyboard.F,Phaser.Keyboard.C ]);
    game.add.sprite(0,0,'instructions');
  },

  update: function(){
    if(interactKey.isDown){
      game.state.start('Main',true,true);
      return;
    }
  }

}

Ending.prototype = {
  preload: function(){

  },

  create: function(){
    game.stage.backgroundColor = "#000000";
    interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    actionKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    cancelKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.E,Phaser.Keyboard.F,Phaser.Keyboard.C  ]);
    var endMsg = "YOU DIED\n\n";
    if(!stats.lost){
      endMsg = "YOU ESCAPED\n\n";
    }
    endMsg += "Students: \n\n";
    endMsg += "   Found: "+stats.found+"\n";
    endMsg += "   Saved: "+stats.saved+"\n";
    endMsg += "   Killed: "+stats.killed+"\n";
    endMsg += "   Left behind: "+(4-parseInt(stats.found))+"\n\n\n";
    endMsg += "   Press \"E\" to return to TITLE SCREEN \n\n";
    endMsg += "   Press \"F\" to PLAY AGAIN \n\n";

    game.add.text(30,30,endMsg,{font:"20px Arial",fill:"#ffffff",align:"center",fontWeight:"bold",stroke:"#000000",strokeThickness:6});
    reset();
  },

  update: function(){
    if(interactKey.isDown){
      game.state.start('Title',true,true);
      return;
    }
    if(actionKey.isDown){
      game.state.start('Main',true,true);
      return;
    }
  }

}


Main.prototype = {
  preload: function(){
    game.load.tilemap('classroom', 'assets/tilemaps/classroom/classroom.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('house', 'assets/tilemaps/classroom/dungeonex.png');
    game.load.image('house_inside', 'assets/tilemaps/classroom/house_inside.png');
    game.load.image('build_atlas', 'assets/tilemaps/classroom/build_atlas.png');
    game.load.image('obj_misk_atlas', 'assets/tilemaps/classroom/obj_misk_atlas.png');
    game.load.image('interior', 'assets/tilemaps/classroom/interior.png');
    game.load.image('grass', 'assets/tilemaps/classroom/grass2.png');
    game.load.image('detector2', 'assets/sprites/detector2.png');
    game.load.image('detector3', 'assets/sprites/detector3.png');
    game.load.image('detector4', 'assets/sprites/detector4.png');
    game.load.image('door1', 'assets/sprites/wall1.png');
    game.load.image('gate', 'assets/sprites/gate.png');
    game.load.image('exit', 'assets/sprites/exit.png');
    game.load.image('key', 'assets/sprites/key.png');
    game.load.image('blood', 'assets/sprites/blood.png');
    game.load.image('interruptor', 'assets/sprites/interruptor2.png');
    game.load.spritesheet('player', 'assets/sprites/PP1.png',64,64);
    game.load.spritesheet('npc1', 'assets/sprites/NPC1.png',64,64);
    game.load.spritesheet('npc2', 'assets/sprites/NPC2.png',64,64);
    game.load.spritesheet('npc3', 'assets/sprites/NPC3.png',64,64);
    game.load.spritesheet('npc4', 'assets/sprites/NPC4.png',64,64);
    game.load.spritesheet('shadow', 'assets/sprites/shadow.png',96,96);
    game.load.audio('scream','assets/audio/scream1.mp3');
    game.load.audio('eating','assets/audio/devouring.mp3');
    game.load.audio('switch','assets/audio/switch.mp3');
    game.load.audio('door','assets/audio/door.mp3');
    game.load.audio('npc','assets/audio/npc.mp3');
    game.load.audio('win','assets/audio/win.mp3');
    game.load.audio('monster','assets/audio/monster.mp3');
    //game.load.
  },



  create: function(){
    game.stage.backgroundColor = "#000000";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //wrs = game.input.keyboard.createCursorKeys();
    cursors = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );
    interactKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    actionKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    cancelKey = game.input.keyboard.addKey(Phaser.Keyboard.C);

    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.E,Phaser.Keyboard.F,Phaser.Keyboard.C ]);

    map = game.add.tilemap('classroom');
    map.addTilesetImage('house','house');
    map.addTilesetImage('house_inside','house_inside');
    map.addTilesetImage('build_atlas','build_atlas');
    map.addTilesetImage('obj_misk_atlas','obj_misk_atlas');
    map.addTilesetImage('interior','interior');
    map.addTilesetImage('grass','grass');
    layerFloor = map.createLayer('floor');
    layerChairwall = map.createLayer('chairwall');
    layerTablebookshelf = map.createLayer('tablebookshelf');
    layerOvertable = map.createLayer('overtable');
    layerFloor.resizeWorld();
    game.physics.arcade.enable(layerTablebookshelf);
    game.physics.arcade.enable(layerChairwall);
    map.setCollisionByExclusion([10,16,17,18,22,27,37,47,48,64,151,48,49,83,598,599,630,631,660,661,662,663,897,898,2631,2632,2629,2630,263,264,265,897,898],true,layerTablebookshelf);
    map.setCollisionByExclusion([10,16,17,18,22,27,37,47,48,64,151,48,49,83,598,599,630,631,660,661,662,663,897,898,2631,2632,2629,2630,263,264,265,897,898],true,layerChairwall);
    map.setCollision([147,161,162,163,164],layerChairwall);
    map.setCollision([147,161,162,163,164],layerTablebookshelf);

    bloodGroup = game.add.group();
    wallsGroup = game.add.group();
    lightsGroup = game.add.group();
    doorsGroup = game.add.group();
    switchesGroup = game.add.group();
    npcsGroup = game.add.group();
    characterGroup = game.add.group();
    exitGroup = game.add.group();


    for(let sw of map.objects.switches){
      switches[sw.name] = new LightSwitch(sw);
      if(sw.name=="switch3"){
        keySwitch = switches[sw.name];
      }
    }
    for(let door of map.objects.secret){
      doors[door.properties.switch] = new SecretDoor(door);
    }
    exit = new Gate(map.objects.exit[0],map.objects.exit[1]);

    var keyPos = map.objects.key[Math.floor(Math.random() * map.objects.key.length)];

    key = game.add.sprite(keyPos.x,keyPos.y,'key');
    game.physics.arcade.enable(key);
    key.body.immovable = true;

    player = new Player('player','PlayerName',[200,100,'player']);
    shadow = new Shadow('shadow','shadow',[1600,1440,'shadow']);
    npcs['npc1'] = new NPC('npc1','Ana',[300,300,'npc1']);
    npcs['npc2'] = new NPC('npc2','Marina',[365,300,'npc2']);
    npcs['npc3'] = new NPC('npc3','Sofia',[365,300,'npc3']);
    npcs['npc4'] = new NPC('npc4','Hermes',[365,300,'npc4']);
    var npcsSpawn = shuffle(map.objects.spawn,true);
    for(let name in npcs){
      var nspawn = npcsSpawn.pop();
      if(nspawn.properties.character=="player"){
        nspawn = npcsSpawn.pop();
      }
      npcs[name].sprite.position.x = nspawn.x;
      npcs[name].sprite.position.y = nspawn.y;
      npcs[name].spawn = nspawn.name;
      npcsGroup.add(npcs[name].sprite);
    }


    player.sprite.position.x = map.objects.spawn[0].x;
    player.sprite.position.y = map.objects.spawn[0].y;

    characterLightSource.push(new LightSource(null,player.sprite,200,[32,42]));
    darkness();
    lightText = game.add.text(0,0,"PRESS \"E\" TO TURN ON THE LIGHTS.",{font:"32px Arial",fill:"#ffffff",align:"center",fontWeight:"bold",stroke:"#000000",strokeThickness:6});
    lightText.visible = false;
    lightText.fixedToCamera = true;

    showNpcText(null,false);

    //lightSources.push(new LightSource(npcs['teste'].sprite,200,[16,32]));

    game.camera.follow(player.sprite);


  },

  update: function(){
    if(isDark){
      lightSprite.reset(game.camera.x,game.camera.y);
      darknessUpdate();
    }
    player.update();
    shadow.update();

  }
};


function getLightSource(name){
  var lights = [];
  for(let light of map.objects.lights){
    if(light.name==name){
      lights.push(light);
    }
  }
  return lights;
}



function darkness(){
  // Create the shadow texture
  shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);

  // Create an object that will use the bitmap as a texture
  lightSprite = this.game.add.image(game.camera.x, game.camera.y, this.shadowTexture);

  // Set the blend mode to MULTIPLY. This will darken the colors of
  // everything below this sprite.
  lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
  isDark = true;
}

function darknessUpdate(){
  // Draw shadow
  shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
  shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

  for(let clight of characterLightSource){
    var cX = (clight.pos().x);
    var cY = (clight.pos().y);
    var gradient = shadowTexture.context.createRadialGradient(
      cX, cY, 56*0.75,
      cX, cY, 56
    );
    gradient.addColorStop(0, 'rgba(138, 132, 132,1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    // Draw circle of light
    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradient;
    shadowTexture.context.arc(cX, cY, 64, 0, Math.PI*2,false);
    shadowTexture.context.fill();
  }
  for(let lights of lightSources){
    var lx = lights.pos().x;
    var ly = lights.pos().y;
    var rradius = lights.radius+game.rnd.integerInRange(1,3);
    var lgradient = shadowTexture.context.createRadialGradient(
      lx, ly, lights.radius*0.75,
      lx, ly, rradius
    );
    lgradient.addColorStop(0, lights.color);
  	lgradient.addColorStop(1, 'rgba(222, 219, 150, 0)');
    // Draw circle of light
    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = lgradient;
    shadowTexture.context.arc(lx, ly, rradius, 0, Math.PI*2,false);
    shadowTexture.context.fill();
  }

  // This just tells the engine it should update the texture cache
  shadowTexture.dirty = true;
}

function showNpcText(npc,visible){
  var name = "";
  if(npc){
    name = npc.name;
  }
  npcText = game.add.text(0,0,"PRESS \"E\" TO HELP "+name+".",{font:"32px Arial",fill:"#ffffff",align:"center",fontWeight:"bold",stroke:"#000000",strokeThickness:6});
  npcText.visible = visible;
  npcText.fixedToCamera = true;
}

function shuffle(ar,copy=true){
  var a = ar;
  if(copy){
    a = ar.slice(0);
  }
  var currentIndex = a.length;
  var temporaryValue;
  var randomIndex;

  while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = a[currentIndex];
      a[currentIndex] = a[randomIndex];
      a[randomIndex] = temporaryValue;
  }

  return a;
}

game.state.add('Title',Title);
game.state.add('Help',Help);
game.state.add('Credits',Credits);
game.state.add('Main',Main);
game.state.add('Ending',Ending);
game.state.start('Title');
