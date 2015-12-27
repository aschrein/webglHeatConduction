/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function genFrameBuffer( gl , width , height , depth )
{
	var out = { };
	out.width = width;
	out.height = height;
	out.id = gl.createFramebuffer();
	gl.bindFramebuffer( gl.FRAMEBUFFER , out.id );
	out.texid = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D , out.texid );
	gl.texImage2D( gl.TEXTURE_2D , 0 , gl.RGBA , width , height , 0 , gl.RGBA , gl.FLOAT , null );
	gl.texParameteri( gl.TEXTURE_2D , gl.TEXTURE_MAG_FILTER , gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_2D , gl.TEXTURE_MIN_FILTER , gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_2D , gl.TEXTURE_WRAP_S , gl.CLAMP_TO_EDGE );
	gl.texParameteri( gl.TEXTURE_2D , gl.TEXTURE_WRAP_T , gl.CLAMP_TO_EDGE );
	//gl.generateMipmap( gl.TEXTURE_2D );
	gl.framebufferTexture2D( gl.FRAMEBUFFER , gl.COLOR_ATTACHMENT0 , gl.TEXTURE_2D , out.texid , 0 );
	out.depthid = null;
	if( depth )
	{
		out.depthid = gl.createRenderbuffer();
		gl.bindRenderbuffer( gl.RENDERBUFFER , out.depthid );
		gl.renderbufferStorage( gl.RENDERBUFFER , gl.DEPTH_COMPONENT16 , width , height );
		gl.framebufferRenderbuffer( gl.FRAMEBUFFER , gl.DEPTH_ATTACHMENT , gl.RENDERBUFFER , out.depthid );
		gl.bindRenderbuffer( gl.RENDERBUFFER , null );
	}
	gl.bindTexture( gl.TEXTURE_2D , null );
	gl.bindFramebuffer( gl.FRAMEBUFFER , null );
	return out;
}