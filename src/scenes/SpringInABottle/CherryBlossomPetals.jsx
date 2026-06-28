import { useEffect, useMemo, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useControls, folder } from 'leva'

import vertexShader from './shaders/cherryBlossomPetals/vertex.glsl'
import fragmentShader from './shaders/cherryBlossomPetals/fragment.glsl'
import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'
import { generateCherryBlossomPetalPositions } from './utils/generateCherryBlossomPetalPositions'
import { RENDER_ORDER } from './utils/renderOrder'

const PetalMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: null,
        uDarkColor: new THREE.Color('#c89580'),
        uLightColor: new THREE.Color('#e5d9d1'),
    },
    vertexShader,
    fragmentShader
)

extend({ PetalMaterial })

export function CherryBlossomPetals({ store }) {
    const stencil = useStencil(SEASONS.spring)
    const petalTexture = useTexture('./textures/petal/petal.png')

    // eslint-disable-next-line
    petalTexture.minFilter = THREE.LinearFilter
    // eslint-disable-next-line
    petalTexture.generateMipmaps = false

    const petalMaterialRef = useRef(null)

    useFrame((state, delta) => {
        if (petalMaterialRef.current) {
            petalMaterialRef.current.uTime += delta * 0.1
        }
    })

    const petalsCount = 100
    const { positions, seeds, sizes } = useMemo(
        () => generateCherryBlossomPetalPositions(petalsCount),
        []
    )

    const { darkColor, lightColor } = useControls(
        {
            'Cherry blossom petals': folder({
                darkColor: '#c89580',
                lightColor: '#e5d9d1',
            }),
        },
        { store }
    )

    useEffect(() => {
        petalMaterialRef.current.uDarkColor = new THREE.Color(darkColor)
        petalMaterialRef.current.uLightColor = new THREE.Color(lightColor)
    }, [lightColor, darkColor])

    return (
        <points renderOrder={RENDER_ORDER.petals}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={petalsCount}
                    itemSize={3} // x, y, z
                    array={positions}
                />
                <bufferAttribute
                    attach="attributes-aSeed"
                    count={petalsCount}
                    itemSize={1}
                    array={seeds}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    count={petalsCount}
                    itemSize={1}
                    array={sizes}
                />
            </bufferGeometry>
            <petalMaterial
                ref={petalMaterialRef}
                key={PetalMaterial.key}
                uTexture={petalTexture}
                transparent
                depthWrite={false}
                {...stencil}
            />
        </points>
    )
}

useTexture.preload('./textures/petal/petal.png')
