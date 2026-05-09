const sharp = require("sharp");

/**
 * Computes the blur sigma (in pixels) for a given guess count.
 * Mirrors the client-side formula: blurVal starts at 1.0em, reducing 40% per guess.
 * We map 1em ≈ 20px for a visible effect.
 * Sharp requires sigma between 0.3 and 1000.
 */
function computeBlurSigma(guessCount) {
  const initialBlur = 1.0;
  let blurVal = initialBlur;
  for (let i = 0; i < guessCount; i++) {
    blurVal -= blurVal * 0.4;
  }
  return blurVal * 20; // scale em to pixels
}

/**
 * Applies Gaussian blur to an image buffer using sharp.
 * Returns the original buffer if guessCount results in negligible blur.
 * @param {Buffer} imageBuffer
 * @param {number} guessCount - number of wrong guesses so far
 * @returns {Promise<Buffer>}
 */
async function applyBlurToImage(imageBuffer, guessCount) {
  const sigma = computeBlurSigma(guessCount);
  if (sigma < 0.3) {
    // No meaningful blur needed – return as-is
    return imageBuffer;
  }
  return await sharp(imageBuffer)
    .blur(Math.min(sigma, 1000))
    .webp()
    .toBuffer();
}

module.exports = { computeBlurSigma, applyBlurToImage };
