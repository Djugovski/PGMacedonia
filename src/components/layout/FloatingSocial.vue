<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'

const { t } = useI18n()
const open = ref(false)

function toggle() {
  open.value = !open.value
}
</script>

<template>
  <div class="chaty-cta-button" :class="{ 'chaty-cta-button--open': open }">
    <Transition name="chaty-items">
      <ul v-show="open" class="chaty-cta-button__list" role="menu">
        <li>
          <a
            :href="siteConfig.whatsappUrl"
            target="_blank"
            rel="noopener"
            class="chaty-cta-button__item chaty-cta-button__item--whatsapp"
            :aria-label="'WhatsApp'"
          >
            <v-icon size="22">mdi-whatsapp</v-icon>
          </a>
        </li>
        <li>
          <a
            :href="`mailto:${siteConfig.email}`"
            class="chaty-cta-button__item chaty-cta-button__item--email"
            :aria-label="t('footer.contact')"
          >
            <v-icon size="22">mdi-email</v-icon>
          </a>
        </li>
        <li>
          <a
            :href="`tel:${siteConfig.phoneTel}`"
            class="chaty-cta-button__item chaty-cta-button__item--phone"
            :aria-label="siteConfig.phone"
          >
            <v-icon size="22">mdi-phone</v-icon>
          </a>
        </li>
        <li>
          <a
            :href="siteConfig.facebookUrl"
            target="_blank"
            rel="noopener"
            class="chaty-cta-button__item chaty-cta-button__item--facebook"
            aria-label="Facebook"
          >
            <v-icon size="22">mdi-facebook</v-icon>
          </a>
        </li>
      </ul>
    </Transition>
    <button
      type="button"
      class="chaty-cta-button__toggle"
      :aria-expanded="open"
      :aria-label="open ? 'Close contact menu' : 'Open contact menu'"
      @click="toggle"
    >
      <v-icon v-if="!open" size="26">mdi-chat</v-icon>
      <v-icon v-else size="26">mdi-close</v-icon>
    </button>
  </div>
</template>

<style scoped>
.chaty-cta-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.chaty-cta-button__toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  color: #fff;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 6px 18px rgba(12, 74, 110, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.chaty-cta-button__toggle:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 10px 24px rgba(12, 74, 110, 0.45);
}

.chaty-cta-button--open .chaty-cta-button__toggle {
  background: rgb(var(--v-theme-secondary));
}

.chaty-cta-button__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chaty-cta-button__item {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}
.chaty-cta-button__item:hover {
  transform: scale(1.08);
  filter: brightness(1.05);
}

.chaty-cta-button__item--whatsapp { background: #25d366; }
.chaty-cta-button__item--email    { background: #ea4335; }
.chaty-cta-button__item--phone    { background: #0a84ff; }
.chaty-cta-button__item--facebook { background: #1877f2; }

.chaty-items-enter-active,
.chaty-items-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}
.chaty-items-enter-from,
.chaty-items-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.9);
}

@media (max-width: 600px) {
  .chaty-cta-button {
    right: 14px;
    bottom: 14px;
  }
}
</style>
