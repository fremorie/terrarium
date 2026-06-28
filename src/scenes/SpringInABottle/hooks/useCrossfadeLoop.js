import { useCallback, useEffect, useRef } from 'react'

import { createCrossfadeLoop } from '../utils/crossfadeLoop'

export function useCrossfadeLoop({ url, volume, crossfadeDuration }) {
    const loopRef = useRef(null)

    useEffect(() => {
        const loop = createCrossfadeLoop({ url, volume, crossfadeDuration })
        loopRef.current = loop

        return () => {
            loop.dispose()
            loopRef.current = null
        }
    }, [url, volume, crossfadeDuration])

    return useCallback(() => loopRef.current?.start(), [])
}
