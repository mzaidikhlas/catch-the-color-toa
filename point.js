function Point(dropPoint)
{
	this.spr = createSprite(120, 0, 30, 30 );
	this.spr.position.x = dropPoint;
	this.spr.rotation = 6;
	this.spr.velocity.y = 6;
	this.spr.shapeColor = color(255);

	this.fall = function() 
	{
		//this.spr.velocity.y = 6;
		rot = map(this.spr.velocity.y, 6, 100, 6, 100 );
		this.spr.rotation += 10;
		this.spr.draw() ;
	}

	this.spr.draw = function(){
    		noStroke();
    		fill(this.shapeColor);
			ellipse(this.position.x, this.position.y, 30, 30);
	}
}
