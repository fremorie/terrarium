export function generateSnowflakePositions(
    snowflakeCount = 5000,
    sceneRadius = 0.7,
    sceneHeight = 1.7
) {
    const snowflakePositions = new Float32Array(snowflakeCount * 3)

    for (let i = 0; i < snowflakeCount; i++) {
        const i3 = i * 3

        // Keep snowflake inside a circle (R = 1)
        const angle = Math.random() * Math.PI * 2
        const radius = Math.sqrt(Math.random()) * sceneRadius

        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        // x
        // Random number between [-20, 20]
        snowflakePositions[i3] = x
        // y
        // Always positive: we don't want underground snowflakes
        snowflakePositions[i3 + 1] = Math.random() * sceneHeight
        // z
        // Random number between [-20, 20]
        snowflakePositions[i3 + 2] = z
    }

    return snowflakePositions
}
