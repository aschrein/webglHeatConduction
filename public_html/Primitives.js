/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Quad( gl )
{
	var out = { };
	out.bufid = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER , out.bufid );
	var vertices = [
		1.0 , 1.0 , 0.0 ,
		-1.0 , 1.0 , 0.0 ,
		1.0 , -1.0 , 0.0 ,
		-1.0 , -1.0 , 0.0
	];
	gl.bufferData( gl.ARRAY_BUFFER , new Float32Array( vertices ) , gl.STATIC_DRAW );
	gl.enableVertexAttribArray( 0 );
	gl.vertexAttribPointer( 0 , 3 , gl.FLOAT , false , 0 , 0 );
	out.index_bufferid = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER , out.index_bufferid );
	var indices = [
		0 , 1 , 2 , 2 , 1 , 3
	];
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER , new Uint16Array( indices ) , gl.STATIC_DRAW );
	out.draw = function()
	{
		gl.bindBuffer( gl.ARRAY_BUFFER , out.bufid );
		gl.vertexAttribPointer( 0 , 3 , gl.FLOAT , false , 0 , 0 );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER , out.index_bufferid );
		gl.drawElements( gl.TRIANGLES , 6 , gl.UNSIGNED_SHORT , 0 );
	};
	return out;
}
function TessQuad( gl , N , M )
{
	var out = { };
	out.bufid = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER , out.bufid );
	var vertices = [ ];
	var indices = [ ];
	var c = 0;
	out.ic = 0;
	for( var n = 0; n <= N; n++ )
	{
		for( var m = 0; m <= M; m++ )
		{
			vertices[ c++ ] = 2.0 * n / N - 1.0;
			vertices[ c++ ] = 2.0 * m / M - 1.0;
			vertices[ c++ ] = 0.0;
			if( n !== N && m !== M )
			{
				indices[ out.ic++ ] = n * ( N + 1 ) + m;
				indices[ out.ic++ ] = n * ( N + 1 ) + m + 1;
				indices[ out.ic++ ] = ( n + 1 ) * ( N + 1 ) + m + 1;
				indices[ out.ic++ ] = n * ( N + 1 ) + m;
				indices[ out.ic++ ] = ( n + 1 ) * ( N + 1 ) + m;
				indices[ out.ic++ ] = ( n + 1 ) * ( N + 1 ) + m + 1;
			}
		}
	}
	gl.bufferData( gl.ARRAY_BUFFER , new Float32Array( vertices ) , gl.STATIC_DRAW );
	gl.enableVertexAttribArray( 0 );
	gl.vertexAttribPointer( 0 , 3 , gl.FLOAT , false , 0 , 0 );
	out.index_bufferid = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER , out.index_bufferid );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER , new Uint16Array( indices ) , gl.STATIC_DRAW );
	out.draw = function( lines )
	{
		gl.bindBuffer( gl.ARRAY_BUFFER , out.bufid );
		gl.vertexAttribPointer( 0 , 3 , gl.FLOAT , false , 0 , 0 );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER , out.index_bufferid );
		if( !lines )
		{
			gl.drawElements( gl.TRIANGLES , out.ic , gl.UNSIGNED_SHORT , 0 );
		} else
		{
			gl.drawElements( gl.LINES , out.ic , gl.UNSIGNED_SHORT , 0 );
		}
	};
	return out;
}
function GridQuad( gl , N , M )
{
	var out = { };
	out.bufid = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER , out.bufid );
	var vertices = [ ];
	var c = 0;
	for( var m = 0; m <= M; m++ )
	{
		var r = ( 2.0 * m ) / M - 1.0;
		vertices[ c++ ] = r;
		vertices[ c++ ] = -1.0;
		vertices[ c++ ] = 0.0;
		vertices[ c++ ] = r;
		vertices[ c++ ] = 1.0;
		vertices[ c++ ] = 0.0;
	}
	for( var n = 0; n <= N; n++ )
	{
		var r = ( 2.0 * n ) / N - 1.0;
		vertices[ c++ ] = -1.0;
		vertices[ c++ ] = r;
		vertices[ c++ ] = 0.0;
		vertices[ c++ ] = 1.0;
		vertices[ c++ ] = r;
		vertices[ c++ ] = 0.0;
	}
	out.c = c / 3;
	gl.bufferData( gl.ARRAY_BUFFER , new Float32Array( vertices ) , gl.STATIC_DRAW );
	gl.enableVertexAttribArray( 0 );
	gl.vertexAttribPointer( 0 , 3 , gl.FLOAT , false , 0 , 0 );
	out.draw = function()
	{
		gl.bindBuffer( gl.ARRAY_BUFFER , out.bufid );
		gl.vertexAttribPointer( 0 , 3 , gl.FLOAT , false , 0 , 0 );
		gl.drawArrays( gl.LINES , 0 , out.c );
	};
	return out;
}