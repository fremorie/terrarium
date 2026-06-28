import { Environment, Float, useEnvironment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { folder, useControls } from 'leva'

import { Scene } from './Scene'
import { CircularMask } from './CircularMask'
import { MagicGlass } from './MagicGlass'
import { CAMERA_POSITION } from './utils/camera'
import { useDebug } from './hooks/useDebug'
import { Rope } from './Rope'
import { BottleLabel } from './BottleLabel'
import { Cork } from './Cork'
import { Bottle } from './Bottle'
import { useSceneAnimation } from './hooks/useSceneAnimation'
import { BASE_SCENE_ROTATION_Y } from './utils/transition'
import useSceneState from './store/useSceneState'

const ENVIRONMENT_FILES = [
    './environmentMaps/veniceSunset/venice_sunset_1k.hdr',
]

useEnvironment.preload({ files: ENVIRONMENT_FILES })

export function Experience({ store }) {
    const debug = useDebug()
    const camera = useThree((state) => state.camera)
    const sceneRef = useRef(null)
    const hasStarted = useSceneState((state) => state.hasStarted)
    const setEntranceAnimating = useSceneState(
        (state) => state.setEntranceAnimating
    )

    useSceneAnimation(sceneRef)

    const levaControls = useControls(
        {
            Camera: folder({
                x: { value: CAMERA_POSITION.initial[0], min: -20, max: 20 },
                y: { value: CAMERA_POSITION.initial[1], min: -20, max: 20 },
                z: { value: CAMERA_POSITION.initial[2], min: -20, max: 20 },
            }),
        },
        { store }
    )

    useEffect(() => {
        if (debug) {
            camera.position.set(levaControls.x, levaControls.y, levaControls.z)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levaControls.x, levaControls.y, levaControls.z])

    useEffect(() => {
        if (!hasStarted) return

        const timeline = gsap.timeline({
            onStart: () => setEntranceAnimating(true),
            onComplete: () => setEntranceAnimating(false),
        })

        timeline.to(camera.position, {
            x: CAMERA_POSITION.final[0],
            y: CAMERA_POSITION.final[1],
            z: CAMERA_POSITION.final[2],
            duration: 7,
            ease: 'power1.out',
        })

        return () => {
            timeline.kill()
            setEntranceAnimating(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasStarted])

    return (
        <>
            <Environment
                files={ENVIRONMENT_FILES}
                background={true}
                backgroundBlurriness={0.5}
                backgroundIntensity={0.5}
            />

            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <group
                    ref={sceneRef}
                    // Rotate the whole scene so that it looks like
                    // the sun from the environment map casts shadows.
                    rotation-y={BASE_SCENE_ROTATION_Y}
                >
                    <Scene store={store} />
                    <CircularMask />
                    <MagicGlass store={store} />

                    <group rotation-y={0.2}>
                        <Rope />
                        <BottleLabel />
                    </group>

                    <Bottle store={store} />
                    <Cork />
                </group>
            </Float>
        </>
    )
}
