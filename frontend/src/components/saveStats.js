function saveStats(key, data) {
  const today = new Date().toISOString().split("T")[0];

  if (isLocalStorageKeyExists(key)) {
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

// Function to check if the key exists in localStorage
function isLocalStorageKeyExists(key) {
  return localStorage.getItem(key) !== null;
}

// Export the saveStats function
export { saveStats, saveGamesPlayed, saveTries, saveFirstTries, saveScore };
