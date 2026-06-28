import { useLocation } from 'react-router'

export function useDebug() {
    const { hash } = useLocation()

    return hash === '#debug'
}
