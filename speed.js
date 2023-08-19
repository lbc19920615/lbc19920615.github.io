// const fibonacci = n => {
//     let a = 0, b = 1, c = n;

//     for(let i = 2; i <= n; i++) {
//         c = a + b;
//         a = b;
//         b = c;
//     }

//     return c;
// };


const trampoline = (x) => {
    while (typeof x == 'function') x = x()
    return x;
}

const lazy = (f) => (...args) => () => f(...args)

function factorial (n) {
  const f = lazy((a, n) => n == 0 ? a : f(n * a, n - 1));
  return trampoline(f(1, n));
}

fibonacci(35)