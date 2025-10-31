const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const SCREEN_WIDTH = 200;
const SCREEN_HEIGHT = 200;

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const vertices = [
    [random(0, SCREEN_WIDTH), random(0, SCREEN_HEIGHT)],
    [random(0, SCREEN_WIDTH), random(0, SCREEN_HEIGHT)],
    [random(0, SCREEN_WIDTH), random(0, SCREEN_HEIGHT)],
]

// Color matrix, each column is one color (RGB)
const C = new Matrix([
    [1, 0, 1],
    [1, 1, 0],
    [0, 1, 1]
])

for (let x = 0; x < SCREEN_WIDTH; x++) {
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
        const system = new Matrix([
            vertices.map(e => e[0]).concat(x),
            vertices.map(e => e[1]).concat(y),
            [1, 1, 1, 1],
        ])

        system.rref();

        const l = system.solve();

        if(!l || l.entries.flat().some(x => x < 0)) continue;

        const color = C.multiply(l);

        shade(x, y, color.entries);
    }
}