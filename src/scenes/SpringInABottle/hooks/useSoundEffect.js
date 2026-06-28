import { useCallback, useEffect, useRef } from 'react'

export function useSoundEffect({ url, volume = 1 }) {
    const audioRef = useRef(null)

    useEffect(() => {
        const audio = new Audio(url)
        audio.volume = volume
        // Decode the file up front so the first play() doesn't hitch on click.
        audio.preload = 'auto'
        audio.load()
        audioRef.current = audio

        return () => {
            audio.pause()
            audio.src = ''
            audioRef.current = null
        }
    }, [url, volume])

    return useCallback(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.currentTime = 0
        audio.play().catch(() => {})
    }, [])
}
