export const time10Seconde = async (
  email: string,
  option?: string
): Promise<boolean> => {
  return new Promise(resolve => {
    console.log(option);
    setTimeout(() => {
      resolve(true);
    }, 5000); // Timer de 5 secondes
  });
};

export const sendmessageTerminal = async (
  email: string,
  result?: string,
  option?: string
): Promise<void> => {
  console.log(option);
  console.log('Hello, comment va tu ?');
};
