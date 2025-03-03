
const NUM_BITS_FP = 7;
const ONE_FP = Math.pow(2, NUM_BITS_FP);
const MATERIAL_REFLECTION_AMOUNT = -3
const MATERAIL_DARKEN = (MATERIAL_REFLECTION_AMOUNT / 1.2)
const REFELCTION = false
function setGrayscale() {
    const p = palette.defaultPalette();
    for (let i = 0; i < p.length; ++i) {
        p.setColor(i, color.rgb(i * 16, i * 16, i * 16));
    }
    p.setColor(0, 0)
    palette.setColors(p)
}

function drawStars() {
    for (let i = 0; i < 200; i++) {
        scene.backgroundImage().setPixel(Math.random() * 160, Math.random() * 120, Math.random() * 16)
    }
}
function fixedDithering() {
    for (let i = 0; i < screen.width; i++) {
        for (let k = 0; k < screen.height; k++) {
            const dark = IsEven(k) && IsEven(i) ? 1 : 0
            if (dark==0) {continue}
            let c = screen.getPixel(i,k) - dark
            if (c<1) {c=16}
            if (IsEven(screen.getPixel(i,k))) {continue}
            screen.setPixel(i,k,c)
        }
    }
}
function antialse() {
    for (let i = 0; i < screen.width; i++) {
        for (let i2 = 0; i2 < screen.height; i2++) {     
            const a = (average([screen.getPixel(i - 1, i2), screen.getPixel(i, i2 - 1), screen.getPixel(i, i2 + 1)]))
            screen.setPixel(i,i2,average([a,screen.getPixel(i,i2)]))
        }
    }
}
function drawMoonFast(alpha: number, beta: number, buf: Buffer) {
    const lz = Math.sin(alpha)
    const lx = Math.cos(alpha) * cosbeta
    const ly = Math.cos(alpha) * sinbeta

    for (let x = 0; x < 160; x += 2) {
        scene.backgroundImage().getRows(20 + x, buf)
        for (let y = 0; y < 120; y += 2) {
            const fx = x - 60
            const fy = y - 60
            const r2 = fx * fx + fy * fy
            if (r2 > 3600) continue
            const fz = integerSquareRoot(3600 - r2)
            const ldot = fx * lx + fy * ly + fz * lz
            const od = (ldot > 0 ? ldot : 0)
            let col = 0
            if (REFELCTION) {
            col =  (od - MATERAIL_DARKEN)
            col = col == 0 ? od : col = col
            if (col < 0) { col = od}
            } else {
                col = od
            }
            const col3 = shift2(col+3)

            buf.setUint8(y, shift2(col))
            buf.setUint8(y + 1, shift2(col + 1))
            buf.setUint8(y + 119, col3)
            buf.setUint8(y + 120, col3)
            buf.setUint8(y + 121, shift2(col + 2))
        }
        scene.backgroundImage().setRows(20 + x, buf)
    }    
}
let avg = 100
function FastToString(num:number) {
    const v = (num/1000)
    avg = (avg + avg + v) / 3
    return v.toString()
}
setGrayscale()
drawStars()
const buf = Buffer.create(260)
const beta = Math.PI * 30 / 180
const sinbeta = Math.sin(beta)
const cosbeta = Math.cos(beta)

game.onShade(function() {
    const t = control.micros()
    const alpha = game.runtime() / 2000
    drawMoonFast(alpha, beta, buf)
    if (!controller.A.isPressed()) {
    antialse()
    fixedDithering()
    }
    screen.print("rendertimeMS:" + (FastToString(Math.round((control.micros() - t)))),0,0,15)
    screen.print("FPS:" + Math.round(1000 / ((control.micros() - t) / 1000)),0,10,15)
    screen.print("avgTimeMS:" + avg.toString().substr(0,5),0,100,15)
    screen.print("avgFps:" + ( 1000 / avg).toString().substr(0,5),0,110,15)
})

