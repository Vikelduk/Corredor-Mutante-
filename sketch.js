var blueBG, blueBImg, greenBG, greenBImg, redBG, redBImg, pinkBG, pinkBImg;

var bike11, bike12, bike1G, player1;
var bike21, bike22, bike2G, player2;
var bike31, bike32, bike3G, player3;

var sword, swordImg, swordG, cash, cashImg, cashG;

var backgroundImg, road, roadImg, sun, sunImg, cloudsGroup, cloudImg;

var collidedSound, jumpSound;

var gameOverImg;

var trex, trex_running, trex_collided;

var jumpSound, collidedSound;

var treasureCollection = 0;
var score = 0;

var END =0;
var PLAY = 1;

var gameState = PLAY;

var gameOver, gameOverImg, restart;

function preload()
{
  //// obstaculos /////

  swordImg = loadImage("./obstacles/sword.png");
  
  bike11 = loadAnimation("./obstacles/opponent1.png","./obstacles/opponent2.png");
  bike12 = loadAnimation("./obstacles/opponent3.png");
  
  bike21 = loadAnimation("./obstacles/opponent4.png","./obstacles/opponent5.png");
  bike22 = loadAnimation("./obstacles/opponent6.png");
  
  bike31 = loadAnimation("./obstacles/opponent7.png","./obstacles/opponent8.png");
  bike32 = loadAnimation("./obstacles/opponent9.png");

  redBImg = loadImage("./obstacles/red_balloon0.png");
  greenBImg = loadImage("./obstacles/green_balloon0.png");
  pinkBImg = loadImage("./obstacles/pink_balloon0.png");
  blueBImg = loadImage("./obstacles/blue_balloon0.png");

  /// safes and geral/////

  cashImg = loadImage("./safes/cash.png");

  gameOverImg = loadImage("./safes/gameOver.png");

  roadImg = loadImage("./safes/road.png");
  backgroundImg = loadImage("./safes/backgroundImg.png");
  sunImg = loadImage("./safes/sun.png");
  cloudImg = loadImage("./safes/cloud.png");

  //// trex ////

  jumpSound = loadSound("./safes/jump.wav")
  collidedSound = loadSound("./safes/collided.wav")
  
  trex_running = loadAnimation("./safes/trex_2.png","./safes/trex_1.png","./safes/trex_3.png");
  trex_collided = loadAnimation("./safes/trex_collided.png");

}

function setup()
{
  createCanvas(windowWidth, windowHeight);

  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunImg);
  sun.scale = 0.1;

  road = createSprite(100,150);
  road.addImage(roadImg);
  road.velocityX = -5;

  trex = createSprite(70, 150);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider("rectangle",0,0,40,40,50);
  trex.scale = 0.2;

  gameOver = createSprite(650,150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.3;
  gameOver.visible = false;   

///// Grupos ////////////

/////////// Obstaculos Group ///////

  bike1G = new Group();
  bike2G = new Group();
  bike3G = new Group();

  redBG = new Group();
  greenBG = new Group();
  blueBG = new Group();
  pinkBG = new Group();

  swordGroup = new Group();


///////// safes Group /////////

  cashG = new Group();

  cloudsGroup = new Group();

/// fim dos grupos ///////////

  score = 0;
}

function draw() 
{
  background(backgroundImg);

  drawSprites();
  textSize(20);
  fill(255);
  text("Metros: "+ score,900,30);

  textSize(20);
  fill(255);
  text("Pontos: "+ treasureCollection,width-300,30);

  if (gameState===PLAY)
  {
    score = score + Math.round(getFrameRate()/50);
    road.velocityX = -(6 + 2*score/150);
  
    trex.y = World.mouseY;
    trex.x = World.mouseX;
  
    edges = createEdgeSprites();
    trex.collide(edges);

    if(road.x < 0 )
    {
      road.x = width/2;
    }

    spawnClouds();
    createSword();
    createCash();

    if(cashG.isTouching(trex)) 
    {
      cashG.destroyEach();
      treasureCollection = treasureCollection + 50;
    }

    if(swordG.isTouching(trex)) 
    {
      gameState=END;
    }

    var select_balloon = Math.round(random(1,4));
  
    if (World.frameCount % 100 == 0) 
    {
      if (select_balloon == 1) 
      {
        redBalloon();
      } 
      else if (select_balloon == 2) 
      {
        greenBalloon();
      } 
      else if (select_balloon == 3) 
      {
        blueBalloon();
      } 
      else 
      {
        pinkBalloon();
      }
    }

    var select_oppPlayer = Math.round(random(1,3));
  
    if (World.frameCount % 150 == 0) 
    {
      if (select_oppPlayer == 1) 
      {
        pinkCyclists();
      } 
      else if (select_oppPlayer == 2) 
      {
        yellowCyclists();
      } 
      else
      {
        redCyclists();
      }
    }
    
    if(bike1G.isTouching(trex))
    {
      gameState = END;
      player1.velocityY = 0;
      player1.addAnimation("opponentPlayer1",bike12);
    }
      
    if(bike2G.isTouching(trex))
    {
      gameState = END;
      player2.velocityY = 0;
      player2.addAnimation("opponentPlayer2",bike22);
    }
      
    if(bike3G.isTouching(trex))
    {
      gameState = END;
      player3.velocityY = 0;
      player3.addAnimation("opponentPlayer3",bike32);
    }

    if (trex.isTouching(redBG))
    {
      gameState = END;
    }
  
    if (trex.isTouching(greenBG)) 
    {
      gameState = END;
    }
  
    if (trex.isTouching(blueBG)) 
    {
      gameState = END; 
    }
  
    if (trex.isTouching(pinkBG)) 
    {
      gameState = END;
    }
  }
  else if (gameState === END) 
  {
    gameOver.visible = true;
  
    textSize(20);
    fill(255);
    text("Press Up Arrow to Restart the game!", 500,200);
  
    road.velocityX = 0;

    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
  
    bike1G.setVelocityXEach(0);
    bike1G.setLifetimeEach(-1);
  
    bike2G.setVelocityXEach(0);
    bike2G.setLifetimeEach(-1);
  
    bike3G.setVelocityXEach(0);
    bike3G.setLifetimeEach(-1);

    cashG.setVelocityXEach(0);
    cashG.setLifetimeEach(-1);

    swordG.setVelocityYEach(0);
    swordG.setLifetimeEach(-1);

    redBG.setVelocityYEach(0);
    redBG.setLifetimeEach(-1);

    blueBG.setVelocityYEach(0);
    blueBG.setLifetimeEach(-1);

    greenBG.setVelocityYEach(0);
    greenBG.setLifetimeEach(-1);

    pinkBG.setVelocityYEach(0);
    pinkBG.setLifetimeEach(-1);

    if(keyDown("UP_ARROW")) 
    {
      reset();
    }
  }

  drawSprites();
}
//// safes and gerals functions ////
function createCash() 
{
  if (World.frameCount % 200 == 0) 
  {
  var cash = createSprite(1100, Math.round(random(50,250)));
  cash.addImage(cashImg);
  cash.scale=0.06;
  cash.velocityX = -(6 + 2*score/150);
  cash.lifetime = 170;
  cashG.add(cash);
  }
}

/////// fim dos safes functions////////

/////// obstacles functions /////

function redBalloon() 
{
  var red = createSprite(Math.round(random(20, 370)), 0, 10, 10);
  red.addImage(redBImg);
  red.velocityY = 3;
  red.lifetime = 170;
  red.scale = 0.06;
  redBG.add(red);
}

function blueBalloon() 
{
  var blue = createSprite(Math.round(random(20, 370)), 0, 10, 10);
  blue.addImage(blueBImg);
  blue.velocityY = 3;
  blue.lifetime = 170;
  blue.scale = 0.06;
  blueBG.add(blue);
}

function greenBalloon() 
{
  var green = createSprite(Math.round(random(20, 370)), 0, 10, 10);
  green.addImage(greenBImg);
  green.velocityY = 3;
  green.lifetime = 170;
  green.scale = 0.06;
  greenBG.add(green);
}

function pinkBalloon() 
{
  var pink = createSprite(Math.round(random(20, 370)), 0, 10, 10);
  pink.addImage(pinkBImg);
  pink.velocityY = 3;
  pink.lifetime = 170;
  pink.scale = 0.06;
  pinkBG.add(pink);
}

function pinkCyclists()
{
  player1 =createSprite(1100,Math.round(random(50, 250)));
  player1.scale =0.06;
  player1.velocityX = -(6 + 2*score/150);
  player1.addAnimation("opponentPlayer1",bike11);
  player1.setLifetime= 170;
  bike1G.add(player1);
}

function yellowCyclists()
{
  player2 =createSprite(1100,Math.round(random(50, 250)));
  player2.scale =0.06;
  player2.velocityX = -(6 + 2*score/150);
  player2.addAnimation("opponentPlayer2",bike21);
  player2.setLifetime=170;
  bike2G.add(player2);
}

function redCyclists()
{
  player3 =createSprite(1100,Math.round(random(50, 250)));
  player3.scale =0.06;
  player3.velocityX = -(6 + 2*score/150);
  player3.addAnimation("opponentPlayer3",bike31);
  player3.setLifetime=170;
  bike3G.add(player3);
}

function createSword()
{
  if (World.frameCount % 530 == 0) 
  {
  var sword = createSprite(1100, Math.round(random(50, width-50), 10, 10));
  sword.addImage(swordImg);
  sword.scale=0.06;
  sword.velocityX = -(6 + 2*score/150);
  sword.lifetime = 170;
  swordG.add(sword);
  }
}

function spawnClouds() 
{
  if (frameCount % 60 === 0) 
  {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 170;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    cloudsGroup.add(cloud);
  }
  
}
