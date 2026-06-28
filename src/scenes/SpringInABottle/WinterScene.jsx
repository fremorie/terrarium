import { WinterModel } from './WinterModel'
import { Snowflakes } from './Snowflakes'

export function WinterScene({ store }) {
    return (
        <>
            <WinterModel store={store} />
            <Snowflakes />
        </>
    )
}
