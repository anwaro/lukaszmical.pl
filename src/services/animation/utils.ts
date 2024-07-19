export const randomInRange = (start: number, end: number) => {
    return start + Math.random() * (end - start);
};

export const randomSign = () => {
    return Math.random() < 0.5 ? 1 : -1;
};
