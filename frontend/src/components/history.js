const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setLocalStorage = (key, value) => {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getSkinGuessHistory = () => {
  const history = getLocalStorage("skinGuessHistory");
  return history ? history : [];
};

const getItemGuessHistory = () => {
  const history = getLocalStorage("itemGuessHistory");
  return history ? history : [];
};

const getOldItemGuessHistory = () => {
  const history = getLocalStorage("oldItemGuessHistory");
  return history ? history : [];
};

const addToSkinGuessHistory = (guess) => {
  const history = getSkinGuessHistory();
  history.push(guess);
  setLocalStorage("skinGuessHistory", history);
};

const addToItemGuessHistory = (guess) => {
  const history = getItemGuessHistory();
  history.push(guess);
  setLocalStorage("itemGuessHistory", history);
};

const addToOldItemGuessHistory = (guess) => {
  const history = getOldItemGuessHistory();
  history.push(guess);
  setLocalStorage("oldItemGuessHistory", history);
};

const clearItemHistory = () => {
  setLocalStorage("itemGuessHistory", []);
};

const clearOldItemHistory = () => {
  setLocalStorage("oldItemGuessHistory", []);
};

const clearSkinHistory = () => {
  setLocalStorage("skinGuessHistory", []);
};

const getAbilityGuessHistory = () => {
  const history = getLocalStorage("abilityGuessHistory");
  return history ? history : [];
};

const addToAbilityGuessHistory = (guess) => {
  const history = getAbilityGuessHistory();
  history.push(guess);
  setLocalStorage("abilityGuessHistory", history);
};

const clearAbilityHistory = () => {
  setLocalStorage("abilityGuessHistory", []);
};

export {
  getLocalStorage,
  setLocalStorage,
  getSkinGuessHistory,
  getItemGuessHistory,
  getOldItemGuessHistory,
  addToSkinGuessHistory,
  addToItemGuessHistory,
  addToOldItemGuessHistory,
  clearItemHistory,
  clearOldItemHistory,
  clearSkinHistory,
  addToAbilityGuessHistory,
  clearAbilityHistory,
  getAbilityGuessHistory,
};
