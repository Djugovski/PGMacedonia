export const MK_SUFFIX = '__mk'

export function baseRouteName(name: unknown): string {
  if (typeof name !== 'string') return 'home'
  return name.endsWith(MK_SUFFIX) ? name.slice(0, -MK_SUFFIX.length) : name
}

export function mkRouteName(name: unknown): string {
  return `${baseRouteName(name)}${MK_SUFFIX}`
}

export function localeFromRouteName(name: unknown): 'en' | 'mk' {
  return typeof name === 'string' && name.endsWith(MK_SUFFIX) ? 'mk' : 'en'
}
