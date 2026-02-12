import { ref, computed } from 'vue'
import type { PokemonBasic } from '~/types/pokemon'

const POKEAPI = 'https://pokeapi.co/api/v2'

// In-memory cache to avoid re-fetching when navigating back
const cachedPokemons = ref<PokemonBasic[]>([])
const cachedPage = ref(0)
const cachedHasMore = ref(true)

/**
 * Lightweight composable: fetches only list data (name, image, types).
 * Detail fetching is delegated to the Heavy remote component.
 *
 * Optimizations:
 * - Uses sprites (front_default ~5KB) instead of official-artwork (~100KB)
 * - Reduced initial batch from 24 to 12 for faster first paint
 * - In-memory cache prevents refetch on navigation
 */
export function usePokedex() {
    const pokemons = cachedPokemons
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedPokemonId = ref<number | null>(null)
    const page = cachedPage
    const hasMore = cachedHasMore
    const PAGE_SIZE = 12

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
                        // Use sprite (~5KB) for grid cards instead of official-artwork (~100KB)
                        image: d.sprites.front_default,
                        // Keep official-artwork URL for detail card preloading
                        artworkImage: d.sprites.other?.['official-artwork']?.front_default ?? d.sprites.front_default,
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
