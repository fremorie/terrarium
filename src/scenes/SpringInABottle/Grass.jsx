import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

import { GrassField } from '../../components/common/Grass/GrassField'
import { getGrassBladesPositions, GRASS_CONFIG } from './utils/grass'
import { useStencil } from './utils/stencilBuffer'
import { SEASONS } from './store/useSceneState'

const TERRAIN_MESH_POSITION = new THREE.Vector3(0.005, 0.32, -0.003)

export function Grass() {
    const stencil = useStencil(SEASONS.spring)

    const { nodes } = useGLTF('./models/Spring/Terrain.glb')

    const terrainRaycasterMesh = useMemo(() => {
        const mesh = new THREE.Mesh(nodes.GrassPlane.geometry)
        mesh.position.copy(TERRAIN_MESH_POSITION)
        mesh.updateMatrixWorld(true)
        return mesh
    }, [nodes.GrassPlane.geometry])

    const clamps = useMemo(
        () =>
            GRASS_CONFIG.flatMap(({ center, radius, count }) =>
                getGrassBladesPositions(
                    terrainRaycasterMesh,
                    center,
                    radius,
                    count
                )
            ),
        [terrainRaycasterMesh]
    )

    return <GrassField positions={clamps} {...stencil} />
}

useGLTF.preload('./models/Spring/Terrain.glb')
