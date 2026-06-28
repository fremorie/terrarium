import { useEffect } from 'react'
import gsap from 'gsap'

import useSceneState, { SEASONS } from '../store/useSceneState'
import { TRANSITION_HALF_DURATION } from '../utils/transition'

export function useMagicGlassAnimation(magicGlassMaterialRef) {
    const phase = useSceneState((state) => state.phase)
    const activeSeason = useSceneState((state) => state.activeSeason)

    useEffect(() => {
        magicGlassMaterialRef.current.uActiveSeason =
            activeSeason === SEASONS.spring ? 0 : 1

        if (activeSeason === SEASONS.winter) {
            magicGlassMaterialRef.current.uColorStart.set('#ffffff')
            magicGlassMaterialRef.current.uColorEnd.set('#fce07e')
        } else {
            magicGlassMaterialRef.current.uColorStart.set('#c8d7eb')
            magicGlassMaterialRef.current.uColorEnd.set('#8fa1c4')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSeason])

    useEffect(() => {
        if (
            phase === 'openTransitionStart' ||
            phase === 'closeTransitionStart'
        ) {
            const timeline = gsap.timeline()

            timeline.to(magicGlassMaterialRef.current, {
                uAlpha: 1,
                duration: TRANSITION_HALF_DURATION,
            })

            timeline.to(magicGlassMaterialRef.current, {
                uAlpha: 0,
                duration: TRANSITION_HALF_DURATION,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase])
}
