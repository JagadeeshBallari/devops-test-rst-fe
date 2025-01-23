// components/MultiSelectDropdown.tsx
import React from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  onChange: (selectedOptions: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
  value: MultiValue<Option>;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, onChange, value }) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select options..."
      className="basic-multi-select"
      classNamePrefix="select"
      styles={{
        // Custom styles for selected items
        multiValue: (provided) => ({
          ...provided,
          backgroundColor: '#e0e0e0',
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          color: '#000', // Text color for selected items
        }),
      }}
    />
  );
};

export default MultiSelectDropdown;
