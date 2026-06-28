import { useHelper } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useControls, folder } from 'leva'
import * as THREE from 'three'

export function Lights({ debug, store }) {
    const directionalLightRef = useRef(null)
    const [shadowCamera, setShadowCamera] = useState(null)

    const lightPosition = useControls(
        'Directional Light',
        {
            lightPosition: folder({
                X: { value: 1.57, max: 10, min: -10, step: 0.01 },
                Y: { value: 1.8, max: 10, min: -10, step: 0.01 },
                Z: { value: 1.62, max: 10, min: -10, step: 0.01 },
            }),
        },
        { store }
    )

    useHelper(
        debug ? directionalLightRef : null,
        THREE.DirectionalLightHelper,
        1
    )

    useHelper(
        debug && shadowCamera ? { current: shadowCamera } : null,
        THREE.CameraHelper
    )

    useEffect(() => {
        if (directionalLightRef.current) {
            setShadowCamera(directionalLightRef.current.shadow.camera)
        }
    }, [])

    return (
        <directionalLight
            ref={directionalLightRef}
            position={[lightPosition.X, lightPosition.Y, lightPosition.Z]}
            intensity={0.01}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
            shadow-camera-near={0.1}
            shadow-camera-far={4}
            shadow-camera-top={1.5}
            shadow-camera-bottom={-0.5}
            shadow-camera-left={-1.2}
            shadow-camera-right={1.2}
        />
    )
}
