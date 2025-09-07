import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import React from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import type { IconType } from "react-icons";
import { cn } from "@utils/cn";

interface IMainButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean;
  loading?: boolean;
  startIcon?: IconType;
  endIcon?: IconType;
}

const buttonVariants = cva(
  "inline-flex select-none relative rounded-md items-center justify-center shrink-0 text-sm grow-0 disabled:pointer-events-none focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: cn(
          "text-white",
          "bg-primary hover:bg-primary/90 active:bg-primary/80",
          "disabled:bg-primary/50"
        ),

        secondary: cn(
          "text-black",
          "bg-secondary hover:bg-secondary/90 active:bg-secondary/80",
          "disabled:bg-secondary/50"
        ),

        tertiary: cn(
          "text-white",
          "bg-tertiary hover:bg-tertiary/90 active:bg-tertiary/80",
          "disabled:bg-tertiary/50"
        ),

        success: cn(
          "text-white",
          "bg-success hover:bg-success/90 active:bg-success/80",
          "disabled:bg-success/50"
        ),

        danger: cn(
          "text-white",
          "bg-error hover:bg-error/90 active:bg-error/80",
          "disabled:bg-error/50"
        ),

        outline: cn(
          "text-primary",
          "hover:bg-primary/10",
          "border-primary border-2",
          "disabled:text-gray-400 disabled:border-gray-400 disabled:bg-gray-100"
        ),

        link: cn(
          "text-primary",
          "bg-transparent",
          "disabled:text-primary/50 disabled:no-underline"
        ),

        ghost: cn(
          "text-black",
          "bg-transparent",
          "disabled:text-gray-400, p-0"
        ),
      },
      size: {
        xs: "h-[1.9375rem] px-[0.625rem] py-[0.3125rem] text-sm font-medium",
        sm: "h-[2.375rem] px-[0.875rem] py-[0.375rem] text-sm font-medium",
        md: "h-[2.625rem] px-[1.25rem] py-[0.5rem] text-sm font-medium",
        lg: "h-[3rem] px-[1.5rem] py-[0.75rem] text-base font-medium ",
        super: "h-[3.5rem] px-[1.5rem] py-[1rem] text-base font-semibold",
        icon: "h-8 w-8 rounded-super",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const MainButton = React.forwardRef<HTMLButtonElement, IMainButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      type = "button",
      startIcon: StartIcon,
      endIcon: EndIcon,
      disabled,
      loading,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        type={type}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant, size, className }),
          "whitespace-nowrap transition-all duration-200 ease-in-out",
          { "ps-12": !!StartIcon, "pe-12": !!EndIcon },
          { "pointer-events-none": isDisabled }
        )}
        ref={ref}
        {...props}
      >
        {loading ? (
          <HiOutlineArrowPath className="text z-10 h-5 w-5 animate-spin duration-1000" />
        ) : (
          children
        )}
        {StartIcon && (
          <div className="absolute start-4 top-1/2 z-10 -translate-y-1/2 text-[inherit]">
            {loading ? (
              <HiOutlineArrowPath className="text z-10 h-5 w-5 animate-spin duration-1000" />
            ) : (
              <StartIcon className="z-10 h-5 w-5" />
            )}
          </div>
        )}
        {EndIcon && (
          <div className="absolute end-4 top-1/2 z-10 -translate-y-1/2 text-[inherit]">
            {loading ? (
              <HiOutlineArrowPath className="z-10 h-5 w-5 animate-spin duration-1000" />
            ) : (
              <EndIcon className="z-10 h-5 w-5" />
            )}
          </div>
        )}
      </button>
    );
  }
);

MainButton.displayName = "Button";

export default MainButton;
