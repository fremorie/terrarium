import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

import vertexShader from './shaders/magicGlass/vertex.glsl'
import fragmentShader from './shaders/magicGlass/fragment.glsl'
import { useMagicGlassAnimation } from './hooks/useMagicGlassAnimation'

const MagicGlassMaterial = shaderMaterial(
    {
        uTime: 0,
        uPerlinNoise: null,
        uColorStart: new THREE.Color('#c8d7eb'),
        uColorEnd: new THREE.Color('#8fa1c4'),
        uActiveSeason: 0,
        uAlpha: 0,
    },
    vertexShader,
    fragmentShader
)

extend({ MagicGlassMaterial })

export function MagicGlass({ store }) {
    const { nodes } = useGLTF('./models/MagicGlass.glb')

    const magicGlassMaterialRef = useRef(null)

    useMagicGlassAnimation(magicGlassMaterialRef)

    const { uColorStart, uColorEnd, positionX, positionY, positionZ } =
        useControls(
            'Magic glass',
            {
                uColorStart: '#c8d7eb',
                uColorEnd: '#8fa1c4',
                positionX: { value: -1.054, min: -1.5, max: 1.2, step: 0.001 },
                positionY: { value: 1.093, min: -5, max: 5, step: 0.001 },
                positionZ: { value: 0.012, min: -0.5, max: 0.5, step: 0.001 },
            },
            { store }
        )
    useEffect(() => {
        magicGlassMaterialRef.current.uColorStart.set(uColorStart)
        magicGlassMaterialRef.current.uColorEnd.set(uColorEnd)
    }, [uColorStart, uColorEnd])

    useFrame((state, delta) => {
        if (magicGlassMaterialRef.current) {
            magicGlassMaterialRef.current.uTime += delta
        }
    })

    return (
        <group dispose={null}>
            <mesh
                geometry={nodes.MagicGlas001.geometry}
                position={[positionX, positionY, positionZ]}
            >
                <magicGlassMaterial
                    key={MagicGlassMaterial.key}
                    ref={magicGlassMaterialRef}
                    transparent
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload('./models/MagicGlass.glb')
