interface Props {
  progress: {
    progress: number;
    description?: string;
  };
}

export const ProgressBar = ({ progress }: Props) => {
  return (
    <>
      <h4 className={'mt-10'}>{progress.description}</h4>
      <div
        className={
          'mt-2 block w-full cursor-pointer rounded-2xl border-0 bg-primary/10 text-center font-bold text-white transition-colors duration-300 '
        }
      >
        <div
          className={`block cursor-pointer rounded-2xl border-0 bg-primary/70 py-3 px-5 text-center font-bold text-white transition-all duration-300`}
          style={{ width: `${progress.progress}%` }}
        ></div>
      </div>
    </>
  );
};
