import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  labelClassName?: string;
  name: string;
}

const Input: React.FC<InputProps> = ({
  label,
  className = "",
  labelClassName = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        id={props.id || label}
        className={cn(
          "peer w-full h-10 bg-transparent border-b border-gray-400 focus:border-black transition-all duration-300 outline-none px-1.5 placeholder-transparent",
          className
        )}
        placeholder=" "
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value !== "")}
        autoComplete="off"
      />
      <label
        htmlFor={props.id || label}
        className={cn(
          `absolute left-2 text-gray-400 text-sm transition-all 
          ${
            isFocused
              ? "-top-3 text-sm text-gray-800"
              : "top-2 text-base text-gray-500"
          }
          peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 2xl:peer-placeholder-shown:text-base xl:peer-placeholder-shown:text-base lg:peer-placeholder-shown:text-base md:peer-placeholder-shown:text-base sm:peer-placeholder-shown:text-base  peer-placeholder-shown:text-gray-500
          peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-800`,
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
