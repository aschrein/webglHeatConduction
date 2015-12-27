/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Mat4( a )
{
	this.m = [ ];
	if( a )
	{
		for( var i = 0; i < 16; i++ )
		{
			this.m[ i ] = a[ i ];
		}
	} else
	{
		for( var i = 0; i < 16; i++ )
		{
			this.m[ i ] = 0.0;
		}
		for( var j = 0; j < 4; j++ )
		{
			this.m[j * 4 + j] = 1.0;
		}
	}
	this.row = function( i )
	{
		return new Float4( this.m[i * 4] , this.m[i * 4 + 1] , this.m[i * 4 + 2] , this.m[i * 4 + 3] );
	};
	this.col = function( i )
	{
		return new Float4( this.m[i] , this.m[i + 4] , this.m[i + 8] , this.m[i + 12] );
	};
	this.trans = function()
	{
		var out = [ ];
		for( var i = 0; i < 4; i++ )
		{
			for( var j = 0; j < 4; j++ )
			{
				out[i * 4 + j] = this.m[ j * 4 + i ];
			}
		}
		return new Mat4( out );
	};
	/*this.mul = function( a )
	{
		var out = [ ];
		for( var i = 0; i < 4; i++ )
		{
			out[i] = row( i ).dot( a );
		}
		return new Float4( out );
	};*/
	this.mul = function( a )
	{
		var out = [ ];
		for( var i = 0; i < 4; i++ )
		{
			for( var j = 0; j < 4; j++ )
			{
				out[i * 4 + j] = this.row( i ).dot( a.col( j ) );
			}
		}
		return new Mat4( out );
	};
}
