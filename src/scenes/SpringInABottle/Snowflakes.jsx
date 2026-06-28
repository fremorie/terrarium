import { useMemo, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial, useTexture } from '@react-three/drei'

import vertexShader from './shaders/snowflakes/vertex.glsl'
import fragmentShader from './shaders/snowflakes/fragment.glsl'
import { generateSnowflakePositions } from './utils/generateSnowflakePositions'
import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'
import { RENDER_ORDER } from './utils/renderOrder'

const SnowflakeMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: null,
    },
    vertexShader,
    fragmentShader
)

extend({ SnowflakeMaterial })

export function Snowflakes() {
    const stencil = useStencil(SEASONS.winter)
    const snowflakeTexture = useTexture('./textures/snowflake/snowflake.png')

    const snowflakeMaterialRef = useRef(null)

    useFrame((state, delta) => {
        if (snowflakeMaterialRef.current) {
            snowflakeMaterialRef.current.uTime += delta * 0.1
        }
    })

    const snowflakeCount = 500
    const snowflakePositions = useMemo(
        () => generateSnowflakePositions(snowflakeCount),
        []
    )

    return (
        <points renderOrder={RENDER_ORDER.snowflakes}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={snowflakeCount}
                    itemSize={3} // x, y, z
                    array={snowflakePositions}
                />
            </bufferGeometry>
            <snowflakeMaterial
                ref={snowflakeMaterialRef}
                key={SnowflakeMaterial.key}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uTexture={snowflakeTexture}
                {...stencil}
            />
        </points>
    )
}

useTexture.preload('./textures/snowflake/snowflake.png')
