uniform float uTime;

attribute float aSeed;
attribute float aSize;

varying float vRotation;
varying float vTumble;
varying vec4 vPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float phase = aSeed * 6.2831853;

    // Falling down
    float fallSpeed = mix(0.5, 1.0, aSeed);
    modelPosition.y -= uTime * fallSpeed;

    // Loop back to top
    float groundLevel = 0.5;
    float topLevel = 2.0;
    modelPosition.y =
        groundLevel + mod(modelPosition.y - groundLevel, topLevel - groundLevel);

    // Wind
    float swaySlow = sin(uTime * 6.0 + phase);
    float swayFast = sin(uTime * 14.0 + phase * 1.7);
    modelPosition.x += swaySlow * 0.28 + swayFast * 0.06;
    modelPosition.z += cos(uTime * 5.5 + phase) * 0.24 + swayFast * 0.05;

    // Keep petals contained within the bottle radius on XZ
    float containmentRadius = 0.9;
    float horizontalRadius = length(modelPosition.xz);
    if (horizontalRadius > containmentRadius) {
        modelPosition.xz *= containmentRadius / horizontalRadius;
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Grow in at the top and shrink to nothing at the ground
    float fadeDistance = 0.25;
    float bottomScale =
        smoothstep(groundLevel, groundLevel + fadeDistance, modelPosition.y);
    float topScale =
        1.0 - smoothstep(topLevel - fadeDistance, topLevel, modelPosition.y);
    float heightScale = bottomScale * topScale;

    gl_PointSize = 90.0 * aSize * heightScale;
    gl_PointSize *= 1.0 / -viewPosition.z;

    if (gl_PointSize < 1.0) {
        gl_Position = vec4(9999.9);
    }

    float spinSpeed = mix(8.0, 16.0, aSeed);
    vRotation = uTime * spinSpeed + phase;

    // Varyings
    vTumble = sin(uTime * 9.0 + phase);
    vPosition = modelPosition;
}
