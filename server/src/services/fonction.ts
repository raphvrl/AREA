export const time10Seconde = async (): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 5000); // Timer de 5 secondes
  });
};

export const sendmessageTerminal = async (): Promise<void> => {
  console.log('Hello, comment va tu ?');
};
