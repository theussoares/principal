export interface PokemonBasic {
    id: number
    name: string
    image: string
    artworkImage: string
    types: string[]
}

export interface PokemonDetail {
    id: number
    name: string
    image: string
    imageAnimated?: string
    types: { name: string; color: string }[]
    stats: { name: string; value: number }[]
    height: number
    weight: number
    abilities: string[]
    moves: string[]
}

export const TYPE_COLORS: Record<string, string> = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    fighting: '#C03028',
    flying: '#A890F0',
    ghost: '#705898',
    ground: '#E0C068',
    bug: '#A8B820',
    rock: '#B8A038',
    steel: '#B8B8D0',
    poison: '#A040A0',
    normal: '#A8A878',
}
