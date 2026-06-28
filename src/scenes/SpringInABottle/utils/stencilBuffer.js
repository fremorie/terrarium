import { useMask } from '@react-three/drei'
import { useMemo } from 'react'

import useSceneState from '../store/useSceneState'

export const MASK_ID = 1

export function useStencil(season) {
    const activeSeason = useSceneState((state) => state.activeSeason)

    const inverse = season === activeSeason
    const stencil = useMask(MASK_ID, inverse)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => stencil, [inverse])
}
