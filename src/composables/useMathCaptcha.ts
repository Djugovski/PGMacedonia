import { ref } from 'vue'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function useMathCaptcha() {
  const a = ref(0)
  const b = ref(0)

  function refresh() {
    a.value = randomInt(1, 9)
    b.value = randomInt(1, 9)
  }

  refresh()

  const question = () => `${a.value} + ${b.value} = ?`
  const expected = () => a.value + b.value

  return { refresh, question, expected }
}
