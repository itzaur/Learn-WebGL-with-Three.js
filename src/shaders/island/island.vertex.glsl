uniform float uSize;
uniform float uRotation;
uniform float uHover;
uniform vec3 uPointer;

#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main() {
    vec4 mvPosition = vec4(position, 1.0);
    mvPosition = instanceMatrix * mvPosition;
    float distance = distance(uPointer, mvPosition.xyz);
    float color = smoothstep(0.95, 0.1, distance);

    float scale = uSize + color * 10.*uHover;

    vec3 pos = position;
    pos *= scale;
    pos.xz *= rotate2d(color * PI * uRotation + PI * uRotation * 0.4);
    pos.xy *= rotate2d(color * PI * uRotation + PI * uRotation * 0.7);
    mvPosition = instanceMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}
