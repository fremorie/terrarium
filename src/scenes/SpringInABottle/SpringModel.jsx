import { useGLTF, useTexture, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'

import vertexShader from './shaders/river/vertex.glsl'
import fragmentShader from './shaders/river/fragment.glsl'
import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'

const RiverMaterial = shaderMaterial(
    {
        uTime: 0,
        uEdgeColor: new THREE.Color('#dbd497'),
        uDepthColor: new THREE.Color('#23938a'),
        uDepthMap: null,
        uShadowsTexture: null,
        uPerlinNoise: null,
        uBoatField: null,
        uFresnelColor: new THREE.Color('#ffffff'),
        uFresnelPower: 3.0,
        uFresnelStrength: 0.6,
        uShadowWobbleStrength: 0.03,
        uShadowWobbleFrequency: 8.0,
        uShadowDarkness: 0.4,
    },
    vertexShader,
    fragmentShader,
    (material) => {
        // Real-time light shadows
        material.lights = true
        material.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.lights,
            material.uniforms,
        ])
    }
)

extend({ RiverMaterial })

export function SpringModel({ store }) {
    const stencil = useStencil(SEASONS.spring)

    const { nodes } = useGLTF('./models/Spring/Spring3.glb')
    const { nodes: shadowMeshNodes } = useGLTF(
        './models/Spring/ShadowMeshWithoutRiver.glb'
    )
    const bakedTexture = useTexture('./models/Spring/bakedFixed.jpg')
    const depthMap = useTexture(
        './models/Spring/SpringTerrainDepthMapBlurred2.jpg'
    )
    const riverShadowsTexture = useTexture('./models/Boat/baked_cleaned.png')
    const boatDepthMap = useTexture('./models/Boat/depthMap.png')
    const perlinNoise = useTexture('./textures/perlinNoise/perlin.png')

    // eslint-disable-next-line
    bakedTexture.flipY = false
    // eslint-disable-next-line
    riverShadowsTexture.flipY = false
    // eslint-disable-next-line
    depthMap.flipY = false
    // eslint-disable-next-line
    boatDepthMap.flipY = false

    const riverMaterialRef = useRef(null)

    useFrame((state, delta) => {
        if (riverMaterialRef.current) {
            riverMaterialRef.current.uTime += delta
        }
    })

    const { fresnelColor, fresnelPower, fresnelStrength } = useControls(
        'River',
        {
            fresnelColor: '#ffffff',
            fresnelPower: { value: 4.2, min: 0.5, max: 10, step: 0.1 },
            fresnelStrength: { value: 0.88, min: 0, max: 1, step: 0.01 },
        },
        { store }
    )

    const {
        shadowWobbleStrength,
        shadowWobbleFrequency,
        shadowOpacity,
        shadowDarkness,
    } = useControls(
        'Shadows',
        {
            shadowOpacity: { value: 0.35, min: 0, max: 1, step: 0.01 },
            shadowDarkness: { value: 0.4, min: 0, max: 1, step: 0.01 },
            shadowWobbleStrength: {
                value: 0.03,
                min: 0,
                max: 0.15,
                step: 0.001,
            },
            shadowWobbleFrequency: { value: 6.5, min: 1, max: 30, step: 0.5 },
        },
        { store }
    )

    useEffect(() => {
        riverMaterialRef.current.uFresnelColor = new THREE.Color(fresnelColor)
        riverMaterialRef.current.uFresnelPower = fresnelPower
        riverMaterialRef.current.uFresnelStrength = fresnelStrength
    }, [fresnelColor, fresnelPower, fresnelStrength])

    return (
        <group dispose={null}>
            <mesh
                geometry={nodes.merged.geometry}
                position={[-0.871, 0.616, 0.325]}
            >
                <meshBasicMaterial map={bakedTexture} {...stencil} />
            </mesh>
            {/* Shares the terrain geometry and only darkens where shadows land */}
            <mesh
                geometry={shadowMeshNodes.shadowMeshNoRiver.geometry}
                // Real position + a very tiny number to raise it above the visible scene
                position={[0.005, 0.33 + 0.0001, -0.003]}
                receiveShadow
            >
                <shadowMaterial
                    transparent
                    opacity={shadowOpacity}
                    {...stencil}
                />
            </mesh>
            <mesh
                geometry={nodes.river.geometry}
                position={[-0.251, 0.508, 0.127]}
                receiveShadow
            >
                <riverMaterial
                    key={RiverMaterial.key}
                    ref={riverMaterialRef}
                    uDepthMap={depthMap}
                    uPerlinNoise={perlinNoise}
                    uShadowsTexture={riverShadowsTexture}
                    uBoatField={boatDepthMap}
                    uShadowWobbleStrength={shadowWobbleStrength}
                    uShadowWobbleFrequency={shadowWobbleFrequency}
                    uShadowDarkness={shadowDarkness}
                    {...stencil}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload('./models/Spring/Spring3.glb')
useTexture.preload('./models/Spring/bakedFixed.jpg')
useTexture.preload('./models/Spring/SpringTerrainDepthMapBlurred2.jpg')
useTexture.preload('./textures/perlinNoise/perlin.png')
useTexture.preload('./models/Boat/baked_cleaned.png')
useTexture.preload('./models/Boat/depthMap.png')
useGLTF.preload('./models/Spring/ShadowMeshWithoutRiver.glb')
