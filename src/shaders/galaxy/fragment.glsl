// precision mediump float;

// void main() {
//     gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
// }


// precision mediump float;

// varying vec3 vColor;

// void main() {
//     //Disc
//     // float strength = distance(gl_PointCoord, vec2(0.5));
//     // strength = step(0.5, strength);
//     // strength = 1.0 - strength;

//     //Diffuse point
//     // float strength = distance(gl_PointCoord, vec2(0.5));
//     // strength *= 2.0;
//     // strength = 1.0 - strength;

//     //Light point
//     float strength = distance(gl_PointCoord, vec2(0.5));
//     strength = 1.0 - strength;
//     strength = pow(strength, 10.0);

//     //Final color
//     vec3 color = mix(vec3(0.0), vColor, strength);


//     gl_FragColor = vec4(color, 1.0);
// }

precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;


void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    // textureColor.rgb *= vElevation * 2.0 + 0.5;
    gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
    // gl_FragColor = textureColor;
}