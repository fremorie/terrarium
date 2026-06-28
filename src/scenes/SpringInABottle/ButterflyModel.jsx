import { useEffect, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useGraph } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'

import { setButterflyNextPosition } from './utils/butterfly'

export const ButterflyModel = ({ orbit, material }) => {
    const group = useRef(null)
    const { scene, animations } = useGLTF('./models/Butterfly.glb')
    const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
    const { nodes } = useGraph(clonedScene)
    const { actions } = useAnimations(animations, group)

    useFrame((state) => {
        const elapsedTime = state.clock.elapsedTime

        setButterflyNextPosition(elapsedTime, group, orbit)
    })

    useEffect(() => {
        if (actions?.ArmatureAction) {
            actions.ArmatureAction.play()
            // eslint-disable-next-line
            actions.ArmatureAction.timeScale = 5.0
        }
    }, [actions?.ArmatureAction])

    useEffect(() => {
        if (!material) return
        Object.values(nodes).forEach((node) => {
            if (node.isMesh) {
                node.material = material
                node.castShadow = true
            }
        })
    }, [nodes, material])

    return (
        <group ref={group} dispose={null}>
            <group>
                <group name="Scene">
                    <group name="Armature" position={[0, 0.015, 0.017]}>
                        <primitive object={nodes.ButterflyBody} />
                        <primitive object={nodes.UpperWingR} />
                        <primitive object={nodes.LowerWingR} />
                        <primitive object={nodes.UpperWingL} />
                        <primitive object={nodes.LowerWingL} />
                    </group>
                </group>
            </group>
        </group>
    )
}

useGLTF.preload('./models/Butterfly.glb')
