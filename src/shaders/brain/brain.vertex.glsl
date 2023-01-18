uniform vec3 uColor;
uniform vec3 uPointer;
uniform float uSize;
uniform float uRotation;
uniform float uHover;

varying vec3 vColor;

#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

// mat2 rotate(float angle) {
//   float s = sin(angle);
//   float c = cos(angle);

//   return mat2(c, -s, s, c);
// }

void main() {
    // First, calculate `mvPosition` to get the distance between the instance and the projected point `uPointer`.
    vec4 mvPosition = vec4(position, 1.0);
    mvPosition = instanceMatrix * mvPosition;

    // Distance between the point projected from the mouse and each instance
    float dist = distance(uPointer, mvPosition.xyz);
   
    // Define the color depending on the above value
    float col = smoothstep(0.45, 0.1, dist);

    float scale = uSize + col * 8.*uHover;

    vec3 pos = position;
    pos *= scale;
    pos.xz *= rotate2d(PI * col * uRotation + PI * uRotation * 0.4);
    pos.xy *= rotate2d(PI * col * uRotation + PI * uRotation * 0.7);

    mvPosition = instanceMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;

    vColor = uColor;
}
