precision mediump float;
uniform sampler2D uSampler;
varying vec2 vTexCoord;

uniform int uRadius;
uniform int uWidth;
uniform int uHeight;
uniform bool uHorizontal;

vec4 addColors () {

  vec4 colorSum = vec4(0.0);
  vec2 pixelSize = vec2(1.0, 1.0) / vec2(uWidth, uHeight);

  for(int i = 2048; i >= 0; i -= 1) {

      if(i < (2048 - (uRadius * 2))) {
          break;
      }

      int offset = uRadius - (2048 - i);
      if(uHorizontal) {
          colorSum += texture2D(uSampler, vTexCoord + (pixelSize * vec2(offset, 0) ));
      } else {
          colorSum += texture2D(uSampler, vTexCoord + (pixelSize * vec2(0, offset) ));
      }
  }

  return colorSum;
}

void main () {

    if(uRadius == 0) {
        gl_FragColor = texture2D(uSampler, vTexCoord);
    } else {
      vec4 colorSum = addColors();
      float totes = ((float(uRadius) * 2.0) + 1.0) ;
      float divy = 1.0 / totes;
      gl_FragColor = vec4(colorSum.rgb * divy, 1.0);
    }

}
