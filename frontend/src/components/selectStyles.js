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
