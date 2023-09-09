const SelectStyles = {
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

const HoverSelectStyles = {
  option: (styles, state) => ({
    ...styles,
    cursor: "pointer",
  }),
  control: (styles) => ({
    ...styles,
    cursor: "pointer",
  }),
};

const customFilterOption = (option, inputValue) => {
  return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
};

module.exports = { SelectStyles, customFilterOption, HoverSelectStyles };
