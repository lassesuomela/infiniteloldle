export const getCountryName = (countryCode) => {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(countryCode.toUpperCase()) || countryCode;
};
