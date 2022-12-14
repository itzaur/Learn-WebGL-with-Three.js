// uniform float uSize;

// attribute float aScale;

// void main() {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;
//     gl_PointSize = uSize * aScale;
//     gl_PointSize *= ( 1.0 / - viewPosition.z );
// }



// uniform float uSize;
// uniform float uTime;

// attribute float aScale;
// attribute vec3 aRandomness;

// varying vec3 vColor;

// void main() {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     float angle = atan(modelPosition.x, modelPosition.z);
//     float distanceToCenter = length(modelPosition.xz);
//     float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
//     angle += angleOffset; 
//     modelPosition.x = cos(angle) * distanceToCenter;
//     modelPosition.z = sin(angle) * distanceToCenter;

//     //Randomness
//     modelPosition.xyz += aRandomness;

//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;
//     gl_PointSize = uSize * aScale;
//     gl_PointSize *= ( 1.0 / - viewPosition.z );

//     vColor = color;
// }

uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;


varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x + uTime) * sin(modelPosition.y + uTime) * 0.1;
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.5;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;
 


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);
    // gl_PointSize = gl_PointSize * uSize;

    vUv = uv;
    vElevation = elevation;
}