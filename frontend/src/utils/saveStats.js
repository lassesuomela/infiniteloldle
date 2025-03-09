function saveStats(key, data) {
  const today = new Date().toISOString().split("T")[0];

  if (localStorage.getItem(key) !== null) {
    // If the key already exists, update the data
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    // If the key does not exist, create a new entry
    const dataToStore = { value: 1 };
    const newData = { [today]: dataToStore };
    localStorage.setItem(key, JSON.stringify(newData));
  }
}

function saveGamesPlayed() {
  const key = "gamesPlayed";
  const today = new Date().toISOString().split("T")[0];
  let existingData;
  if (localStorage.getItem(key)) {
    existingData = JSON.parse(localStorage.getItem(key));
    const dataToStore = {
      value: existingData[today] ? (existingData[today].value += 1) : 0,
    };
    existingData[today] = dataToStore;
  }
  saveStats(key, existingData);
}

function saveTries(tries) {
  const key = "triesPerDay";
  const today = new Date().toISOString().split("T")[0];
  let existingData;
  if (localStorage.getItem(key)) {
    existingData = JSON.parse(localStorage.getItem(key));
    const dataToStore = {
      value: existingData[today] ? existingData[today].value + tries : tries,
    };
    existingData[today] = dataToStore;
  }
  saveStats(key, existingData);
}

function saveFirstTries() {
  const key = "firstTriesPerDay";
  const today = new Date().toISOString().split("T")[0];
  let existingData;
  if (localStorage.getItem(key)) {
    existingData = JSON.parse(localStorage.getItem(key));
    const dataToStore = {
      value: existingData[today] ? existingData[today].value + 1 : 1,
    };
    existingData[today] = dataToStore;
  }
  saveStats(key, existingData);
}

function saveScore(score) {
  const key = "scorePerDay";
  const today = new Date().toISOString().split("T")[0];
  let existingData;
  if (localStorage.getItem(key)) {
    existingData = JSON.parse(localStorage.getItem(key));
    const dataToStore = {
      value: score,
    };
    existingData[today] = dataToStore;
  }
  saveStats(key, existingData);
}

function initValues() {
  const keys = [
    "scorePerDay",
    "firstTriesPerDay",
    "triesPerDay",
    "gamesPlayed",
  ];

  const today = new Date().toISOString().split("T")[0];
  const defaultData = {
    value: 0,
  };
  const newData = { [today]: defaultData };

  for (const key in keys) {
    if (localStorage.getItem(keys[key]) === null) {
      localStorage.setItem(keys[key], JSON.stringify(newData));
      continue;
    }

    const existingData = JSON.parse(localStorage.getItem(keys[key]));

    if (existingData[today] === undefined) {
      existingData[today] = defaultData;
      localStorage.setItem(keys[key], JSON.stringify(existingData));
    }
  }
}

export {
  saveStats,
  saveGamesPlayed,
  saveTries,
  saveFirstTries,
  saveScore,
  initValues,
};
