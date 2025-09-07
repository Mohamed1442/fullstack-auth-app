import { cn } from "@utils/cn";
import InlineInputWrapper from "@components/InlineInputWrapper/InlineInputWrapper";
import type { IconType } from "react-icons";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import {
  forwardRef,
  useEffect,
  useState,
  type DOMAttributes,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

export interface IInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  placeholder?: string;
  type?: string;
  optional?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "super" | "lg" | "md" | "sm";
  startIcon?: IconType;
  endIcon?: IconType;
  endLabelElement?: ReactNode;
  onEndIconClick?: DOMAttributes<HTMLButtonElement>["onClick"];
}

const MainInput = forwardRef<HTMLInputElement, IInputProps>(function Input(
  {
    label,
    optional,
    error,
    disabled,
    type = "text",
    size = "super",
    placeholder,
    required,
    startIcon: StartIcon,
    endIcon: EndIcon,
    onEndIconClick,
    endLabelElement,
    className,
    value,
    onChange,
    defaultValue,
    name,
    ...rest
  }: IInputProps,
  ref
): React.ReactElement {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleTogglePassword = (): void => setShowPassword((p) => !p);
  const handleEndIconClick = (e: MouseEvent<HTMLButtonElement>): void => {
    if (type === "password") handleTogglePassword();
    onEndIconClick?.(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setHasValue(e.target.value !== "");
    onChange?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    rest.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    rest.onBlur?.(e);
  };

  const CurrentEndIcon = isPassword
    ? showPassword
      ? HiEye
      : HiEyeSlash
    : EndIcon;

  useEffect(() => {
    setHasValue(value != null && value !== "");
  }, [value]);

  return (
    <InlineInputWrapper
      error={error}
      required={required}
      disabled={disabled}
      optional={optional}
      className={className}
    >
      <div className="relative">
        <input
          onWheel={(e) => e.currentTarget.blur()} // Prevents changing value on scroll
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          autoComplete="off"
          value={value}
          defaultValue={defaultValue}
          name={name}
          className={cn(
            "peer",
            "overflow-hidden border-0 !border-none outline-none outline-0 ring-0",
            "flex w-full items-center gap-2 self-stretch rounded-md bg-white p-5 font-normal ring-1 ring-gray-200",
            "transition-all duration-200 ease-in-out",
            "text-base",
            "disabled:bg-gray-100",
            "focus:ring-2 focus:ring-primary",
            "placeholder:text-base placeholder:font-medium placeholder:text-[#757575D9]",
            { "ring-error focus:ring-error": !!error },
            {
              "ps-12": !!StartIcon,
              "pe-12": !!CurrentEndIcon,
            },
            {
              "h-14": size === "super",
              "h-12": size === "lg",
              "h-11": size === "md",
              "h-[2.375rem]": size === "sm",
            }
          )}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <label
          className={cn(
            "origin-top-start absolute start-4 top-1/2 z-0 -translate-y-1/2 transform transition-all duration-200 ease-in-out",
            "pointer-events-none",
            "text-base text-gray-500",
            {
              "top-0 rounded-full bg-white px-1 text-xs text-primary":
                isFocused || hasValue,
              "peer-focus:top-0 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:text-primary":
                !isFocused && !hasValue,
            }
          )}
        >
          {label}
          {required && <span className="ms-2 text-error">*</span>}
        </label>
        {StartIcon && (
          <div className="absolute start-4 top-1/2 z-10 -translate-y-1/2 text-[#757575D9]">
            {StartIcon && <StartIcon className="z-10 h-5 w-5" />}
          </div>
        )}
        {CurrentEndIcon &&
          (onEndIconClick || isPassword ? (
            <button
              type="button"
              className="absolute end-4 top-1/2 z-10 -translate-y-1/2 rounded-full text-[#757575D9] peer-placeholder-shown:text-[#757575D9]"
              onClick={handleEndIconClick}
            >
              {CurrentEndIcon && <CurrentEndIcon className="z-10 h-5 w-5" />}
            </button>
          ) : (
            <div className="absolute end-4 top-1/2 z-10 -translate-y-1/2">
              {CurrentEndIcon && <CurrentEndIcon className="z-10 h-5 w-5" />}
            </div>
          ))}
        {endLabelElement}
      </div>
    </InlineInputWrapper>
  );
});

export default MainInput;
