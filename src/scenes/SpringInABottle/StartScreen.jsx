import { useState } from 'react'

import './StartScreen.css'

export function StartScreen({ isReady, onStart }) {
    const [isDismissed, setIsDismissed] = useState(false)

    if (!isReady || isDismissed) return null

    const enterExperience = (shouldPlayAudio) => {
        onStart(shouldPlayAudio)
        setIsDismissed(true)
    }

    return (
        <div className="start-screen">
            <div className="start-screen__panel">
                <h1 className="start-screen__title">Terrarium</h1>
                <p className="start-screen__subtitle">
                    Best enjoyed with sound.
                </p>

                <div className="start-screen__buttons">
                    <button
                        className="start-screen__button start-screen__button--primary"
                        onClick={() => enterExperience(true)}
                    >
                        Enter with sound
                    </button>
                    <button
                        className="start-screen__button"
                        onClick={() => enterExperience(false)}
                    >
                        Enter in silence
                    </button>
                </div>
            </div>
        </div>
    )
}
