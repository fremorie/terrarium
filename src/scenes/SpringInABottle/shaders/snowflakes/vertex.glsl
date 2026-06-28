uniform float uTime;

varying float vRotation;
varying vec4 vPosition;

float random(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1);

    // Falling down
    float speed = mix(0.5, 2.0, random(position));
    modelPosition.y -= uTime * speed;

    // Loop back to top
    modelPosition.y = mod(modelPosition.y + 1.8, 1.8);

    // Wind
    float offset = random(position) * 10.0;
    modelPosition.x += sin(uTime + offset) * 0.3;
    modelPosition.z += cos(uTime + offset) * 0.3;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 60.0;
    gl_PointSize *= 1.0 / -viewPosition.z;

    if (gl_PointSize < 1.0) {
        gl_Position = vec4(9999.9);
    }

    // Varyings
    vRotation = sin(uTime) * 10.0;
    vPosition = modelPosition;
}