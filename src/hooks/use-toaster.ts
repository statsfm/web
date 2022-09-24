export const useToaster = () => {
  // eslint-disable-next-line no-alert
  return (message: string, _timeout?: number) => alert(message);
};
