export function generateCherryBlossomPetalPositions(
    count = 5000,
    sceneRadius = 0.8,
    sceneHeight = 2
) {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Keep petals inside a circle
        const angle = Math.random() * Math.PI * 2
        const radius = Math.sqrt(Math.random()) * sceneRadius

        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        positions[i3] = x
        positions[i3 + 1] = Math.random() * sceneHeight
        positions[i3 + 2] = z

        seeds[i] = Math.random()

        sizes[i] = 0.6 + Math.random() * 0.8
    }

    return { positions, seeds, sizes }
}
