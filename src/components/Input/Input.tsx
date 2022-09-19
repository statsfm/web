import type { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { useEffect, useState, useId } from 'react';
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = ({
  label,
  prefix,
  suffix,
  maxLength,
  ...props
}: Props) => {
  const id = useId();
  const [characterCount, setCharacterCount] = useState<number>(
    props.defaultValue?.toString().length ?? 0
  );

  useEffect(() => {
    if (props.value) setCharacterCount(props.value.toString().length);
  }, [props.value]);

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCharacterCount(e.target.value.length);
  };

  return (
    <>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label}
        </label>
      )}

      <div className="flex flex-col">
        <div className="flex rounded-lg bg-foreground py-2 px-4 font-semibold">
          {prefix && <span>{prefix}</span>}
          <input
            id={id}
            className="w-full bg-transparent"
            onInput={handleInput}
            maxLength={maxLength}
            {...props}
          />
          {suffix && <span>{suffix}</span>}
        </div>

        {maxLength && (
          <span
            className={clsx(
              'text-end text-xs',
              characterCount > maxLength && 'font-semibold text-red-400'
            )}
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </>
  );
};
