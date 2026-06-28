import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'

import { ButterflyModel } from './ButterflyModel'
import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'

export function Butterflies({ store }) {
    const stencil = useStencil(SEASONS.spring)

    const {
        color,
        metalness,
        roughness,
        orbitRadius,
        centerX,
        centerY,
        centerZ,
        angularSpeed,
        bobAmplitude,
        bobFrequency,
        headingOffset,
        wobbleAmount,
        wobbleSpeed,
        driftAmount,
        driftSpeed,
    } = useControls(
        'Butterfly',
        {
            color: '#9bb7f5',
            metalness: { value: 0, min: 0, max: 1, step: 0.01 },
            roughness: { value: 0.1, min: 0, max: 1, step: 0.01 },
            orbitRadius: { value: 0.4, min: 0, max: 1.5, step: 0.01 },
            centerX: { value: -0.4, min: -1, max: 1, step: 0.01 },
            centerY: { value: 0.93, min: 0, max: 2, step: 0.01 },
            centerZ: { value: -0.3, min: -1, max: 1, step: 0.01 },
            angularSpeed: { value: 0.6, min: 0, max: 3, step: 0.01 },
            bobAmplitude: { value: 0.04, min: 0, max: 0.5, step: 0.01 },
            bobFrequency: { value: 5, min: 0, max: 5, step: 0.01 },
            headingOffset: {
                value: Math.PI,
                min: -Math.PI,
                max: Math.PI,
                step: 0.01,
            },
            wobbleAmount: { value: 0.12, min: 0, max: 0.5, step: 0.01 },
            wobbleSpeed: { value: 0.5, min: 0, max: 3, step: 0.01 },
            driftAmount: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
            driftSpeed: { value: 0.3, min: 0, max: 3, step: 0.01 },
        },
        { store }
    )

    const sharedOrbit = {
        centerX,
        centerY,
        centerZ,
        radius: orbitRadius,
        angularSpeed,
        bobAmplitude,
        bobFrequency,
        headingOffset,
        wobbleAmount,
        wobbleSpeed,
        driftAmount,
        driftSpeed,
    }

    const butterflyOrbitA = { ...sharedOrbit, phaseOffset: 0, seed: 0 }

    const butterflyOrbitB = {
        ...sharedOrbit,
        phaseOffset: 4,
        seed: 13.7,
        radius: orbitRadius * 0.7,
        centerY: centerY + 0.3,
        centerX: centerX + 0.15,
    }

    const wingMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color,
                metalness,
                roughness,
                ...stencil,
            }),
        [color, metalness, roughness, stencil]
    )

    useEffect(() => {
        return () => wingMaterial.dispose()
    }, [wingMaterial])

    return (
        <>
            <ButterflyModel orbit={butterflyOrbitA} material={wingMaterial} />
            <ButterflyModel orbit={butterflyOrbitB} material={wingMaterial} />
        </>
    )
}
