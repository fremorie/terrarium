uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uLightColor;
uniform vec3 uDarkColor;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    float mask = texture2D(uTexture, vUv).r;
    float alpha = smoothstep(0.2, 0.6, mask);

    if (alpha < 0.01) {
        discard;
    }

    vec3 finalColor = mix(uLightColor, uDarkColor, vUv.y);

    gl_FragColor = vec4(finalColor, alpha);

    #include <colorspace_fragment>
}