import { useI18n } from 'vue-i18n'
import { MK_SUFFIX } from '@/i18n/route-utils'

/** Route name for the active UI language (en base name, e.g. `guiding` → `guiding__mk` in MK). */
export function useLocalizedNames() {
  const { locale } = useI18n()

  function ln(base: string) {
    return locale.value === 'mk' ? `${base}${MK_SUFFIX}` : base
  }

  return { ln }
}
