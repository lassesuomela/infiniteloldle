export const getBooleanFromLocalStorage = (key: string): boolean => {
  return localStorage.getItem(key) === "true";
};
