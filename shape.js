function Shape(x, y)
{
	this.spr = createSprite(140, 0, 1000, 15 );
	this.spr.position.y = y;
	this.spr.position.x = x;
	this.spr.shapeColor = color(255,60);

	this.show = function(){
		this.spr.rotation += 0.05;
		drawSprite(this.spr);
	}
}