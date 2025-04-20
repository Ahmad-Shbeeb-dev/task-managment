import { forwardRef, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

type InputProps = {
  value?: string;
  onChange: (value?: string) => void;
  // onChange: ChangeEventHandler<HTMLInputElement>;
  debounce?: number;
  inputType?: "input" | "textarea";
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

export const DebouncedInput = forwardRef<
  HTMLInputElement & HTMLTextAreaElement,
  InputProps
>(
  (
    {
      value: initialValue,
      onChange,
      inputType = "input",
      debounce = 500,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState(initialValue);

    // https://github.com/xnimorz/use-debounce
    const debouncedOnChange = useDebouncedCallback(() => {
      if (value) {
        onChange(value); //parent onChange
      }
    }, debounce);

    // When the component goes to be unmounted, we will force execute onChange before unmounting
    useEffect(
      () => () => {
        debouncedOnChange.flush();
      },
      [debouncedOnChange],
    );

    // useEffect(() => {
    //   setValue(initialValue);
    // }, [initialValue]);

    // useEffect(() => {
    //   const timeout = setTimeout(() => {
    //     onChange(value);
    //   }, debounce);

    //   return () => clearTimeout(timeout);
    // }, [value]);

    const renderInputType = (type: typeof inputType) => {
      if (type === "input")
        return (
          <Input
            {...props}
            ref={ref}
            value={value ?? ""}
            onChange={(e) => {
              setValue(e.target.value);
              debouncedOnChange();
            }}
          />
        );

      if (type === "textarea")
        return (
          <Textarea
            {...props}
            ref={ref}
            value={value ?? ""}
            onChange={(e) => {
              setValue(e.target.value);
              debouncedOnChange();
            }}
          />
        );
    };

    return <>{renderInputType(inputType)}</>;
  },
);

DebouncedInput.displayName = "DebouncedInput";
