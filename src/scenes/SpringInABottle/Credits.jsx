import { Explanation } from '../../components/layout/Explanation/Explanation'

export function Credits() {
    return (
        <Explanation title="Credits">
            <h2>Assets</h2>
            <ul>
                <li>
                    <b>Snowflake texture:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://kenney.nl/assets/particle-pack"
                    >
                        Kenney Particle Pack
                    </a>
                </li>
                <li>
                    <b>Environment map:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://polyhaven.com/a/venice_sunset"
                    >
                        Venice Sunset by Greg Zaal
                    </a>
                </li>
                <li>
                    <b>Ring matcap texture:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://github.com/nidorx/matcaps/blob/1b1e43a338335b6401034d48488298966755d717/PAGE-4.md#331a0b_b17038_7d4e28_5b351a"
                    >
                        nidorx/matcaps
                    </a>
                    <br />
                    <i>(original author unknown)</i>
                </li>
                <li>
                    <b>Boat model:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://www.kenney.nl/assets/watercraft-kit"
                    >
                        Kenney Watercraft Kit
                    </a>
                </li>
                <li>
                    <b>Font "Purisa Bold":&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://github.com/tlwg/fonts-tlwg/tree/master"
                    >
                        Fonts-TLWG
                    </a>
                </li>
                <li>
                    <b>Cherry blossom petal texture:</b> AI-generated
                </li>
            </ul>

            <h2>Sounds</h2>
            <ul>
                <li>
                    <b>Cork pop sound:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://freesound.org/people/HenKonen/sounds/757257/"
                    >
                        Wine cork by HenKonen
                    </a>
                </li>
                <li>
                    <b>Cork seal sound:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://freesound.org/people/HenKonen/sounds/757208/"
                    >
                        Gas pressure escaping by HenKonen
                    </a>
                </li>
                <li>
                    <b>Music:&nbsp;</b>
                    AI-generated
                </li>
            </ul>

            <h2>Other</h2>
            <ul>
                <li>
                    <b>Voronoi 3d implementation:&nbsp;</b>
                    <a
                        target="_blank"
                        href="https://github.com/MaxBittker/glsl-voronoi-noise/blob/76089081d7154629eec8641fe12e7642b56f4312/3d.glsl#L17"
                    >
                        MaxBittker/glsl-voronoi-noise
                    </a>
                </li>
                <li>
                    <b>Water ripple effect:&nbsp;</b>
                    inspired by&nbsp;
                    <a
                        target="_blank"
                        href="https://youtu.be/MXpML0B2MJc?si=Tu4KNmGdHp-UF5D_&t=462"
                    >
                        Bruno Simon's video
                    </a>
                </li>
                <li>
                    <b>Perlin noise texture:&nbsp;</b>
                    generated with&nbsp;
                    <a
                        target="_blank"
                        href="https://htmlpreview.github.io/?https://github.com/blackears/PerlinNoiseMaker/blob/master/index.html"
                    >
                        Perlin Noise Maker
                    </a>
                </li>
            </ul>
        </Explanation>
    )
}
