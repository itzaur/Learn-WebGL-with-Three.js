//RawShadingMaterial
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix; // ==uniform mat4 viewMatrix + uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;//RawShadingMaterial
// attribute float aRandom;
// attribute vec2 uv;

// varying float vRandom;
varying vec2 vUv; 
varying float vElevation;

float loremIpsum() {
    float a = 1.0;
    float b = 2.0;
    return a + b;
}

float test(float a, float b) {
    return a + b;
}

//If the function isn't supposed to return anything, we can use void
void stuff() {
    float a = 1.0;
    float b = 1.2;
}

void main() {
    float result = loremIpsum();
    // float resultStuff = stuff(); //not working
    float resultTest = test(1.0, 2.0);

    float fooBar = 1.45;
    float a = 1.0;
    float b = 2.0;
    float c = a + b;

    int foo = 2;
    int bar = -147;
    int res = foo / bar;

    // float f = a + foo; //Error (not mixing)
    float f = a + float(foo); //convert
    int d = bar - int(a);

    bool s = true;
    bool pw = false;

    vec2 goo = vec2(1.0, 3.0);
    // vec2 goo2 = vec2(); //not working
    vec2 goo2 = vec2(0.0); //=vec2(0.0, 0.0)
    goo2.x = 2.0;
    goo2.y = 3.0;
    goo *= 2.0;

    vec3 dip = vec3(0.0);
    vec3 dis = vec3(0.0, 1.2, 2.4);
    dis.z = 4.0;
    dis *= 1.5;

    vec3 purpleColor = vec3(0.0); //r, g, b aliases x, y, z
    purpleColor.r = 1.0;
    purpleColor.b = 0.5;

    vec2 dew = vec2(1.0, 4.0);
    vec3 weq = vec3(dew, 1.0); //or vec3(dew.x, dew.y, 1.0);

    vec3 gt = vec3(0.0, 7.0, 1.0);
    vec2 ret = gt.xy;

    vec4 yyy = vec4(1.0, 2.0, 3.0, 4.0); //x, y, z, w => aliases r, g, b, a
    vec4 bbb = vec4(yyy.zw, 1.0, 1.5);
    float gfd = yyy.w;



    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    modelPosition.z += elevation;
    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    
    // modelPosition.z += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition; //modelPosition * viewMatrix not working
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}