/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var gl;
var camera = getLookAt( new Float3( 0.0 , 1.0 , 1.5 ) , new Float3( 0.0 , 0.0 , 0.0 ) , new Float3( 0.0 , 1.0 , 0.0 ) , 0.5 , 0.5 );
var InputHandler = ( function()
{
	this._pressed = [ ];
	this.isDown = function( key_char )
	{
		return this._pressed[ key_char ];
	};
	this.onKeydown = function( event )
	{
		this._pressed[ String.fromCharCode( event.keyCode ) ] = true;
	};
	this.onKeyup = function( event )
	{
		delete this._pressed[ String.fromCharCode( event.keyCode ) ];
	};
	return this;
} )();
var phi = 0.0;
var theta = 1.4;
var mouseposx = 0;
var mouseposy = 0;
var drag = false;
var viewproj;
window.addEventListener( 'mousedown' , function( e )
{
	mouseposx = e.pageX;
	mouseposy = e.pageY;
	drag = true;
} , false );
window.addEventListener( 'mouseup' , function( e )
{
	drag = false;
} , false );
var recalcMatrix = function()
{
	viewproj = camera.getMatrix();
};
window.addEventListener( 'mousemove' , function( e )
{
	if( !drag )
		return;
	phi -= ( e.pageX - mouseposx ) * 0.01;
	theta -= ( e.pageY - mouseposy ) * 0.01;
	//phi = phi > 3.14 ? 3.14 : phi < -3.14 ? -3.14 : phi;
	theta = theta > 3.13 ? 3.13 : theta < 0.01 ? 0.01 : theta;
	mouseposx = e.pageX;
	mouseposy = e.pageY;
	camera = getLookAt( new Float3( Math.sin( theta ) * Math.cos( phi ) , Math.sin( theta ) * Math.sin( phi ) , Math.cos( theta ) ).mul( 1.0 ) , new Float3( 0.0 , 0.0 , 0.0 ) , new Float3( 0.0 , 0.0 , 1.0 ) , 0.8 , 0.8 );
	recalcMatrix();
} , false );
function Solver()
{
	this.fbuf = [ genFrameBuffer( gl , 128 , 128 , null ) , genFrameBuffer( gl , 128 , 128 , null ) ];
	this.fill_shader = genShader( gl , "fill_frag" , "simple_vert" );
	this.proc_shader = genShader( gl , "proc_frag" , "simple_vert" );
	this.border_shader = genShader( gl , "border_frag" , "simple_vert" );
	this.copy_shader = genShader( gl , "copy_frag" , "simple_vert" );
	this.point_shader = genShader( gl , "point_frag" , "point_vert" );
	this.fullscreen_quad = Quad( gl , 1 , 1 );
	this.last_time = new Date().getTime() * 1.0e-3;
	this.frame_counter = 0;
	this.proc_buf = 0;
	this.tgr_buf = 1;
	this.swapBuf = function()
	{
		var tmp = this.tgr_buf;
		this.tgr_buf = this.proc_buf;
		this.proc_buf = tmp;
	};
	gl.bindTarget( this.fbuf[ this.tgr_buf ] );
	gl.clearTarget();
	{
		gl.bindTarget( this.fbuf[ this.proc_buf ] );
		gl.clearTarget();
		gl.bindShader( this.fill_shader );
		this.fullscreen_quad.draw();
	}
	this.last_dt = 0.016;
	this.dt_sum = 0.0;
	this.dt_k = 10.0;
	this.process = function()
	{
		gl.disable( gl.DEPTH_TEST );
		gl.disable( gl.BLEND );
		{
			gl.bindTarget( this.fbuf[ this.tgr_buf ] );
			gl.bindShader( this.proc_shader );
			gl.uniform1f( this.proc_shader.getUniformLoc( "dt" ) , this.last_dt * this.dt_k );
			gl.uniform2f( this.proc_shader.getUniformLoc( "viewport_size" ) , this.fbuf[ this.tgr_buf ].width , this.fbuf[ this.tgr_buf ].height );
			this.proc_shader.bindTexture( this.fbuf[ this.proc_buf ].texid , "texture" );
			this.fullscreen_quad.draw();
			this.swapBuf();
		}
		{
			gl.bindTarget( this.fbuf[ this.tgr_buf ] );
			gl.bindShader( this.border_shader );
			gl.uniform2f( this.border_shader.getUniformLoc( "viewport_size" ) , this.fbuf[ this.tgr_buf ].width , this.fbuf[ this.tgr_buf ].height );
			this.border_shader.bindTexture( this.fbuf[ this.proc_buf ].texid , "texture" );
			this.fullscreen_quad.draw();
			this.swapBuf();
		}
		/*gl.bindTarget( null );
		 gl.clearTarget();
		 gl.bindShader( this.copy_shader );
		 this.copy_shader.bindTexture( this.fbuf[ this.proc_buf ].texid , 0 );
		 this.fullscreen_quad.draw();*/
		/*this.cur_time = new Date().getTime() * 1.0e-3;
		 this.last_dt = ( this.cur_time - this.last_time );
		 this.last_time = this.cur_time;
		 this.dt_sum += this.last_dt;
		 if( this.frame_counter === 100 )
		 {
		 this.dt_sum = 0.0;
		 this.frame_counter = 1;
		 }
		 this.frame_counter++;*/
		return this.fbuf[ this.proc_buf ].texid;
	};
}
var testFunc = function()
{
	var canvas = document.getElementById( "main_canvas" );
	gl = createGLContext( canvas );

	var grid = GridQuad( gl , 4 , 4 );
	var quad = TessQuad( gl , 64 , 64 );
	var simple_quad = TessQuad( gl , 1 , 1 );
	var grid_shader = genShader( gl , "grid_frag" , "grid_vert" );
	var plane_shader = genShader( gl , "plane_frag" , "plane_vert" );
	var voxel_shader = genShader( gl , "voxel_frag" , "voxel_vert" );
	var solver = new Solver();
	window.addEventListener( 'keyup' , function( event )
	{
		InputHandler.onKeyup( event );
	} , false );
	window.addEventListener( 'keydown' , function( event )
	{
		InputHandler.onKeydown( event );
	} , false );

	setInterval( function()
	{

		recalcMatrix();
		var texid = solver.process();
		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );
		gl.enable( gl.BLEND );
		gl.bindTarget( null );
		gl.clearTarget();
		if( InputHandler.isDown( "S" ) )
		{
			gl.bindShader( solver.copy_shader );
			solver.copy_shader.bindTexture( texid , "texture" );
			solver.fullscreen_quad.draw();
		} else
		{
			gl.bindShader( grid_shader );
			gl.uniformMatrix4fv( grid_shader.getUniformLoc( "viewproj" ) , gl.GL_FALSE , new Float32Array( viewproj.m ) );
			grid.draw();

			if( InputHandler.isDown( "W" ) )
			{
				//gl.blendEquationSeparate( gl.FUNC_ADD , gl.FUNC_ADD );
				//gl.blendFuncSeparate( gl.SRC_ALPHA , gl.ONE_MINUS_SRC_ALPHA , gl.ONE , gl.ZERO );
				gl.blendFunc( gl.SRC_COLOR , gl.ONE_MINUS_SRC_COLOR );
				gl.bindShader( voxel_shader );
				gl.uniformMatrix4fv( voxel_shader.getUniformLoc( "viewproj" ) , gl.GL_FALSE , new Float32Array( viewproj.m ) );
				gl.uniform3fv( voxel_shader.getUniformLoc( "up" ) , new Float32Array( camera.up.toArr() ) );
				gl.uniform3fv( voxel_shader.getUniformLoc( "left" ) , new Float32Array( camera.left.toArr() ) );
				gl.uniform3fv( voxel_shader.getUniformLoc( "look" ) , new Float32Array( camera.look.toArr() ) );
				var N = 1000;
				var near = -1.5;
				var far = 1.5;
				for( var i = 0; i <= N; i++ )
				{
					var x = i / N;
					var k = Math.pow( x , 0.5 );
					var z = far * ( 1.0 - k ) + near * k;
					gl.uniform1f( voxel_shader.getUniformLoc( "z" ) , z );
					simple_quad.draw();
				}
			} else
			{
				gl.bindShader( plane_shader );
				plane_shader.bindTexture( texid , "texture" );
				gl.uniform1i( plane_shader.getUniformLoc( "fill" ) , 0 );
				gl.uniformMatrix4fv( plane_shader.getUniformLoc( "viewproj" ) , gl.GL_FALSE , new Float32Array( viewproj.m ) );
				quad.draw();
			}
			gl.disable( gl.DEPTH_TEST );
			gl.bindShader( plane_shader );
			plane_shader.bindTexture( texid , "texture" );
			gl.uniformMatrix4fv( plane_shader.getUniformLoc( "viewproj" ) , gl.GL_FALSE , new Float32Array( viewproj.m ) );
			gl.blendFunc( gl.ONE , gl.ONE_MINUS_SRC_ALPHA );
			gl.uniform1i( plane_shader.getUniformLoc( "fill" ) , 1 );
			quad.draw( true );
		}
	} , 16 );
};
