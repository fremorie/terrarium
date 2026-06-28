import { shaderMaterial, useTexture } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { folder, useControls } from 'leva'
import * as THREE from 'three'
import gsap from 'gsap'

import vertexShader from './shaders/driftingPetal/vertex.glsl'
import fragmentShader from './shaders/driftingPetal/fragment.glsl'

import ripplesVertexShader from './shaders/petalRipples/vertex.glsl'
import ripplesFragmentShader from './shaders/petalRipples/fragment.glsl'

import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'
import { petalAnimationConfig } from './utils/driftingPetal'

const DriftingPetalMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: null,
        uDarkColor: new THREE.Color('#c89580'),
        uLightColor: new THREE.Color('#e5d9d1'),
    },
    vertexShader,
    fragmentShader
)

extend({ DriftingPetalMaterial })

const DriftingPetalRipplesMaterial = shaderMaterial(
    {
        uTime: 0,
        uPerlinNoise: null,
        uShapeTexture: null,
    },
    ripplesVertexShader,
    ripplesFragmentShader
)

extend({ DriftingPetalRipplesMaterial })

export function DriftingPetal({ store }) {
    const stencil = useStencil(SEASONS.spring)

    const petalTexture = useTexture('./textures/petal/petal.png')

    const driftingPetalMaterialRef = useRef(null)
    const driftingPetalRipplesMaterialRef = useRef(null)

    const petalMeshRef = useRef(null)
    const petalGroupRef = useRef(null)

    const { darkColor, lightColor } = useControls(
        {
            'Drifting petal': folder({
                darkColor: '#c89580',
                lightColor: '#e5d9d1',
                positionX: { value: 0, min: -1, max: 1, step: 0.01 },
                positionY: { value: 0.51, min: -1, max: 1, step: 0.01 },
                positionZ: { value: 0, min: -1, max: 1, step: 0.01 },
            }),
        },
        { store }
    )

    useEffect(() => {
        driftingPetalMaterialRef.current.uDarkColor.set(darkColor)
        driftingPetalMaterialRef.current.uLightColor.set(lightColor)
    }, [lightColor, darkColor])

    const petalPosition = {
        x: 0.2,
        y: 0.51,
        z: 1.3,
    }

    useEffect(() => {
        const timeline = gsap.timeline({ repeat: -1 })

        petalAnimationConfig.trajectoryA.forEach(({ x, z, duration }) => {
            timeline.to(petalGroupRef.current.position, {
                x,
                z,
                duration,
                ease: 'none',
            })
        })
    }, [])

    useFrame((state, delta) => {
        if (driftingPetalRipplesMaterialRef.current) {
            driftingPetalRipplesMaterialRef.current.uTime += delta
        }
    })

    return (
        <group
            ref={petalGroupRef}
            position={[petalPosition.x, petalPosition.y, petalPosition.z]}
            scale={0.5}
        >
            <mesh
                ref={petalMeshRef}
                rotation-x={-Math.PI / 2}
                scale={0.1}
                position-y={0.02}
            >
                <planeGeometry />
                <driftingPetalMaterial
                    key={DriftingPetalMaterial}
                    ref={driftingPetalMaterialRef}
                    uTexture={petalTexture}
                    alphaToCoverage
                    {...stencil}
                />
            </mesh>
            {/*<mesh rotation-x={-Math.PI / 2} scale={0.2} position-y={0.01}>*/}
            {/*    <planeGeometry />*/}
            {/*    <driftingPetalRipplesMaterial*/}
            {/*        key={DriftingPetalRipplesMaterial}*/}
            {/*        ref={driftingPetalRipplesMaterialRef}*/}
            {/*        uPerlinNoise={perlinNoise}*/}
            {/*        uShapeTexture={petalTexture}*/}
            {/*    />*/}
            {/*</mesh>*/}
        </group>
    )
}
