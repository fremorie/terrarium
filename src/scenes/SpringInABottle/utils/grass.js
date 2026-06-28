import * as THREE from 'three'

const RAYCAST_ORIGIN_HEIGHT = 5

const raycaster = new THREE.Raycaster()
const downDirection = new THREE.Vector3(0, -1, 0)
const rayOrigin = new THREE.Vector3()

export const getGrassBladesPositions = (
    terrainRaycasterMesh,
    center,
    radius,
    count
) => {
    const positions = []
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.sqrt(Math.random()) * radius
        const x = center[0] + Math.cos(angle) * distance
        const z = center[1] + Math.sin(angle) * distance

        raycaster.set(rayOrigin.set(x, RAYCAST_ORIGIN_HEIGHT, z), downDirection)
        const intersections = raycaster.intersectObject(terrainRaycasterMesh)

        if (intersections.length > 0) {
            positions.push([
                x,
                // Push them down a little
                intersections[0].point.y - 0.01,
                z,
            ])
        }
    }
    return positions
}

export const GRASS_CONFIG = [
    {
        center: [-0.94, -0.13],
        radius: 0.12,
        count: 184,
    },
    {
        center: [-0.89, 0.05],
        radius: 0.1,
        count: 102,
    },
    {
        center: [-0.05, -0.9],
        radius: 0.08,
        count: 38,
    },
    {
        center: [-0.11, -0.25],
        radius: 0.08,
        count: 108,
    },
    {
        center: [-0.12, -0.12],
        radius: 0.04,
        count: 20,
    },
    {
        center: [0.22, 0.01],
        radius: 0.1,
        count: 155,
    },
    {
        center: [0.33, 0.13],
        radius: 0.07,
        count: 67,
    },
    {
        center: [0.44, 0.79],
        radius: 0.04,
        count: 26,
    },
    {
        center: [-0.47, 0.41],
        radius: 0.08,
        count: 60,
    },
    {
        center: [0.58, -0.24],
        radius: 0.05,
        count: 73,
    },
    {
        center: [0.4, 0.47],
        radius: 0.09,
        count: 143,
    },
    {
        center: [0.33, 0.36],
        radius: 0.05,
        count: 78,
    },
]
