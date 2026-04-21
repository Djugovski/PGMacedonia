<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RevealOnView from '@/components/common/RevealOnView.vue'

const { t, tm } = useI18n()

interface Pilot {
  name: string
  role: string
  since: string
  bio: string
  avatar: string
}

const pilots = tm('team.pilots') as unknown as Pilot[]
</script>

<template>
  <section class="home-team py-12 py-md-16">
    <v-container>
      <RevealOnView>
        <h2
          class="text-h4 font-weight-bold text-center mb-2 pg-reveal-item"
          style="--reveal-delay: 0ms"
        >
          {{ t('team.title') }}
        </h2>
        <p
          class="text-body-1 text-medium-emphasis text-center mb-10 mx-auto pg-reveal-item"
          style="max-width: 38rem; --reveal-delay: 70ms"
        >
          {{ t('team.lead') }}
        </p>

        <div class="home-team__grid">
          <div
            v-for="(pilot, i) in pilots"
            :key="i"
            class="home-team__card pg-reveal-item pg-surface-lift"
            :style="{ '--reveal-delay': `${120 + i * 80}ms` }"
          >
            <div class="home-team__avatar-wrap">
              <v-avatar size="96" color="primary" class="home-team__avatar">
                <v-icon v-if="!pilot.avatar" size="48" color="white">mdi-account</v-icon>
                <v-img v-else :src="pilot.avatar" :alt="pilot.name" cover />
              </v-avatar>
              <span class="home-team__since text-caption">
                {{ t('team.since', { year: pilot.since }) }}
              </span>
            </div>
            <h3 class="text-subtitle-1 font-weight-bold mt-3 mb-1">{{ pilot.name }}</h3>
            <p class="text-caption text-primary font-weight-medium mb-2 home-team__role">
              {{ pilot.role }}
            </p>
            <p class="text-body-2 text-medium-emphasis home-team__bio">{{ pilot.bio }}</p>
          </div>
        </div>
      </RevealOnView>
    </v-container>
  </section>
</template>

<style scoped>
.home-team {
  background:
    linear-gradient(
      180deg,
      rgb(var(--v-theme-surface)) 0%,
      rgb(var(--v-theme-background)) 100%
    );
}

.home-team__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 28px 24px;
  max-width: 1120px;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .home-team__grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 880px;
  }
}

.home-team__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 16px 24px;
  border-radius: 16px;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
}

.home-team__avatar-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-team__avatar {
  border: 3px solid rgb(var(--v-theme-primary));
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.18);
}

.home-team__since {
  margin-top: 6px;
  opacity: 0.6;
  letter-spacing: 0.04em;
}

.home-team__role {
  line-height: 1.35;
}

.home-team__bio {
  line-height: 1.55;
  flex: 1;
}
</style>
