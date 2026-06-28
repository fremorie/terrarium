import { useLayoutEffect } from 'react'

// Defers the signal until after the browser has painted the first frame
export function SceneReady({ onReady }) {
    useLayoutEffect(() => {
        const frame = requestAnimationFrame(onReady)
        return () => cancelAnimationFrame(frame)
    }, [onReady])

    return null
}
