/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function createGLContext( canvas )
{
	try
	{
		gl = canvas.getContext( "experimental-webgl" );
		gl.getExtension( 'OES_texture_float' );
		gl.getExtension( 'OES_texture_float_linear' );
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.cur_shader = null;
		gl.cur_buffer = null;
		gl.bindTarget = function( buffer )
		{
			{
				gl.cur_buffer = buffer;
				if( !buffer )
				{
					gl.bindFramebuffer( gl.FRAMEBUFFER , null );
					gl.viewport( 0 , 0 , gl.viewportWidth , gl.viewportHeight );
				} else
				{
					gl.bindFramebuffer( gl.FRAMEBUFFER , buffer.id );
					gl.viewport( 0 , 0 , gl.cur_buffer.width , gl.cur_buffer.height );
				}
			}
		};
		gl.clear_color = { r : 0.5 , g : 0.5 , b : 0.5 };
		gl.clearTarget = function()
		{
			gl.clearColor( gl.clear_color.r , gl.clear_color.g , gl.clear_color.b , 1.0 );
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		};
		gl.bindShader = function( shader )
		{
			{
				gl.texture_samplers_count = 0;
				gl.cur_shader = shader;
				gl.useProgram( shader );
				shader.resetSamplers();
			}
		};
		return gl;
	} catch( e )
	{
		alert( e );
		return null;
	} finally
	{
		
	}
}
