export const debounce = (callback: Function, wait: number) => {
  let timeoutId: any = null;
  return (...args: any) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      setTimeout(async () => {
        await callback(...args);
        resolve(true);
      }, wait);
    });
  };
};
