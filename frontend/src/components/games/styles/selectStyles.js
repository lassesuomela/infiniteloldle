export const SelectStyles = {
  singleValue: (provided) => ({
    ...provided,
    marginTop: "0.4em",
    marginBottom: "0.4em",
  }),
  option: (styles, state) => ({
    ...styles,
    cursor: "pointer",
  }),
  control: (styles) => ({
    ...styles,
    cursor: "pointer",
  }),
};

export const HoverSelectStyles = {
  option: (styles, state) => ({
    ...styles,
    cursor: "pointer",
  }),
  control: (styles) => ({
    ...styles,
    cursor: "pointer",
  }),
};

export const customFilterOption = (option, inputValue) => {
  return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
};

export const SelectTheme = (theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: "#1e2328", // select hover bg color
    neutral0: "#181a1c", // bg
    primary: "#1e2328", // active border and bg color of select
    neutral20: "#353739",
    primary50: "#353739",
    neutral5: "#1e2328", // active bg color
    neutral10: "#353739", // active border color
    neutral80: "#fff", // text color when typing
  },
});
