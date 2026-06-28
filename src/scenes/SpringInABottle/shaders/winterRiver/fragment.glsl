uniform float uTime;

uniform vec3 uEdgeColor;
uniform vec3 uDepthColor;

uniform sampler2D uDepthMap;
uniform sampler2D uPerlinNoise;

uniform vec3 uFresnelColor;
uniform float uFresnelPower;
uniform float uFresnelStrength;

uniform vec3 uCrackColor;
uniform float uCrackScale;
uniform float uCrackWidth;
uniform float uCrackStrength;

uniform vec3 uBubbleColor;
uniform float uBubbleScale;
uniform float uBubbleSize;
uniform float uBubbleStrength;

uniform vec3 uFrostColor;
uniform float uFrostStrength;

uniform vec3 uWaterColor;
uniform float uFlowSpeed;
uniform float uFlowStrength;
uniform float uFreezeLevel;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

#include "../includes/voronoiEdges.glsl"

void main() {
    float depth = texture2D(uDepthMap, vUv).r;

    // FinalColor
    vec3 finalColor = mix(uDepthColor, uEdgeColor, pow(depth, 1.7));

    // Frost
    float perlin = texture2D(uPerlinNoise, vUv * 3.0).r;
    float edgeMask = smoothstep(0.1, 0.45, depth * 1.5);
    float frost = smoothstep(0.3, 0.7, perlin) * uFrostStrength;
    finalColor = mix(finalColor, uFrostColor, frost);

    // Cracks
    vec2 voronoiDistances = voronoi(vUv * uCrackScale);
    float cellBorder = voronoiDistances.y - voronoiDistances.x;
    float crackWidth = uCrackWidth * (1.0 + (1.0 - depth));
    float crack = 1.0 - smoothstep(0.0, crackWidth, cellBorder);
    finalColor = mix(finalColor, uCrackColor, crack * uCrackStrength);

    // Trapped air bubbles
    float bubbleDistance = voronoi(vUv * uBubbleScale).x;
    float bubble = 1.0 - smoothstep(0.0, uBubbleSize, bubbleDistance);
    finalColor = mix(finalColor, uBubbleColor, bubble * uBubbleStrength * depth);

    // Flowing water in the deep
    vec2 flowCoordinates = vUv * 4.0 + vec2(uTime * uFlowSpeed, uTime * uFlowSpeed * 0.5);
    float flowNoise = texture2D(uPerlinNoise, flowCoordinates).r;
    float counterFlowNoise = texture2D(uPerlinNoise, vUv * 6.0 - vec2(uTime * uFlowSpeed * 0.7, 0.0)).r;
    float ripple = flowNoise * counterFlowNoise;
    vec3 waterColor = mix(uWaterColor, uEdgeColor, ripple * uFlowStrength);
    waterColor += pow(ripple, 4.0) * uFlowStrength;
    float openWaterMask = 1.0 - smoothstep(0.0, uFreezeLevel, depth);
    finalColor = mix(finalColor, waterColor, openWaterMask);

    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(
        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
        uFresnelPower
    );
    finalColor = mix(finalColor, uFresnelColor, fresnel * uFresnelStrength);

    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
}
