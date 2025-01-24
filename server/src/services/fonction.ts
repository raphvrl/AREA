export const time10_seconde = async (): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 5000); // Timer de 5 secondes
    });
};

export const sendmessage_terminal = async (): Promise<void> => {
    console.log("Hello, comment va tu ?");
};
