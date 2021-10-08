let trex, trex_running, trex_collided, trex_jump, trex_bend;
let ground, invisibleGround, groundImage;
let birdsGroup, birdImage;
let checkpoint, dead, jump, bgmusic;

let cloudsGroup, cloudImage;
let obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

let restartimg, restart, gameoverimg, over;

let score = 0,
  hiscore = 0;
let PLAY = 1;
let END = 0;
let gamestate = PLAY;
let vel;

function preload() {
  checkpoint = loadSound("Sounds/checkPoint.mp3");
  dead = loadSound("Sounds/die.mp3");
  jump = loadSound("Sounds/jump.mp3");
  bgmusic = loadSound("Sounds/(Produce).wav");

  trex_running = loadAnimation("images/trex1.png", "images/trex2.png", "images/trex3.png");
  trex_collided = loadAnimation("images/trex_collided.png");
  trex_jump = loadAnimation("images/trex1.png");
  trex_bend = loadAnimation("images/trex-bent-2.png", "images/trex-bent-1.png");
  groundImage = loadImage("images/ground.png");

  cloudImage = loadImage("images/cloud.png");

  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  birdImage = loadAnimation("images/bird1.png", "images/bird2.png");

  restartimg = loadImage("images/restart.png");
  gameoverimg = loadImage("images/gameOver.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 50);

  trex = createSprite(150, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("hit", trex_collided);
  trex.addAnimation("bent", trex_bend);
  trex.setCollider("circle", 0, 0, 40);
  //trex.debug = true;
  trex.scale = 0.6;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200, 430, width, 500);
  invisibleGround.visible = false;

  restart = createSprite(width / 2, 50, 10, 10);
  restart.addImage(restartimg);
  restart.scale = 0.9;
  restart.visible = false;
  over = createSprite(width / 2, 100, 10, 10);
  over.addImage(gameoverimg);
  over.visible = false;
  over.scale = 0.5;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdsGroup = new Group();

  bgmusic.play();
}

function draw() {
  background(255);

  if (frameCount % 3600 > 1600 && gamestate === PLAY) {
    background(0);
  }
  if (score === score + 200 && gamestate === PLAY) {
    background(0);
  }
  if (score <= 200) {
    background(255);
  }
  if (gamestate === PLAY) {
    if (frameCount % 6 === 0) {
      score = score + 1;
    }
    spawnClouds();
    spawnObstacles();

    if ((keyDown(UP_ARROW) || touches.length) && trex.y >= 151.5) {
      touches.length = 0;
      trex.velocityY = -15;
      jump.play();
      trex.addAnimation("jumped", trex_jump);
      trex.changeAnimation("jumped", trex_jump);
    }
    let gravity = map(score, 0, 1000, 1, 2.5);
    trex.velocityY = trex.velocityY + gravity;

    if (keyIsDown(DOWN_ARROW)) {
      trex.setCollider("rectangle", 0, 0, 100, 60);
      trex.changeAnimation("bent", trex_bend);
    }
    if (keyWentUp(DOWN_ARROW)) {
      trex.setCollider("circle", 0, 0, 40);
    }

    ground.velocityX = -(6 + 10 * score / 200);
    if (ground.x < width / 9) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }

    if (trex.isTouching(invisibleGround)) {
      if (!keyIsDown(DOWN_ARROW)) {
        trex.changeAnimation("running", trex_running)
      }
    }

    if (obstaclesGroup.isTouching(trex)) {
      dead.play();
      gamestate = END;
    }
  } else if (gamestate === END) {
    over.visible = true;
    restart.visible = true;

    if (hiscore < score) {
      hiscore = score;
    } else {
      hiscore = hiscore;
    }

    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.setCollider("circle", 0, 0, 40);
    trex.changeAnimation("hit", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (touches.length || mousePressedOver(restart)) {
      touches.length = 0;
      reset();
    }
  }
  textSize(30);
  textAlign(CENTER);
  textFont("Courier New");
  textStyle(BOLD);
  fill(0);
  strokeWeight(4);
  stroke(255);
  text("SCORE : " + nf(score, 5), width / 6, 250);
  text("HI : " + nf(hiscore, 5), width - 200, 250);
  trex.collide(invisibleGround);
  drawSprites();
}