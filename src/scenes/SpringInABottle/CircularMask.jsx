import { Mask, useGLTF } from '@react-three/drei'

import { MASK_ID } from './utils/stencilBuffer'

export const CircularMask = (props) => {
    const { nodes } = useGLTF('./models/MagicGlass.glb')

    return (
        <group {...props}>
            <Mask
                id={MASK_ID}
                geometry={nodes.MagicGlas001.geometry}
                position={[-1.054, 1.093, 0.012]}
            />
        </group>
    )
}
