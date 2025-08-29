import * as React from "react"
import { OTPInput, type SlotProps, type OTPInputProps,REGEXP_ONLY_DIGITS } from "input-otp"
// import { MinusIcon } from "lucide-react"

type InputOTPProps = OTPInputProps & {
  containerClassName?: string;
};

// Small utility; replace with your cn if you have one
function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function InputOTP({
  className,
  containerClassName,
  // Good defaults: numeric keyboard + numeric-only pattern
  inputMode = "numeric",
  pattern = REGEXP_ONLY_DIGITS as unknown as string,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      inputMode={inputMode}
      pattern={pattern}
      containerClassName={cn(
        "group relative flex items-center justify-center has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("focus-visible:ring-0 disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}



function InputOTPGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

// interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
//   index: number
// }

function InputOTPSlot(props: SlotProps & { className?: string }) {
  const { isActive, hasFakeCaret, char, placeholderChar, ...rest } = props

  return (
    <div
      // CRITICAL: spread the slot props so clicks/typing route to the hidden input
      {...rest}
      data-slot="input-otp-slot"
      className={cn(
        "relative w-10 h-14 text-[2rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
        "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
        "outline outline-0 outline-accent-foreground/20",
        isActive ? "outline-4 outline-accent-foreground" : "",
        props.className
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {char ?? placeholderChar ?? ""}
      </div>
      {hasFakeCaret && (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
          <div className="w-px h-8 bg-foreground" />
        </div>
      )}
    </div>
  )
}


function InputOTPSeparator(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className="flex w-10 justify-center items-center"
      {...props}
    >
      <div className="w-3 h-1 rounded-full bg-border" />
    </div>
  )
}


export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }