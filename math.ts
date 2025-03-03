// Add your code here
function sqrthelp(x:number) {
    return Fx.toInt(Fx.floor(Fx.div(Fx.add(Fx8(x),Fx.oneFx8),Fx.twoFx8)))
}
/** 
 * copilet made this function.
*/
function integerSquareRoot(n: number): number {
    let x = n;
    let y = sqrthelp(x)
    while (y < x) {
        x = y;
        y = Math.floor((x + n / x) / 2);
    }

    return x;
}
const two = Fx8(2)
function IsEven(a:number) {
   return a % 2 == 0
}
function average(numbers:number[]) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length
}
function shift2(n:number) {
    return Fx.toInt(Fx.floor(Fx.rightShift(Fx8(n),2)))
}
