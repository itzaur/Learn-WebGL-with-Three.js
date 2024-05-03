// uniform vec2 uFrequency;
// uniform float uTime;

// void main() {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
//     elevation += cos(modelPosition.y * uFrequency.y + uTime) * 0.1;
//     modelPosition.z += elevation;
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;
// }
uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.y - uTime) * 0.1;
    elevation += cos(modelPosition.y * uFrequency.x - uTime) * 0.1;

    modelPosition.y += elevation;
    // modelPosition.z += cos(modelPosition.y * uFrequency.x + uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
}