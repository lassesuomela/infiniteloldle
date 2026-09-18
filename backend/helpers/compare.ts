const GetPartialSimilarites = (currentGuess, correctChampion) => {
  const guessPos = currentGuess.split(",").sort();
  const correctPos = correctChampion.split(",").sort();

  if (guessPos.length === correctPos.length) {
    let matches = 0;

    for (let i = 0; i < guessPos.length; i++) {
      for (let j = 0; j < correctPos.length; j++) {
        if (guessPos[i] === correctPos[j]) {
          matches++;
        }
      }
    }

    if (matches === guessPos.length) {
      return true;
    }
  }

  // check for partial matches
  for (let i = 0; i < guessPos.length; i++) {
    for (let j = 0; j < correctPos.length; j++) {
      if (guessPos[i] === correctPos[j]) {
        return "partial";
      }
    }
  }

  // no matches at all
  return false;
};

module.exports = {
  GetPartialSimilarites,
};
