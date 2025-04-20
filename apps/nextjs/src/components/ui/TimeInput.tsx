import React from "react";

interface Props {
  value: string;
  valueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeInput: React.FC<Props> = ({ value, valueChange }) => {
  return (
    <div className="mr-2 flex">
      <div className="relative">
        <input
          type="time"
          id="time-input"
          name="time"
          value={value}
          onChange={valueChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 "
        />
      </div>
    </div>
  );
};

export default TimeInput;
