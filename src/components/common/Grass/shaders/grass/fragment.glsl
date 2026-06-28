#include <common>
#include <shadowmap_pars_fragment>

uniform float uTime;
uniform sampler2D uAlphaMap;
uniform vec3 uCenterColor;
uniform vec3 uShadowColor;

varying vec2 vUv;

// Set by the renderer from the receiveShadow flag.
uniform bool receiveShadow;

void main() {
    float alpha = texture2D(uAlphaMap, vUv).r;

    if (alpha < 0.9) {
        discard;
    }

    vec3 baseColor = uCenterColor;

    // Make sides darker
    vec3 finalColor = vec3(vUv.y, vUv.y, 0.0);
    finalColor = mix(baseColor, finalColor, 0.5);

    // Shadows
    float directionalShadow = 1.0;
    #if NUM_DIR_LIGHT_SHADOWS > 0
        vec4 shadowCoord = vDirectionalShadowCoord[0];
        directionalShadow = getShadow(
            directionalShadowMap[0],
            directionalLightShadows[0].shadowMapSize,
            directionalLightShadows[0].shadowIntensity,
            directionalLightShadows[0].shadowBias,
            directionalLightShadows[0].shadowRadius,
            shadowCoord
        );
    #endif
    if (!receiveShadow) directionalShadow = 1.0;

    vec3 shadowTint = finalColor * uShadowColor;
    finalColor = mix(shadowTint, finalColor, directionalShadow);

    // Final color
    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
}