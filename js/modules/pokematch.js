import { shuffleArray } from '../utils/array.js'
import { getRandomIntegers } from '../utils/number.js'

const initPokematch = () => {
  const URL = 'https://pokeapi.co/api/v2/pokemon/'
  const CARDS_QUANTITY = 8
  const PokeIndex = {
    MIN: 0,
    MAX: 150,
  }
  const board = document.querySelector('#pokematch-board')

  if (!board) {
    return
  }

  const loadPokemon = async () => {
    const randomIds = getRandomIntegers(CARDS_QUANTITY, PokeIndex.MIN, PokeIndex.MAX)
    const responses = await Promise.all(randomIds.map((id) => fetch(`${URL}${id}`)))
    const pokemon = await Promise.all(responses.map((response) => response.json()))
    return pokemon
  }

  const displayPokemon = (pokemon) => {
    shuffleArray(pokemon)
    const pokemonHTML = pokemon
      .map((pokemon) => {
        const { name } = pokemon

        return `
        <li>
          <button class="pokematch__card" data-pokename="${name}" type="button">
            <div class="pokematch__card-side pokematch__card-front"></div>
            <div class="pokematch__card-side pokematch__card-back" style="background-color: #def3fd">
              <img
                class="pokematch__card-img"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
                alt="${name}"
              />
              <h2 class="pokematch__card-name">${name}</h2>
            </div>
          </button>
        </li>
      `
      })
      .join('')
    board.innerHTML = pokemonHTML
  }

  const resetGame = async () => {
    const pokemon = await loadPokemon()
    displayPokemon([...pokemon, ...pokemon])
  }

  resetGame()
}

initPokematch()
