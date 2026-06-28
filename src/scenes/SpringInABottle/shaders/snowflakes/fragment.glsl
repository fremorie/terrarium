uniform sampler2D uTexture;

varying float vRotation;
varying vec4 vPosition;

vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);

    uv -= 0.5;
    uv = mat2(c, -s, s, c) * uv;
    uv += 0.5;

    return uv;
}

void main() {
    vec2 uv = gl_PointCoord;
    uv = rotate(uv, vRotation);

    vec4 color = texture2D(uTexture, uv);

    float alpha = smoothstep(0.6, 0.9, vPosition.y);

    gl_FragColor = vec4(color.rgb, alpha);
}