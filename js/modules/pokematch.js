import { getRandomIntegers } from '../utils/number.js'

const initPokematch = () => {
  const URL = 'https://pokeapi.co/api/v2/pokemon/'
  const CARDS_QUANTITY = 8
  const PokeIndex = {
    MIN: 0,
    MAX: 150,
  }

  const loadPokemon = async () => {
    const randomIds = getRandomIntegers(CARDS_QUANTITY, PokeIndex.MIN, PokeIndex.MAX)
    const responses = await Promise.all(randomIds.map((id) => fetch(`${URL}${id}`)))
    const pokemon = await Promise.all(responses.map((response) => response.json()))
    console.log(pokemon)
  }

  loadPokemon()
}

initPokematch()
