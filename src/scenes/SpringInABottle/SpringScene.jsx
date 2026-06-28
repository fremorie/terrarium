import { SpringModel } from './SpringModel'
import { Butterflies } from './Butterflies'
import { CherryBlossomPetals } from './CherryBlossomPetals'
import { Grass } from './Grass'
import { Boat } from './Boat'

export function SpringScene({ store }) {
    return (
        <>
            <SpringModel store={store} />
            <Butterflies store={store} />
            <CherryBlossomPetals store={store} />
            <Grass />
            <Boat store={store} />
            {/*<DriftingPetal store={store} />*/}
        </>
    )
}
