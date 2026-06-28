import { useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

import useSceneState from '../store/useSceneState'
import { TRANSITION_HALF_DURATION } from '../utils/transition'

// gsap can't tween a THREE.Color directly, so we tween its rgb channels
const TRANSITION_COLOR = new THREE.Color('#baa0a0')
const RESTING_COLOR = new THREE.Color('#ffffff')

// Resting iridescence must stay just above 0
// (to avoid recompiling transmission material's shaders)
const RESTING_IRIDESCENCE = 0.001

export function useBottleAnimation(bottleRef) {
    const phase = useSceneState((state) => state.phase)
    const endOpenTransitionAction = useSceneState(
        (state) => state.endOpenTransition
    )
    const endCloseTransitionAction = useSceneState(
        (state) => state.endCloseTransition
    )

    useEffect(() => {
        if (!bottleRef.current) return

        if (
            phase === 'openTransitionStart' ||
            phase === 'closeTransitionStart'
        ) {
            const onComplete =
                phase === 'openTransitionStart'
                    ? endOpenTransitionAction
                    : endCloseTransitionAction

            const material = bottleRef.current.material

            gsap.killTweensOf(material)
            gsap.killTweensOf(material.color)

            const timeline = gsap.timeline()

            timeline.to(material, {
                _transmission: 0,
                iridescence: 1.0,
                duration: TRANSITION_HALF_DURATION,
                onComplete,
            })

            timeline.to(material, {
                _transmission: 0.88,
                iridescence: RESTING_IRIDESCENCE,
                duration: TRANSITION_HALF_DURATION,
            })

            timeline.to(
                material.color,
                {
                    r: TRANSITION_COLOR.r,
                    g: TRANSITION_COLOR.g,
                    b: TRANSITION_COLOR.b,
                    duration: TRANSITION_HALF_DURATION,
                },
                // Run in parallel
                0
            )

            timeline.to(
                material.color,
                {
                    r: RESTING_COLOR.r,
                    g: RESTING_COLOR.g,
                    b: RESTING_COLOR.b,
                    duration: TRANSITION_HALF_DURATION,
                },
                TRANSITION_HALF_DURATION
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase])
}
