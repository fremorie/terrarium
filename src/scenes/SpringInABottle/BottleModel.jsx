import { useGLTF } from '@react-three/drei'
import { folder, useControls } from 'leva'
import { useRef } from 'react'

import { RENDER_ORDER } from './utils/renderOrder'
import { MeshTransmissionMaterial } from './utils/MeshTransmissionMaterial'
import { useBottleAnimation } from './hooks/useBottleAnimation'

export function BottleModel({ position, store }) {
    const bottleRef = useRef(null)

    useBottleAnimation(bottleRef)

    const { nodes } = useGLTF('./models/BottleWithAHole.glb')

    const controls = useControls(
        {
            'Bottle material': folder({
                transmission: { value: 0.88, min: 0, max: 1 },
                roughness: { value: 0.18, min: 0, max: 1 },
                reflectivity: { value: 0, min: 0, max: 1 },
                // Keep a tiny non-zero resting value so the USE_IRIDESCENCE
                // shader variant compiles at load
                iridescence: { value: 0.001, min: 0.001, max: 1 },
                thickness: { value: 0, min: 0, max: 1 },
                color: '#ffffff',
            }),
        },
        { store }
    )

    return (
        <group position={position}>
            <mesh
                geometry={nodes.BottleWithAHole.geometry}
                position={[-0.023, 0.1, 0.011]}
                renderOrder={RENDER_ORDER.bottle}
                ref={bottleRef}
            >
                <MeshTransmissionMaterial
                    transparent
                    depthWrite={true}
                    transmission={controls.transmission}
                    roughness={controls.roughness}
                    reflectivity={controls.reflectivity}
                    iridescence={controls.iridescence}
                    thickness={controls.thickness}
                    stencilBuffer={true}
                    samples={1}
                    color={controls.color}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload('./models/BottleWithAHole.glb')
