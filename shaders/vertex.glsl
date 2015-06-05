attribute vec4 aVertexPos;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main () {

    gl_Position = aVertexPos;
    vTexCoord = aTexCoord;

}
