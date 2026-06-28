import { useState } from 'react'
import './Explanation.css'

export function Explanation({ title, children }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="explanation">
            <div className="explanation__header">
                <h1 className="explanation__title">{title}</h1>
                <button
                    className="explanation__toggle"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? 'Hide' : 'Show'}
                >
                    {open ? '−' : '+'}
                </button>
            </div>
            <div
                className={`explanation__body${open ? '' : ' explanation__body--closed'}`}
            >
                <div className="explanation__details">{children}</div>
            </div>
        </div>
    )
}
