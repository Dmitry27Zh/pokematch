const getRandomInteger = (from, to) => {
  return Math.floor(Math.random() * (to - from + 1) + from)
}

const getRandomIntegers = (quantity, from, to) => {
  const randomIntegers = new Set()

  while (randomIntegers.size < quantity) {
    const randomInteger = getRandomInteger(from, to)
    randomIntegers.add(randomInteger)
  }

  return [...randomIntegers]
}

export { getRandomInteger, getRandomIntegers }
