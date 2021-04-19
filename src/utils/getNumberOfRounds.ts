const getNumberOfRounds = (length: number) =>
  Math.log(length) / Math.log(2) + 1;

export default getNumberOfRounds;
