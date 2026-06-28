import { useEffect } from 'react'
import gsap from 'gsap'
import {
    TRANSITION_HALF_DURATION,
    BASE_SCENE_ROTATION_Y,
} from '../utils/transition'
import useSceneState from '../store/useSceneState'

const FULL_TURN = 2 * Math.PI

// Snap an arbitrary angle down to the next resting grid value
// (-2.8 - 2 * PI * n) strictly below it. Using an absolute target instead of a
// relative `-=` keeps the rotation on the grid even when the previous tween is
// killed mid-flight by a fast cork click. Otherwise, the leftover partial turn
// would accumulate and the baked-shadow illusion would drift off.
function nextRestingRotationY(currentY) {
    const turnsBelowBase = Math.round(
        (BASE_SCENE_ROTATION_Y - currentY) / FULL_TURN
    )
    return BASE_SCENE_ROTATION_Y - FULL_TURN * (turnsBelowBase + 1)
}

export function useSceneAnimation(sceneRef) {
    const phase = useSceneState((state) => state.phase)

    useEffect(() => {
        if (
            phase === 'openTransitionStart' ||
            phase === 'closeTransitionStart'
        ) {
            gsap.killTweensOf(sceneRef.current.rotation)

            const timeline = gsap.timeline()

            timeline.to(sceneRef.current.rotation, {
                y: nextRestingRotationY(sceneRef.current.rotation.y),
                duration: TRANSITION_HALF_DURATION * 3,
                ease: 'power1.out',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase])
}
