import {
    EffectComposer,
    Vignette,
    SMAA,
    DepthOfField,
    Bloom,
} from '@react-three/postprocessing'
import { useControls, folder } from 'leva'

export function Effects({ store }) {
    const {
        bloomEnabled,
        bloomIntensity,
        bloomLuminanceThreshold,
        bloomLuminanceSmoothing,
        depthOfFieldEnabled,
        depthOfFieldFocalLength,
        depthOfFieldBokehScale,
        depthOfFieldFocusDistance,
        vignetteEnabled,
        vignetteOffset,
        vignetteDarkness,
    } = useControls(
        'Postprocessing',
        {
            Vignette: folder({
                vignetteEnabled: { value: true, label: 'enabled' },
                vignetteOffset: {
                    value: 0.3,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    label: 'offset',
                },
                vignetteDarkness: {
                    value: 0.6,
                    min: 0,
                    max: 1.5,
                    step: 0.01,
                    label: 'darkness',
                },
            }),
            Bloom: folder({
                bloomEnabled: { value: true, label: 'enabled' },
                bloomIntensity: {
                    value: 1.28,
                    min: 0,
                    max: 3,
                    step: 0.01,
                    label: 'intensity',
                },
                bloomLuminanceThreshold: {
                    value: 0.97,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    label: 'threshold',
                },
                bloomLuminanceSmoothing: {
                    value: 0.89,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    label: 'smoothing',
                },
            }),
            'Depth of Field': folder({
                depthOfFieldEnabled: { value: true, label: 'enabled' },
                depthOfFieldFocalLength: {
                    value: 0.01,
                    min: 0,
                    max: 1,
                    step: 0.001,
                    label: 'focal length',
                },
                depthOfFieldBokehScale: {
                    value: 2,
                    min: 0,
                    max: 10,
                    step: 0.1,
                    label: 'bokeh scale',
                },
                depthOfFieldFocusDistance: {
                    value: 1,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    label: 'focus distance',
                },
            }),
        },
        { store }
    )

    return (
        <>
            <EffectComposer
                multisampling={0}
                stencilBuffer
                enableNormalPass={false}
            >
                {depthOfFieldEnabled && (
                    <DepthOfField
                        focalLength={depthOfFieldFocalLength}
                        bokehScale={depthOfFieldBokehScale}
                        focusDistance={depthOfFieldFocusDistance}
                    />
                )}
                {bloomEnabled && (
                    <Bloom
                        mipmapBlur
                        intensity={bloomIntensity}
                        luminanceThreshold={bloomLuminanceThreshold}
                        luminanceSmoothing={bloomLuminanceSmoothing}
                    />
                )}
                {vignetteEnabled && (
                    <Vignette
                        offset={vignetteOffset}
                        darkness={vignetteDarkness}
                    />
                )}
                <SMAA />
            </EffectComposer>
        </>
    )
}
