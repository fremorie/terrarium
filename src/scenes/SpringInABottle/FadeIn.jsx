import { useProgress } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function FadeIn({ isReady }) {
    const overlayElement = useRef(null)
    const { progress } = useProgress()

    useEffect(() => {
        if (!isReady) return

        gsap.to(overlayElement.current, {
            opacity: 0,
            duration: 1,
            ease: 'sine.out',
            onComplete: () => {
                overlayElement.current.style.display = 'none'
            },
        })
    }, [isReady])

    return (
        <div
            ref={overlayElement}
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'black',
                opacity: 1,
                pointerEvents: 'none',
                zIndex: 1,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '200px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '2px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            borderRadius: '999px',
                            background: '#fff',
                        }}
                    />
                </div>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>
    )
}
