/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function genShader( gl , fragment_id , vertex_id ){
	function getSubShader( gl , id ){
		var shaderScript = document.getElementById( id );
		if( !shaderScript ){
			return null;
		}
		var str = "";
		var k = shaderScript.firstChild;
		while( k ){
			if( k.nodeType === 3 ){
				str += k.textContent;
			}
			k = k.nextSibling;
		}
		var shader;
		var type = id;//"" + ( shaderScript.type ? shaderScript.type : id );
		if( type.indexOf( "frag" ) >- 1 )// === "x-shader/x-fragment" ){
		{
			shader = gl.createShader( gl.FRAGMENT_SHADER );
		} else if( type.indexOf( "vert" ) >- 1 )// === "x-shader/x-vertex" )
		{
			shader = gl.createShader( gl.VERTEX_SHADER );
		} else{
			return null;
		}
		gl.shaderSource( shader , str );
		gl.compileShader( shader );

		if( !gl.getShaderParameter( shader , gl.COMPILE_STATUS ) ){
			alert( gl.getShaderInfoLog( shader ) );
			return null;
		}
		return shader;
	}
	var fragmentShader = getSubShader( gl , fragment_id );
	var vertexShader = getSubShader( gl , vertex_id );

	var out = gl.createProgram();
	gl.attachShader( out , vertexShader );
	gl.attachShader( out , fragmentShader );
	gl.linkProgram( out );

	if( !gl.getProgramParameter( out , gl.LINK_STATUS ) ){
		alert( "Could not initialise shaders:" + fragment_id + ", " + vertex_id );
	}
	out.texture_samplers_count = 0;
	out.resetSamplers = function()
	{
		out.texture_samplers_count = 0;
	};
	out.uniformMap = { };
	out.getUniformLoc = function( name )
	{
		if( !out.uniformMap[ name ] )
		{
			out.uniformMap[ name ] = gl.getUniformLocation( out , name );
		}
		return out.uniformMap[ name ];
	};
	out.bindTexture = function( id , name )
	{
		//if( !out.uniformMap[ name ] )
		{
			out.uniformMap[ name ] = gl.getUniformLocation( out , name );
		}
		gl.activeTexture( gl.TEXTURE0 + out.texture_samplers_count );
		gl.bindTexture( gl.TEXTURE_2D , id );
		gl.uniform1i( out.uniformMap[ name ] , out.texture_samplers_count );
		out.texture_samplers_count += 1;
	};
	return out;
	//shaderProgram.vertexPositionAttribute = gl.getAttribLocation( shaderProgram , "aVertexPosition" );
	//gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );
}
