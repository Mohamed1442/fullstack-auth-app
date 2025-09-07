import { cn } from "@utils/cn";

type Props = {
  disabled?: boolean;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  label?: string;
  optional?: string;
  error?: string;
};

const InlineInputWrapper = ({
  label,
  optional,
  required,
  className,
  disabled,
  children,
  error,
}: Props): React.ReactElement => {
  return (
    <div
      className={cn(
        "relative",
        "transition-all",
        "mb-xs group flex w-full flex-col items-start gap-1 rounded-none p-0",
        {
          "[&>*]:!text-disabled pointer-events-none": disabled,
        },
        className
      )}
    >
      {!!label && (
        <label className="flex w-full flex-row items-end justify-between self-stretch whitespace-nowrap text-sm font-bold text-gray-700">
          <span className="capitalize">
            {label}
            {required && <span className="text-error ms-2">*</span>}
          </span>
          <span className="font-regular text-xs text-gray-500">{optional}</span>
        </label>
      )}
      <div className="relative w-full">{children}</div>
      {!!error && !disabled ? (
        <span
          role="alert"
          aria-live="assertive"
          className="text-error line-clamp-2 inline-block overflow-hidden text-ellipsis text-xs font-medium leading-3"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default InlineInputWrapper;
