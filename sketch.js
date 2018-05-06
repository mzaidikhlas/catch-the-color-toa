var cell = Array();
var previousGen = Array();
var ruleset = [0, 1, 0, 1, 1, 0, 1, 0]; //[0,1,1,1,1,0,0,0];    //Rule 90 = [0, 1, 0, 1, 1, 0, 1, 0]; Rule 110 = [0,1,1,1,0,1,1,0];	 
var generation = 0;
var points = [];
var obstacles = []; 
var generationEnd = false;
var score = 0;
var lives = 3;
var gameState = 0;
var shapes = [];

function preload()
{
	titleSound = loadSound("assets/sounds/score.mp3");
	initialSound = loadSound("assets/sounds/initial.mp3");
	gameOverSound = loadSound("assets/sounds/game-over.mp3");
	//backdrop = loadImage("assets/backdrop.png");
	heartImage = loadImage("assets/heart.png");
	titleImage = loadImage("assets/title.png");
	startImage = loadImage("assets/start1.png");
	font = loadFont("assets/fonts/Now-Medium.otf");
	againImage = loadImage("assets/again1.png");
	poohImage = loadImage("assets/winnie1.png"); 
}

function setup() {
	canvas = createCanvas(400, 600);
	canvas.position(windowWidth/3, 10);
	startButton = createSprite((width/2), (height/2)+100, 310, 100);
	startButton.addImage(startImage);
	startButton.addAnimation("pressed", "assets/start2.png");
	startButton.mouseActive = true;

	againButton = createSprite((width/2)-3, (height/2)+90, 310, 100);
	againButton.addImage(againImage);
	againButton.addAnimation("change" , "assets/again2.png");
	againButton.mouseActive = true;

	initCells();
	initPointsAndObstacles();

	hero = createSprite(width/2, height-50, 30, 80);
	hero.shapeColor = color(255);

	heart1 = createSprite(18, 20, 16, 16 );
	heart2 = createSprite(38, 20, 16, 16 );
	heart3 = createSprite(58, 20, 16, 16 );
	heart1.addImage(heartImage);
	heart2.addImage(heartImage);
	heart3.addImage(heartImage);

	titleSound.setVolume(0.5);
	gameOverSound.setVolume(1.0);

	for(i=0; i<7; i++){
  		shapes[i] = new Shape(180, (i*100)+40);
  	}
	
}


function draw() {
	background(17);
	for(i=0; i<shapes.length; i++)
	{
		shapes[i].show();	
	}

	if(gameState==1)
	{
		gameOverSound.stop();
		gameScreen();
	}
	else if(gameState == 0 )
	{
		initialScreen();
	}	
	else if(lives == 0 && gameState == 2)
	{
		gameOverScreen();
	}
}

function gameScreen(){
	if(titleSound.isPlaying()==false)
		titleSound.play();

	drawSprite(hero);
	text("score: " + score, width-90, 20);

	if (keyIsDown(LEFT_ARROW))
		hero.position.x -=3 ;

	if (keyIsDown(RIGHT_ARROW))
		hero.position.x +=3 ;

	for(i=0; i<points.length; i++){

		if(cell[i] == 1 && previousGen[i] == 0){
			points[i].fall();
			points[i].spr.collide(hero, scoreUpdate);
		}

		else if(cell[i] == 0 && previousGen[i] == 1 ){
			obstacles[i].fall();
			obstacles[i].b.collide(hero, livesUpdate);
		}
	}

	for(i=0; i<points.length; i++){
		
		if(points[i].spr.position.y > height){
			generationEnd = true;
			points[i].spr.position.y=0;
			obstacles[i].b.position.y=0;
		}
		else{
			generationEnd=false;
			break; 
		}
	}

	if(generationEnd==true){
		rp = random(0, 255);
		gp = random(0, 255);
		bp = random(0, 255);
		hero.shapeColor=color(rp,gp,bp);
		ro = random(0,255);
		go = random(0, 255);
		bo = random(0, 255);
		for(i=0; i<points.length; i++)
		{
			points[i].spr.shapeColor = color(rp,gp,bp);
			obstacles[i].b.shapeColor = color(ro, go, bo);
		}
		newGeneration();
	}

	if(lives == 3)
	{
		drawSprite(heart1); 
		drawSprite(heart2);
		drawSprite(heart3);
	}	
	else if(lives == 2)
	{
		drawSprite(heart1); 
		drawSprite(heart2);
	}
	else if (lives == 1)
		drawSprite(heart1);

}

function initialScreen()
{
	if(initialSound.isPlaying()==false)
		initialSound.play();

	title = createSprite((width/2), (height/2)-85, 15,15);
	title.addImage(titleImage);
	drawSprite(title);
	drawSprite(startButton);

	startButton.onMousePressed = function()
	{
		this.changeAnimation("pressed");
	}

	startButton.onMouseReleased = function()
	{
		gameState = 1;
		this.animation.goToFrame(this.animation.getLastFrame());
		initialSound.stop();
	}
}

function gameOverScreen()
{
	titleSound.stop();

	if(gameOverSound.isPlaying()==false)
		gameOverSound.play();

	textFont(font);
	fill(255).strokeWeight(0).textSize(55);
	text("Game Over", 42, (height/2)-55);
	textSize(50);
	text("Score: " + score, (width/2)-100, (height/2)+10);
	drawSprite(againButton);


	againButton.onMousePressed = function()
	{
		this.changeAnimation("change");
	}

	againButton.onMouseReleased = function()
	{
		played = false;
		initCells();
		initPointsAndObstacles();
		gameState = 1;
		score = 0;
		lives = 3;
		hero.position.x = width/2;
		this.animation.goToFrame(this.animation.getLastFrame());
	}
}

function keyIsDown(LEFT_ARROW){
	if (hero.position.x>10 && hero.position.x<width-15) {
    	hero.position.x -= 1;
  	} 
}

function keyIsDown(RIGHT_ARROW){
	if(hero.position.x>10 && hero.position.x<width-15) {
    	hero.position.x += 1;
  }
}

function mouseDragged(){
	if(mouseX>10 && mouseX<width-15)
		hero.position.x = mouseX;
}

function touchMoved(){
	if(mouseX>10 && mouseX<width-15)
		hero.position.x = touchX;
}

function initCells(){
	for(i=0; i<8; i++){
		cell[i]=Math.round(Math.random() * 1) + 0;
		//cell[i] = 0;
		previousGen[i] = 0;
	}
	//cell[cell.length/2]=1;
	cell[0] = 0;
	cell[7] = 0;
}

function newGeneration(){

	next = Array();
	for(i=1; i<cell.length-1; i++){
		left = cell[i-1];
		right = cell[i+1];

		next[i] = rules(left, cell[i], right);
	}

	for(x=1; x<cell.length-1; x++){
		previousGen[x] = cell[x];
		cell[x] = next[x];
	}
	generation++;
}

function rules(left, middle, right){
	newCell = ""+left+middle+right;
	index = parseInt(newCell,2);

	return ruleset[index]; 
}

function initPointsAndObstacles(){
	for(i=0; i<cell.length; i++){	
		points[i] = new Point((i*50)+50);
		obstacles[i] = new Obstacle((i*50)+50);
	}
}

function scoreUpdate(point, hero){
	score++;
	point.position.y = height+10;
	if(score % 10 == 0){
		initCells();
		for(i = 0; i<points.length; i++){
			points[i].spr.velocity.y += 2;
			obstacles[i].b.velocity.y += 2;
		}
	}
}

function livesUpdate(obstacle, hero){
	obstacle.position.y = height+10;
	lives-=1;
	if(lives==0){
		gameState = 2;
	}
}
