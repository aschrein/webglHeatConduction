/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var getLookAt = function( p , l , up , itanx , itany )
{
	var out = new Camera();
	out.itanx = itanx;
	out.itany = itany;
	out.pos.copyIn( p );
	out.look.copyIn( l.sub( p ).norm() );
	out.left.copyIn( out.look.vecx( up ).norm() );
	out.up.copyIn( out.left.vecx( out.look ).norm() );
	return out;
};
function Camera()
{
	this.pos = new Float3();
	this.up = new Float3();
	this.left = new Float3();
	this.look = new Float3();
	this.itanx = 1.0;
	this.itany = 1.0;
	this.farz = 100.0;
	this.nearz = 0.1;
	this.getPos = function()
	{
		return pos.copy();
	};
	this.setLookAt = function( p , l , up )
	{
		this.pos.copyIn( p );
		this.look.copyIn( p.sub( l ).norm() );
		this.left.copyIn( look.vecx( up ).norm() );
		this.up.copyIn( left.vecx( look ).norm() );
		return this;
	};
	this.getMatrix = function()
	{
		return this.proj().mul( this.view() );
	};
	this.view = function()
	{
		return new Mat4(
				[ this.left.x , this.left.y , this.left.z , -this.left.dot( this.pos ) ,
				this.up.x , this.up.y , this.up.z , -this.up.dot( this.pos ) ,
				this.look.x , this.look.y , this.look.z , -this.look.dot( this.pos ) ,
				0.0 , 0.0 , 0.0 , 1.0 ] );
	};
	this.proj = function()
	{
		return new Mat4(
				[ this.itanx , 0.0 , 0.0 , 0.0 ,
				0.0 , this.itany , 0.0 , 0.0 ,
				0.0 , 0.0 , 1.0 , 0.0 ,//-( this.farz + this.nearz ) / ( this.farz - this.nearz ) , -1.0 ,
				0.0 , 0.0 , 1.0 , 1.0 ]);//-2*this.farz * this.nearz / ( this.farz - this.nearz )  , 0.0 ] );
	};
}


