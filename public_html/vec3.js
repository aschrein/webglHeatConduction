/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Float3( x , y , z )
{
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
	this.xyz = function()
	{
		return new Float3( x , y , z );
	};
	this.copyIn = function( a )
	{
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
	};
	this.toArr = function()
	{
		return [ this.x , this.y , this.z ];
	};
	this.add = function( a )
	{
		return new Float3( a.x + this.x , a.y + this.y , a.z + this.z );
	};
	this.copy = function()
	{
		return new Float3( this.x , this.y , this.z );
	};
	this.dot = function( a )
	{
		return a.x * this.x + a.y * this.y + a.z * this.z;
	};
	this.mul = function( i )
	{
		return new Float3( this.x * i , this.y * i , this.z * i );
	};
	this.sub = function( a )
	{
		return this.add( a.mul( -1 ) );
	};
	this.mod2 = function()
	{
		return this.dot( this );
	};
	this.dist2 = function( a )
	{
		return this.sub( a ).mod2();
	};
	this.div = function( i )
	{
		return this.mul(  1.0 / i );
	};
	this.mod = function()
	{
		return Math.sqrt( this.mod2() );
	};
	this.norm = function()
	{
		return this.div( this.mod() );
	};
	this.vecx = function( v )
	{
		return new Float3( this.y * v.z - this.z * v.y , -this.x * v.z + this.z * v.x , this.x * v.y - this.y * v.x );
	};
}