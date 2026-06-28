import { LevaPanel, useCreateStore } from 'leva'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense, useCallback, useEffect, useState } from 'react'

import { Experience } from './Experience'
import { Lights } from './Lights'
import { FadeIn } from './FadeIn'
import { StartScreen } from './StartScreen'
import { CAMERA_POSITION } from './utils/camera'
import { useDebug } from './hooks/useDebug'
import { useCrossfadeLoop } from './hooks/useCrossfadeLoop'
import useSceneState from './store/useSceneState'
import { Credits } from './Credits'
import { SceneReady } from './utils/SceneReady'
import './SpringInABottle.css'

const MUSIC_URL = './sounds/ambientMusic/ambientMusic.mp3'

export function SpringInABottle() {
    const debug = useDebug()
    const store = useCreateStore()
    const startMusic = useCrossfadeLoop({
        url: MUSIC_URL,
        volume: 0.3,
        crossfadeDuration: 4,
    })
    const startExperience = useSceneState((state) => state.start)
    const isEntranceAnimating = useSceneState(
        (state) => state.isEntranceAnimating
    )
    const hasStarted = useSceneState((state) => state.hasStarted)
    const isCorkHovered = useSceneState((state) => state.isCorkHovered)

    const [isSceneReady, setIsSceneReady] = useState(false)
    const handleSceneReady = useCallback(() => setIsSceneReady(true), [])

    const isInteractive = hasStarted && !isEntranceAnimating

    useEffect(() => {
        if (!isInteractive) return
        document.body.style.cursor = 'grab'
        return () => {
            document.body.style.cursor = 'auto'
        }
    }, [isInteractive])

    return (
        <>
            <LevaPanel
                store={store}
                hidden={!debug}
                theme={{ sizes: { rootWidth: '350px' } }}
                collapsed
            />

            <Canvas
                className={
                    isInteractive && !isCorkHovered
                        ? 'spring-in-a-bottle--interactive'
                        : undefined
                }
                flat
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 33,
                    position: CAMERA_POSITION.initial,
                }}
                gl={{ stencil: true }}
                shadows
            >
                <OrbitControls
                    makeDefault
                    enableRotate={!isEntranceAnimating}
                    enablePan={!isEntranceAnimating}
                    enableZoom={!isEntranceAnimating}
                    maxDistance={30}
                    minDistance={2}
                    target={[0, 1.2, 0]}
                />

                {debug && <Perf position="bottom-left" />}

                {debug && <axesHelper args={[2]} />}

                <Lights debug={debug} store={store} />

                <Suspense fallback={null}>
                    <Experience store={store} />
                    <Preload all />
                    <SceneReady onReady={handleSceneReady} />
                </Suspense>
            </Canvas>

            <FadeIn isReady={isSceneReady} />

            <StartScreen
                isReady={isSceneReady}
                onStart={(shouldPlayAudio) => {
                    startExperience(shouldPlayAudio)
                    if (shouldPlayAudio) startMusic()
                }}
            />

            <Credits />
        </>
    )
}
