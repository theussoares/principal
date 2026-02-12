<script setup lang="ts">
import { defineAsyncComponent, onMounted } from "vue";
import { TYPE_COLORS } from "~/types/pokemon";
import { usePokedex } from "~/composables/usePokedex";

const BaseCard = defineAsyncComponent(() => import("design_system/BaseCard"));
const BaseBadge = defineAsyncComponent(() => import("design_system/BaseBadge"));
const BaseSpinner = defineAsyncComponent(
  () => import("design_system/BaseSpinner"),
);

const PokemonDetailCard = defineAsyncComponent(
  () => import("havy/PokemonDetailCard"),
);

const {
  filteredPokemons,
  loading,
  searchQuery,
  hasMore,
  selectedPokemonId,
  loadPage,
  openDetail,
  closeDetail,
} = usePokedex();

onMounted(() => loadPage());
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
            v-for="(pokemon, idx) in filteredPokemons"
            :key="pokemon.id"
            hoverable
            class="pokemon-card-wrapper"
            @click="openDetail(pokemon.id)"
          >
            <div
              class="pokemon-mini"
              :style="{
                '--type-color':
                  TYPE_COLORS[pokemon.types[0] ?? ''] ?? '#A8A878',
              }"
            >
              <div class="pokemon-mini__glow" />
              <span class="pokemon-mini__id"
                >#{{ String(pokemon.id).padStart(3, "0") }}</span
              >
              <div class="pokemon-mini__img-wrap">
                <img
                  :src="pokemon.image"
                  :alt="pokemon.name"
                  class="pokemon-mini__img"
                  width="96"
                  height="96"
                  decoding="async"
                  :loading="idx < 4 ? 'eager' : 'lazy'"
                  :fetchpriority="idx === 0 ? 'high' : undefined"
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

        <!--
          Loading & Load More share a FIXED-HEIGHT container
          to prevent CLS when toggling between states.
        -->
        <div class="pokedex-actions">
          <div v-if="loading" class="pokedex-loading">
            <BaseSpinner size="lg" />
            <span>Catching Pokémon...</span>
          </div>
          <div v-else-if="hasMore" class="pokedex-more">
            <button class="pokedex-more__btn" @click="loadPage">
              Load More Pokémon ↓
            </button>
          </div>
        </div>

        <template #fallback>
          <!--
            Skeleton placeholder with EXACT same height as the real grid
            to prevent CLS when ClientOnly resolves.
            12 cards × ~180px height in a ~5-col grid ≈ 3 rows × 200px
          -->
          <div class="pokedex-skeleton">
            <div class="pokedex-skeleton__grid">
              <div v-for="i in 12" :key="i" class="pokedex-skeleton__card" />
            </div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- Detail Card (HEAVY REMOTE) -->
    <ClientOnly v-if="selectedPokemonId">
      <PokemonDetailCard :pokemon-id="selectedPokemonId" @close="closeDetail" />
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

.pokedex-search__input::placeholder {
  color: #475569;
}

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
  /* No animation — animations cause CLS */
}

/* ═══ Pokemon Mini Card ═══ */
.pokemon-mini {
  position: relative;
  text-align: center;
  overflow: hidden;
  /* Fixed min-height prevents CLS from content loading */
  min-height: 170px;
}

.pokemon-mini__glow {
  position: absolute;
  top: -40%;
  left: -40%;
  width: 180%;
  height: 180%;
  background: radial-gradient(
    circle at 50% 80%,
    var(--type-color) 0%,
    transparent 55%
  );
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
  font-family: "JetBrains Mono", monospace;
}

.pokemon-mini__img-wrap {
  width: 96px;
  height: 96px;
  aspect-ratio: 1;
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
  image-rendering: pixelated;
}

.pokemon-card-wrapper:hover .pokemon-mini__img {
  filter: drop-shadow(
    0 6px 16px color-mix(in srgb, var(--type-color) 35%, transparent)
  );
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
  min-height: 24px; /* Reserve space for badges to prevent CLS */
}

/* ═══ Actions container (fixed height prevents CLS) ═══ */
.pokedex-actions {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ═══ Loading ═══ */
.pokedex-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══ Load More ═══ */
.pokedex-more {
  display: flex;
  justify-content: center;
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

/* ═══ Skeleton Placeholder (prevents CLS from ClientOnly) ═══ */
.pokedex-skeleton {
  padding: 0;
}

.pokedex-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.pokedex-skeleton__card {
  height: 200px;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
