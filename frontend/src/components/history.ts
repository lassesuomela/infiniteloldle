type ChampionResult = {
  key: string;
  isCorrect: boolean;
  name: string;
};

type AbilityGuessHistory = ChampionResult[];
type SplashGuessHistory = ChampionResult[];

type ChampionInfo = {
  guessedChampion: string;
  championKey: string;
  resource: string;
  gender: number;
  position: string;
  rangeType: string;
  region: string;
  releaseYear: string;
  genre: string;
  damageType: string;
};

type ChampionComparison = {
  sameResource: boolean;
  sameGender: boolean;
  sameReleaseYear: string;
  samePosition: boolean;
  sameRangeType: boolean;
  sameRegion: boolean;
  sameGenre: boolean;
  sameDamageType: boolean;
};

type ChampionComparisonResult = [ChampionInfo, ChampionComparison];

type ChampionGuessHistory = ChampionComparisonResult[];

type ItemResult = { itemId: number; name: string; isCorrect: boolean };
type ItemGuessHistory = ItemResult[];

type OldItemResult = { id: string; name: string; isCorrect: boolean };
type OldItemGuessHistory = OldItemResult[];

const getLocalStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setLocalStorage = <T>(key: string, value: T | null | undefined): void => {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getSkinGuessHistory = (): SplashGuessHistory => {
  const history = getLocalStorage<SplashGuessHistory>("skinGuessHistory");
  return history ? history : [];
};

const getItemGuessHistory = (): ItemGuessHistory => {
  const history = getLocalStorage<ItemGuessHistory>("itemGuessHistory");
  return history ? history : [];
};

const getOldItemGuessHistory = (): OldItemGuessHistory => {
  const history = getLocalStorage<OldItemGuessHistory>("oldItemGuessHistory");
  return history ? history : [];
};

const getChampionGuessHistory = (): ChampionGuessHistory => {
  const history = getLocalStorage<ChampionGuessHistory>("championGuessHistory");
  return history ? history : [];
};

const getAbilityGuessHistory = (): AbilityGuessHistory => {
  const history = getLocalStorage<AbilityGuessHistory>("abilityGuessHistory");
  return history ? history : [];
};

const addToChampionGuessHistory = (guess) => {
  const history = getChampionGuessHistory();
  history.push(guess);
  setLocalStorage("championGuessHistory", history);
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

const clearChampionHistory = () => {
  setLocalStorage("championGuessHistory", []);
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
  getChampionGuessHistory,
  addToChampionGuessHistory,
  clearChampionHistory,
};
