import { CorkModel } from './CorkModel'
import { useCursor } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'

import { useCorkAnimation, PLUGGED_POSITION } from './hooks/useCorkAnimation'
import useSceneState from './store/useSceneState'

const DEFAULT_COLOR = '#ffffff'
const HOVERED_COLOR = '#e8b98f'
const PRESSED_COLOR = '#c8895f'

export function Cork() {
    const corkGroupRef = useRef(null)
    const isInteractive = useSceneState(
        (state) => state.hasStarted && !state.isEntranceAnimating
    )
    const setCorkHovered = useSceneState((state) => state.setCorkHovered)

    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)
    useCursor(hovered, 'pointer', isInteractive ? 'grab' : 'auto')

    const handleHover = (isHovered) => {
        setHovered(isHovered)
        setCorkHovered(isHovered)
        if (!isHovered) {
            setPressed(false)
        }
    }

    const { handleCorkClick } = useCorkAnimation(corkGroupRef)

    const color = useMemo(() => {
        if (pressed) {
            return PRESSED_COLOR
        }

        if (hovered) {
            return HOVERED_COLOR
        }

        return DEFAULT_COLOR
    }, [pressed, hovered])

    return (
        <group
            ref={corkGroupRef}
            position={[
                PLUGGED_POSITION.x,
                PLUGGED_POSITION.y,
                PLUGGED_POSITION.z,
            ]}
        >
            <CorkModel
                onPointerOver={() => handleHover(true)}
                onPointerOut={() => handleHover(false)}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
                color={color}
                onClick={handleCorkClick}
            />
        </group>
    )
}
