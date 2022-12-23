import { shuffleArray } from '../utils/array.js'
import { getRandomIntegers } from '../utils/number.js'

const initPokematch = () => {
  const URL = 'https://pokeapi.co/api/v2/pokemon/'
  const CARDS_QUANTITY = 8
  const PokeIndex = {
    MIN: 0,
    MAX: 150,
  }
  const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
  }
  let isPaused = false
  let firstPick
  let matches = 0
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
        const { name, types, sprites } = pokemon
        const type = types?.[0]?.type?.name
        const color = colors[type]
        const imageSrc = sprites?.front_default

        return `
          <li>
            <button class="pokematch__card" data-pokename="${name}" type="button" onclick="clickCard(event)" style="background-color: ${color}">
              <div class="pokematch__card-side pokematch__card-front"></div>
              <div class="pokematch__card-side pokematch__card-back rotated" style="background-color: ${color}">
                <img
                  class="pokematch__card-img"
                  src="${imageSrc}"
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

  const clickCard = (event) => {
    const pokeCard = event.currentTarget
    const [front, back] = getFrontAndBackFromCard(pokeCard)

    if (!checkRotationNeed(front)) {
      return
    }

    rotateParts([front, back])
    isPaused = true

    if (!firstPick) {
      firstPick = pokeCard
      isPaused = false
    } else {
      const firstPickName = firstPick.dataset.pokename
      const secondPickName = pokeCard.dataset.pokename

      if (firstPickName !== secondPickName) {
        const [firstPickFront, firstPickBack] = getFrontAndBackFromCard(firstPick)

        setTimeout(() => {
          rotateParts([front, back, firstPickFront, firstPickBack])
          firstPick = null
          isPaused = false
        }, 500)
      } else {
        matches++
        firstPick = null
        isPaused = false
      }
    }

    if (matches === 8) {
      setTimeout(() => {
        alert('Win!')
        resetGame
      }, 1000)
    }
  }

  const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector('.pokematch__card-front')
    const back = card.querySelector('.pokematch__card-back')
    return [front, back]
  }

  const rotateParts = (parts) => parts.forEach((part) => part.classList.toggle('rotated'))
  const checkRotationNeed = (front) => !front.classList.contains('rotated') && !isPaused

  const resetGame = () => {
    board.innerHTML = ''
    isPaused = true
    firstPick = null
    matches = 0

    setTimeout(async () => {
      const pokemon = await loadPokemon()
      displayPokemon([...pokemon, ...pokemon])
      isPaused = false
    }, 500)
  }

  resetGame()
  window.resetGame = resetGame
  window.clickCard = clickCard
}

initPokematch()
