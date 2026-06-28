#include <common>
#include <shadowmap_pars_vertex>

uniform float uTime;

attribute float aBladeRandom;

varying vec2 vUv;

#include "../includes/perlinNoise.glsl"

const vec2 WIND_DIRECTION = vec2(0.8, -0.5);
const float WIND_SPEED = 0.3;
const float WIND_FREQUENCY = 0.8;
const float WIND_STRENGTH = 0.03;

void main() {
    vec3 instanceWorldOrigin = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 windSamplePosition =
        instanceWorldOrigin.xz * WIND_FREQUENCY - WIND_DIRECTION * uTime * WIND_SPEED;

    // Wind gusts
    float gust = cnoise(vec3(windSamplePosition, 0.0));
    float flutter = cnoise(
        vec3(windSamplePosition * 3.0 + aBladeRandom * 10.0, uTime * 0.6 + aBladeRandom)
    );

    // Each blade bends a little more or less than its neighbours
    float bladeStrength = 0.8 + aBladeRandom * 0.6;
    float windAmount = (gust + flutter * 0.3) * bladeStrength;

    float windMultiplier = smoothstep(0.0, 1.0, uv.y);

    vec3 localPosition = position;
    localPosition.x += windAmount * windMultiplier * WIND_STRENGTH;

    // Always face the camera
    vec3 cameraModelSpace = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
    vec3 instanceModelOrigin = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 toCamera = cameraModelSpace - instanceModelOrigin;
    float facingAngle = atan(toCamera.x, toCamera.z);
    float sinAngle = sin(facingAngle);
    float cosAngle = cos(facingAngle);
    localPosition = vec3(
        localPosition.x * cosAngle + localPosition.z * sinAngle,
        localPosition.y,
        -localPosition.x * sinAngle + localPosition.z * cosAngle
    );

    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(localPosition, 1.0);

    vec4 viewPosition = viewMatrix * worldPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;

    // Feed world position + normal into three's shadow chunk
    vec3 transformedNormal = normalMatrix * normal;
    #include <shadowmap_vertex>
}
