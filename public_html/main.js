/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gl;

function initGL()
{
	var canvas = document.getElementById( "main_canvas" );
	var temperature_point = { x : 0.5 , y : 0.5 };
	var temperature_label = document.getElementById( "temperature_label" );
	temperature_label.style.position = 'absolute';
	gl = createGLContext( canvas );
	canvas.onclick = function( e )
	{
		var mouseX = e.pageX - canvas.offsetLeft;
		var mouseY = e.pageY - canvas.offsetTop;
		if( mouseX < gl.viewportWidth && mouseY < gl.viewportHeight )
		{
			temperature_point.x = mouseX / gl.viewportWidth;
			temperature_point.y = 1.0 - mouseY / gl.viewportHeight;
			//temperature_label.style.left = mouseX + 'px';
			//temperature_label.style.top = ( mouseY + 16 ) + 'px';
		}
	};
	var fbuf = [ genFrameBuffer( gl , 128 , 128 , null ) , genFrameBuffer( gl , 128 , 128 , null ) ];
	var fill_shader = genShader( gl , "fill_frag" , "simple_vert" );
	var proc_shader = genShader( gl , "proc_frag" , "simple_vert" );
	var border_shader = genShader( gl , "border_frag" , "simple_vert" );
	var copy_shader = genShader( gl , "copy_frag" , "simple_vert" );
	var point_shader = genShader( gl , "point_frag" , "point_vert" );
	var fullscreen_quad = Quad( gl );
	var last_time = new Date().getTime() * 1.0e-3;
	var frame_counter = 0;
	var proc_buf = 0;
	var tgr_buf = 1;
	var swapBuf = function()
	{
		var tmp = tgr_buf;
		tgr_buf = proc_buf;
		proc_buf = tmp;
	};
	gl.disable( gl.DEPTH_TEST );
	gl.disable( gl.BLEND );
	gl.bindTarget( fbuf[ tgr_buf ] );
	gl.clearTarget();
	{
		gl.bindTarget( fbuf[ proc_buf ] );
		gl.clearTarget();
		gl.bindShader( fill_shader );
		fullscreen_quad.draw();
	}
	var last_dt = 0.016;
	var dt_sum = 0.0;
	var dt_k = 1.0;
	$( "#dt_range" ).on( "change" , function(){
		dt_k = this.value * 0.1;
		console.log( this.value );
	} );
	setInterval( function()
	{
		gl.disable( gl.BLEND );
		{
			gl.bindTarget( fbuf[ tgr_buf ] );
			gl.bindShader( proc_shader );
			gl.uniform1f( proc_shader.getUniformLoc( "dt" ) , last_dt * dt_k );
			gl.uniform2f( proc_shader.getUniformLoc( "viewport_size" ) , fbuf[ tgr_buf ].width , fbuf[ tgr_buf ].height );
			proc_shader.bindTexture( fbuf[ proc_buf ].texid , "texture" );
			fullscreen_quad.draw();
			swapBuf();
		}
		{
			gl.bindTarget( fbuf[ tgr_buf ] );
			gl.bindShader( border_shader );
			gl.uniform2f( border_shader.getUniformLoc( "viewport_size" ) , fbuf[ tgr_buf ].width , fbuf[ tgr_buf ].height );
			border_shader.bindTexture( fbuf[ proc_buf ].texid , "texture" );
			fullscreen_quad.draw();
			swapBuf();
		}
		var pixels = new Float32Array( 4 );
		gl.readPixels( temperature_point.x * fbuf[ proc_buf ].width , temperature_point.y * fbuf[ proc_buf ].height , 1 , 1 , gl.RGBA , gl.FLOAT , pixels );
		temperature_label.innerHTML = pixels[ 0 ];
		//console.log( pixels[ 0 ] );
		gl.bindTarget( null );
		gl.clearTarget();
		gl.bindShader( copy_shader );
		copy_shader.bindTexture( fbuf[ proc_buf ].texid , 0 );
		fullscreen_quad.draw();


		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA , gl.ONE_MINUS_SRC_ALPHA );
		gl.bindShader( point_shader );
		gl.uniform2f( point_shader.getUniformLoc( "size" ) , 0.01 , 0.01 );
		gl.uniform2f( point_shader.getUniformLoc( "pos" ) , 2.0 * temperature_point.x - 1 , 2.0 * temperature_point.y - 1 );
		fullscreen_quad.draw();

		var cur_time = new Date().getTime() * 1.0e-3;
		last_dt = ( cur_time - last_time );
		last_time = cur_time;
		dt_sum += last_dt;
		if( frame_counter === 100 )
		{
			//console.log( dt_sum * 1.0e1 );
			dt_sum = 0.0;
			frame_counter = 1;
		}
		frame_counter++;
	} , 16 );

	if( !gl )
	{
		alert( "Could not initialise WebGL" );
	}
}
