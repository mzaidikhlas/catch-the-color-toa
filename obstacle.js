function Obstacle(dropPoint)
{
	this.b = createSprite(120, 0, 30, 30 );
	this.b.position.x = dropPoint;
	this.b.rotation = 6;
	this.b.velocity.y = 7;
	this.b.shapeColor = color("#FA0000");

	this.fall = function() 
	{
		//this.b.velocity.y = 7;
		rot = map(this.b.velocity.y, 7, 100, 6, 100 );
		this.b.rotation -= rot;
		this.b.draw();
	}
	
	this.b.draw = function(){
    		noStroke();
    		fill(this.shapeColor);
			ellipse(this.position.x, this.position.y, 30, 30);
	}
}
