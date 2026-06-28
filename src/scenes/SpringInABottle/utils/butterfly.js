// Bottle bounds: the butterfly can never fly past these
const MAX_RADIUS = 0.9
const MAX_Y = 1.8

// The bottle's central axis in the butterflies' parent space
const AXIS_X = -0.023
const AXIS_Z = 0.011

// How far ahead on the path we peek to work out which way the butterfly faces
const LOOK_AHEAD = 0.05

function clampAxis(value, max) {
    return value > 0 ? Math.min(max, value) : Math.max(-max, value)
}

// Stay in the bottle, dear butterfly
function clampRadius(x, z) {
    const offsetX = x - AXIS_X
    const offsetZ = z - AXIS_Z
    const distance = Math.hypot(offsetX, offsetZ)

    if (distance <= MAX_RADIUS) {
        return { x, z }
    }

    const scale = MAX_RADIUS / distance

    return {
        x: AXIS_X + offsetX * scale,
        z: AXIS_Z + offsetZ * scale,
    }
}

function breathingRadius(elapsedTime, orbit, seed) {
    const slow = Math.sin(elapsedTime * orbit.wobbleSpeed + seed)
    const fast = Math.sin(elapsedTime * orbit.wobbleSpeed * 1.7 + seed * 2)

    return (
        orbit.radius +
        slow * orbit.wobbleAmount +
        fast * orbit.wobbleAmount * 0.5
    )
}

function centerDrift(elapsedTime, orbit, seed) {
    return {
        x: Math.sin(elapsedTime * orbit.driftSpeed + seed) * orbit.driftAmount,
        z:
            Math.cos(elapsedTime * orbit.driftSpeed * 0.8 + seed) *
            orbit.driftAmount,
    }
}

function verticalBob(elapsedTime, orbit, seed) {
    const quick = Math.sin(elapsedTime * orbit.bobFrequency + orbit.phaseOffset)
    const slow = Math.sin(elapsedTime * orbit.bobFrequency * 0.5 + seed)

    return quick * orbit.bobAmplitude + slow * orbit.bobAmplitude * 0.5
}

function computeButterflyPosition(elapsedTime, orbit) {
    const seed = orbit.seed ?? 0
    const angle = elapsedTime * orbit.angularSpeed + orbit.phaseOffset

    const radius = breathingRadius(elapsedTime, orbit, seed)
    const drift = centerDrift(elapsedTime, orbit, seed)
    const bob = verticalBob(elapsedTime, orbit, seed)

    return {
        x: orbit.centerX + drift.x + radius * Math.cos(angle),
        y: orbit.centerY + bob,
        z: orbit.centerZ + drift.z + radius * Math.sin(angle),
    }
}

export function setButterflyNextPosition(elapsedTime, groupRef, orbit) {
    if (!groupRef.current) return

    const position = computeButterflyPosition(elapsedTime, orbit)
    const positionAhead = computeButterflyPosition(
        elapsedTime + LOOK_AHEAD,
        orbit
    )

    const horizontal = clampRadius(position.x, position.z)

    groupRef.current.position.set(
        horizontal.x,
        clampAxis(position.y, MAX_Y),
        horizontal.z
    )

    groupRef.current.rotation.y =
        Math.atan2(positionAhead.x - position.x, positionAhead.z - position.z) +
        orbit.headingOffset
}
