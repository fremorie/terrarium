import { shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'

import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'
import vertexShader from './shaders/snow/vertex.glsl'
import fragmentShader from './shaders/snow/fragment.glsl'
import riverVertexShader from './shaders/winterRiver/vertex.glsl'
import riverFragmentShader from './shaders/winterRiver/fragment.glsl'

const SnowMaterial = shaderMaterial(
    {
        uTime: 0,
        uBakedTexture: null,
        uPerlinNoise: null,
    },
    vertexShader,
    fragmentShader
)

extend({ SnowMaterial })

const WinterRiverMaterial = shaderMaterial(
    {
        uTime: 0,
        uEdgeColor: new THREE.Color('#66e8ff'),
        uDepthColor: new THREE.Color('#236194'),
        uDepthMap: null,
        uPerlinNoise: null,
        uFresnelColor: new THREE.Color('#ffffff'),
        uFresnelPower: 4.2,
        uFresnelStrength: 0.88,
        uCrackColor: new THREE.Color('#dff6ff'),
        uCrackScale: 14.0,
        uCrackWidth: 0.04,
        uCrackStrength: 0.6,
        uBubbleColor: new THREE.Color('#eaffff'),
        uBubbleScale: 40.0,
        uBubbleSize: 0.08,
        uBubbleStrength: 0.7,
        uFrostColor: new THREE.Color('#ffffff'),
        uFrostStrength: 0.5,
        uWaterColor: new THREE.Color('#15466e'),
        uFlowSpeed: 0.05,
        uFlowStrength: 0.6,
        uFreezeLevel: 0.2,
    },
    riverVertexShader,
    riverFragmentShader
)

extend({ WinterRiverMaterial })

export function WinterModel({ store }) {
    const stencil = useStencil(SEASONS.winter)

    const winterRiverMaterialRef = useRef(null)

    const { nodes } = useGLTF('./models/Winter/WinterMergedFixed.glb')
    const bakedTexture = useTexture('./models/Winter/BakedWinterFixed.jpg')
    const depthMap = useTexture(
        './models/Spring/SpringTerrainDepthMapFixed2.jpg'
    )
    // eslint-disable-next-line
    bakedTexture.flipY = false
    // eslint-disable-next-line
    depthMap.flipY = false

    const perlinNoise = useTexture('./textures/perlinNoise/perlin.png')
    // eslint-disable-next-line
    perlinNoise.wrapS = perlinNoise.wrapT = THREE.RepeatWrapping

    const {
        edgeColor,
        depthColor,
        crackColor,
        crackScale,
        crackWidth,
        crackStrength,
        bubbleColor,
        bubbleScale,
        bubbleSize,
        bubbleStrength,
        frostColor,
        frostStrength,
        waterColor,
        flowSpeed,
        flowStrength,
        freezeLevel,
    } = useControls(
        'Winter River',
        {
            edgeColor: '#66e8ff',
            depthColor: '#236194',
            crackColor: '#dff6ff',
            crackScale: { value: 20.0, min: 1, max: 60, step: 1 },
            crackWidth: { value: 0.04, min: 0.0, max: 0.2, step: 0.001 },
            crackStrength: { value: 0.26, min: 0.0, max: 1.0, step: 0.01 },
            bubbleColor: '#eaffff',
            bubbleScale: { value: 40.0, min: 1, max: 120, step: 1 },
            bubbleSize: { value: 0.08, min: 0.0, max: 0.4, step: 0.001 },
            bubbleStrength: { value: 0.7, min: 0.0, max: 1.0, step: 0.01 },
            frostColor: '#ffffff',
            frostStrength: { value: 0.2, min: 0.0, max: 1.0, step: 0.01 },
            waterColor: '#15466e',
            flowSpeed: { value: 0.07, min: 0.0, max: 0.5, step: 0.001 },
            flowStrength: { value: 0.35, min: 0.0, max: 1.0, step: 0.01 },
            freezeLevel: { value: 0.17, min: 0.0, max: 0.5, step: 0.001 },
        },
        { store }
    )

    useEffect(() => {
        const material = winterRiverMaterialRef.current
        material.uEdgeColor = new THREE.Color(edgeColor)
        material.uDepthColor = new THREE.Color(depthColor)
        material.uCrackColor = new THREE.Color(crackColor)
        material.uCrackScale = crackScale
        material.uCrackWidth = crackWidth
        material.uCrackStrength = crackStrength
        material.uBubbleColor = new THREE.Color(bubbleColor)
        material.uBubbleScale = bubbleScale
        material.uBubbleSize = bubbleSize
        material.uBubbleStrength = bubbleStrength
        material.uFrostColor = new THREE.Color(frostColor)
        material.uFrostStrength = frostStrength
        material.uWaterColor = new THREE.Color(waterColor)
        material.uFlowSpeed = flowSpeed
        material.uFlowStrength = flowStrength
        material.uFreezeLevel = freezeLevel
    }, [
        edgeColor,
        depthColor,
        crackColor,
        crackScale,
        crackWidth,
        crackStrength,
        bubbleColor,
        bubbleScale,
        bubbleSize,
        bubbleStrength,
        frostColor,
        frostStrength,
        waterColor,
        flowSpeed,
        flowStrength,
        freezeLevel,
    ])

    useFrame((state) => {
        winterRiverMaterialRef.current.uTime = state.clock.elapsedTime
    })

    return (
        <group dispose={null}>
            <mesh
                geometry={nodes.river001.geometry}
                position={[-0.251, 0.508, 0.127]}
            >
                <winterRiverMaterial
                    ref={winterRiverMaterialRef}
                    key={WinterRiverMaterial.key}
                    uDepthMap={depthMap}
                    uPerlinNoise={perlinNoise}
                    {...stencil}
                />
            </mesh>
            <mesh
                geometry={nodes.snow.geometry}
                position={[0.005, 0.284, -0.003]}
            >
                <snowMaterial
                    key={SnowMaterial.key}
                    uBakedTexture={bakedTexture}
                    uPerlinNoise={perlinNoise}
                    {...stencil}
                />
            </mesh>
            <mesh
                geometry={nodes.merged2.geometry}
                position={[-0.445, 0.541, -0.932]}
            >
                <meshBasicMaterial map={bakedTexture} {...stencil} />
            </mesh>
        </group>
    )
}

useGLTF.preload('./models/Winter/WinterMergedFixed.glb')
useTexture.preload('./models/Winter/BakedWinterFixed.jpg')
useTexture.preload('./textures/perlinNoise/perlin.png')
useTexture.preload('./models/Spring/SpringTerrainDepthMapFixed2.jpg')
