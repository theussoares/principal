<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue'
import { TYPE_COLORS } from '~/types/pokemon'
import { usePokedex } from '~/composables/usePokedex'

const BaseCard = defineAsyncComponent(() => import('design_system/BaseCard'))
const BaseBadge = defineAsyncComponent(() => import('design_system/BaseBadge'))
const BaseSpinner = defineAsyncComponent(() => import('design_system/BaseSpinner'))

const PokemonDetailCard = defineAsyncComponent(() => import('havy/PokemonDetailCard'))

const {
  filteredPokemons,
  loading,
  searchQuery,
  hasMore,
  selectedPokemonId,
  loadPage,
  openDetail,
  closeDetail,
} = usePokedex()

onMounted(() => loadPage())
</script>

<template>
  <div class="pokedex-page">
    <!-- Header -->
    <header class="pokedex-header">
      <div class="pokedex-header__content">
        <div class="pokedex-header__title-row">
          <div>
            <h1 class="pokedex-header__title">Pokédex</h1>
            <p class="pokedex-header__subtitle">
              {{ filteredPokemons.length }} Pokémon • Powered by Micro-Frontends
            </p>
          </div>
          <!-- <div class="pokedex-header__badges">
            <span class="badge badge--ds">🎨 Design System :5001</span>
            <span class="badge badge--heavy">🏋 Heavy :5002</span>
          </div> -->
        </div>

        <!-- Search -->
        <div class="pokedex-search">
          <span class="pokedex-search__icon">🔍</span>
          <input
            v-model="searchQuery"
            class="pokedex-search__input"
            placeholder="Search Pokémon by name or ID..."
          />
        </div>
      </div>
    </header>

    <!-- Grid -->
    <section class="pokedex-grid">
      <ClientOnly>
        <div class="pokedex-grid__items">
          <BaseCard
            v-for="pokemon in filteredPokemons"
            :key="pokemon.id"
            hoverable
            class="pokemon-card-wrapper"
            @click="openDetail(pokemon.id)"
          >
            <div
              class="pokemon-mini"
              :style="{ '--type-color': TYPE_COLORS[pokemon.types[0] ?? ''] ?? '#A8A878' }"
            >
              <div class="pokemon-mini__glow" />
              <span class="pokemon-mini__id">#{{ String(pokemon.id).padStart(3, '0') }}</span>
              <div class="pokemon-mini__img-wrap">
                <img
                  :src="pokemon.image"
                  :alt="pokemon.name"
                  class="pokemon-mini__img"
                  loading="lazy"
                />
              </div>
              <h3 class="pokemon-mini__name">{{ pokemon.name }}</h3>
              <div class="pokemon-mini__types">
                <BaseBadge
                  v-for="t in pokemon.types"
                  :key="t"
                  :label="t"
                  :color="TYPE_COLORS[t]"
                />
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="pokedex-loading">
          <BaseSpinner size="lg" />
          <span>Catching Pokémon...</span>
        </div>

        <!-- Load More -->
        <div v-if="!loading && hasMore" class="pokedex-more">
          <button class="pokedex-more__btn" @click="loadPage">
            Load More Pokémon ↓
          </button>
        </div>

        <template #fallback>
          <div class="pokedex-loading">
            <div class="fallback-spinner" />
            <span>Connecting to Design System remote...</span>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- Detail Card (HEAVY REMOTE) -->
    <ClientOnly v-if="selectedPokemonId">
      <PokemonDetailCard
        :pokemon-id="selectedPokemonId"
        @close="closeDetail"
      />
    </ClientOnly>
  </div>
</template>

<style scoped>
.pokedex-page {
  min-height: 100vh;
}

/* ═══ Header ═══ */
.pokedex-header {
  background: rgba(15, 23, 42, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding: 2rem 0 1.5rem;
}

.pokedex-header__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.pokedex-header__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pokedex-header__title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #f1f5f9, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pokedex-header__subtitle {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0.3rem 0 0;
}

.pokedex-header__badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid;
}

.badge--ds {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.25);
  color: #86efac;
}

.badge--heavy {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

/* ═══ Search ═══ */
.pokedex-search {
  position: relative;
  max-width: 480px;
}

.pokedex-search__icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
}

.pokedex-search__input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  font-size: 0.88rem;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.pokedex-search__input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.pokedex-search__input::placeholder { color: #475569; }

/* ═══ Grid ═══ */
.pokedex-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.pokedex-grid__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.pokemon-card-wrapper {
  cursor: pointer;
  animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.pokemon-card-wrapper:nth-child(1)  { animation-delay: 0.02s; }
.pokemon-card-wrapper:nth-child(2)  { animation-delay: 0.04s; }
.pokemon-card-wrapper:nth-child(3)  { animation-delay: 0.06s; }
.pokemon-card-wrapper:nth-child(4)  { animation-delay: 0.08s; }
.pokemon-card-wrapper:nth-child(5)  { animation-delay: 0.10s; }
.pokemon-card-wrapper:nth-child(6)  { animation-delay: 0.12s; }
.pokemon-card-wrapper:nth-child(7)  { animation-delay: 0.14s; }
.pokemon-card-wrapper:nth-child(8)  { animation-delay: 0.16s; }
.pokemon-card-wrapper:nth-child(9)  { animation-delay: 0.18s; }
.pokemon-card-wrapper:nth-child(10) { animation-delay: 0.20s; }
.pokemon-card-wrapper:nth-child(11) { animation-delay: 0.22s; }
.pokemon-card-wrapper:nth-child(12) { animation-delay: 0.24s; }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
}

/* ═══ Pokemon Mini Card ═══ */
.pokemon-mini {
  position: relative;
  text-align: center;
  overflow: hidden;
}

.pokemon-mini__glow {
  position: absolute;
  top: -40%;
  left: -40%;
  width: 180%;
  height: 180%;
  background: radial-gradient(circle at 50% 80%, var(--type-color) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.pokemon-card-wrapper:hover .pokemon-mini__glow {
  opacity: 0.08;
}

.pokemon-mini__id {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.1);
  font-family: 'JetBrains Mono', monospace;
}

.pokemon-mini__img-wrap {
  width: 90px;
  height: 90px;
  margin: 0 auto 0.5rem;
  transition: transform 0.3s ease;
}

.pokemon-card-wrapper:hover .pokemon-mini__img-wrap {
  transform: scale(1.08) translateY(-4px);
}

.pokemon-mini__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
}

.pokemon-card-wrapper:hover .pokemon-mini__img {
  filter: drop-shadow(0 6px 16px color-mix(in srgb, var(--type-color) 35%, transparent));
}

.pokemon-mini__name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #e2e8f0;
  text-transform: capitalize;
  margin: 0 0 0.4rem;
}

.pokemon-mini__types {
  display: flex;
  justify-content: center;
  gap: 0.3rem;
}

/* ═══ Loading ═══ */
.pokedex-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #64748b;
  font-size: 0.85rem;
}

.fallback-spinner {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 3px solid rgba(99, 102, 241, 0.15);
  border-top-color: #6366f1;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ═══ Load More ═══ */
.pokedex-more {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.pokedex-more__btn {
  padding: 0.7rem 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #c7d2fe;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 0.75rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.pokedex-more__btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-1px);
}
</style>
