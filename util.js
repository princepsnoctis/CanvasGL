function random(min, max) {
    return Math.random() * (max + min) - min
}

function shade(x, y, rgb)
{
    ctx.fillStyle = `rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})`;
    ctx.fillRect(x, y, 1, 1);
}