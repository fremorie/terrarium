import { useRef } from 'react'
import gsap from 'gsap'
import { useFrame } from '@react-three/fiber'

import useSceneState from '../store/useSceneState'
import { useSoundEffect } from './useSoundEffect'

const CORK_POP_SOUND_URL = './sounds/corkPop/corkPop.wav'
const CORK_SEAL_SOUND_URL = './sounds/gasPressure/gasPressureEscaping.wav'
const CORK_SEAL_SOUND_DELAY = 0.9

// Where the cork rests while it plugs the bottle
export const PLUGGED_POSITION = { x: 0, y: 0, z: 0 }

// Where the cork settles once the bottle is opened
const FLOATING_POSITION = { x: 0, y: 0.4, z: 0 }

export function useCorkAnimation(corkRef) {
    const anchorPosition = useRef({ ...PLUGGED_POSITION })
    const isPoppedRef = useRef(false)

    const openBottleAction = useSceneState((state) => state.openBottle)
    const closeBottleAction = useSceneState((state) => state.closeBottle)
    const isAudioEnabled = useSceneState((state) => state.isAudioEnabled)

    const playCorkPop = useSoundEffect({ url: CORK_POP_SOUND_URL, volume: 0.3 })
    const playCorkSeal = useSoundEffect({
        url: CORK_SEAL_SOUND_URL,
        volume: 0.3,
    })

    const popCork = () => {
        isPoppedRef.current = true

        gsap.killTweensOf(anchorPosition.current)

        openBottleAction()

        if (isAudioEnabled) playCorkPop()

        const timeline = gsap.timeline()

        // Pop up out of the neck first...
        timeline.to(anchorPosition.current, {
            y: 0.5,
            duration: 0.4,
            ease: 'power2.out',
        })

        // ...then drift over to the left and settle into place.
        timeline.to(anchorPosition.current, {
            x: FLOATING_POSITION.x,
            y: FLOATING_POSITION.y,
            z: FLOATING_POSITION.z,
            duration: 1.2,
            ease: 'power2.inOut',
        })
    }

    const closeBottle = () => {
        isPoppedRef.current = false

        gsap.killTweensOf(anchorPosition.current)

        const timeline = gsap.timeline()

        timeline.to(anchorPosition.current, {
            y: 0.5,
            x: PLUGGED_POSITION.x,
            z: PLUGGED_POSITION.z,
            duration: 0.4,
            ease: 'power2.out',
        })

        timeline.to(anchorPosition.current, {
            x: PLUGGED_POSITION.x,
            y: PLUGGED_POSITION.y,
            z: PLUGGED_POSITION.z,
            duration: 1.2,
            ease: 'power2.inOut',
            onComplete: closeBottleAction,
        })

        timeline.call(
            () => {
                if (isAudioEnabled) playCorkSeal()
            },
            null,
            CORK_SEAL_SOUND_DELAY
        )
    }

    const handleCorkClick = () => {
        if (isPoppedRef.current) {
            closeBottle()
        } else {
            popCork()
        }
    }

    useFrame((state) => {
        if (!corkRef.current) return

        const elapsedTime = state.clock.elapsedTime

        const floatOffset = isPoppedRef.current
            ? Math.sin(elapsedTime) * 0.08
            : 0

        corkRef.current.position.set(
            anchorPosition.current.x,
            anchorPosition.current.y + floatOffset,
            anchorPosition.current.z
        )
    })

    return {
        handleCorkClick,
    }
}
