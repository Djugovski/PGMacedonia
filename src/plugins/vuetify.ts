import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VBtn: { class: 'pg-touch-target' },
  },
  theme: {
    defaultTheme: 'pgTheme',
    themes: {
      pgTheme: {
        dark: false,
        colors: {
          /* Open sky — altitude, clarity, trust */
          primary: '#0369a1',
          /* Deep horizon / twilight — headers, contrast, mountain-sky depth */
          secondary: '#0c4a6e',
          /* Golden-hour warmth — energy & CTAs (complements cool sky) */
          accent: '#ea580c',
          /* Airy cool wash (sky mist), not flat gray */
          surface: '#f0f9ff',
          background: '#ffffff',
        },
      },
    },
  },
})
