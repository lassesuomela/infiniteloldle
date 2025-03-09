export const getCountryName = (countryCode) => {
  if (typeof countryCode !== "string") {
    return null;
  }
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(countryCode.toUpperCase()) || countryCode;
};
