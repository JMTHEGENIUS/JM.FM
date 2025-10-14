// chebyshev.js
export function chebyshevEval(coeffs, tau) {
  const n = coeffs.length;
  if (n === 0) return 0;

  // Clenshaw algorithm for numerical stability
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = n - 1; i >= 0; i--) {
    b2 = b1;
    b1 = b0;
    b0 = 2 * tau * b1 - b2 + coeffs[i];
  }
  return 0.5 * (b0 - b2);
}
