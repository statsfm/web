import type { FormEventHandler, TextareaHTMLAttributes } from 'react';
import { useEffect, useState, useId } from 'react';
import clsx from 'clsx';

interface Props extends TextareaHTMLAttributes<HTMLInputElement> {
  label?: string;
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
}

export const Textarea = ({
  label,
  maxLength,
  className,
  resize = 'vertical',
  ...props
}: Props) => {
  const id = useId();
  const [characterCount, setCharacterCount] = useState<number>(
    props.defaultValue?.toString().length ?? 0,
  );

  useEffect(() => {
    if (props.value) setCharacterCount(props.value.toString().length);
  }, [props.value]);

  const handleInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
    // @ts-ignore TODO: add type checking
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
        <textarea
          id={id}
          className={clsx(
            className,
            'flex rounded-lg bg-foreground p-4 text-base font-semibold ring-neutral-500 focus:outline-none focus:ring-2',
          )}
          style={{ resize }}
          // @ts-ignore
          onInput={handleInput}
          maxLength={maxLength}
          {...props}
        />

        {maxLength && (
          <span
            className={clsx(
              'text-end text-xs',
              characterCount > maxLength && 'font-semibold text-red-400',
            )}
          >
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </>
  );
};
