import type { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
}

export const Section = ({
  title,
  description,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <section>
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background pt-10 pb-3">
        <div>
          <h2>{title}</h2>
          <p className="my-0">{description}</p>
        </div>
      </header>

      <main>{children}</main>
    </section>
  );
};
