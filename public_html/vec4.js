function Float4( x , y , z , w)
{
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
	this.w = w || 0.0;
	this.proj = function()
	{
		return this.mul( 1.0 / Math.abs( w ) );
	};
	this.xyz = function()
	{
		return new Float3( x , y , z );
	};
	this.copyIn = function( a )
	{
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
		this.w = a.w;
	};
	this.toArr = function()
	{
		return [ x , y , z , w ];
	};
	this.add = function( a )
	{
		return new Float4( a.x + x , a.y + y , a.z + z , a.w + w );
	};
	this.copy = function()
	{
		return new Float4( x , y , z , w );
	};
	this.dot = function( a )
	{
		return a.x * x + a.y * y + a.z * z + a.w * w;
	};
	this.mul = function( i )
	{
		return new Float4( x * i , y * i , z * i , w * i );
	};
	this.sub = function( a )
	{
		return add( a.mul( -1 ) );
	};
	this.mod2 = function()
	{
		return dot( this );
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
		return Math.sqrt( mod2() );
	};
	this.norm = function()
	{
		return this.div( this.mod() );
	};
	this.mul = function( a )
	{
		var out = [];
		for( var i = 0; i < 4; i++ )
		{
			out[ i ] = a.col( i ).dot( this );
		};
		return new Float4( out[ 0 ] , out[ 1 ] , out[ 2 ] , out[ 3 ] );
	};
}