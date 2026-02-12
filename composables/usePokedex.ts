import { ref, computed } from 'vue'
import type { PokemonBasic } from '~/types/pokemon'
import { TYPE_COLORS } from '~/types/pokemon'

const POKEAPI = 'https://pokeapi.co/api/v2'

/**
 * Lightweight composable: fetches only list data (name, image, types).
 * Detail fetching is delegated to the Heavy remote component.
 */
export function usePokedex() {
    const pokemons = ref<PokemonBasic[]>([])
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedPokemonId = ref<number | null>(null)
    const page = ref(0)
    const hasMore = ref(true)
    const PAGE_SIZE = 24

    const filteredPokemons = computed(() => {
        if (!searchQuery.value) return pokemons.value
        const q = searchQuery.value.toLowerCase()
        return pokemons.value.filter(p =>
            p.name.includes(q) || String(p.id).includes(q)
        )
    })

    async function loadPage() {
        if (loading.value || !hasMore.value) return
        loading.value = true

        try {
            const offset = page.value * PAGE_SIZE
            const res = await fetch(`${POKEAPI}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`)
            const data = await res.json()

            if (!data.results?.length) { hasMore.value = false; return }

            const details = await Promise.all(
                data.results.map(async (p: { name: string }) => {
                    const r = await fetch(`${POKEAPI}/pokemon/${p.name}`)
                    const d = await r.json()
                    return {
                        id: d.id,
                        name: d.name,
                        image: d.sprites.other?.['official-artwork']?.front_default ?? d.sprites.front_default,
                        types: d.types.map((t: any) => t.type.name),
                    } as PokemonBasic
                })
            )

            pokemons.value = [...pokemons.value, ...details]
            page.value++
            hasMore.value = data.next !== null
        } finally {
            loading.value = false
        }
    }

    function openDetail(id: number) {
        selectedPokemonId.value = id
    }

    function closeDetail() {
        selectedPokemonId.value = null
    }

    return {
        pokemons,
        filteredPokemons,
        loading,
        searchQuery,
        hasMore,
        selectedPokemonId,
        loadPage,
        openDetail,
        closeDetail,
    }
}
