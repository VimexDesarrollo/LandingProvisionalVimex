function addDays(base: Date, days: number): string {
  const date = new Date(base)
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function slugToSeed(slug: string): number {
  return slug.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

export function getBlockedDatesMock(slug: string): string[] {
  const seed = slugToSeed(slug)
  const today = new Date()
  const blocked: string[] = []

  // Block 1: ~8–14 days from now (4 days)
  const offset1 = (seed % 6) + 8
  for (let i = 0; i < 4; i++) blocked.push(addDays(today, offset1 + i))

  // Block 2: ~22–30 days from now (5 days)
  const offset2 = (seed % 8) + 22
  for (let i = 0; i < 5; i++) blocked.push(addDays(today, offset2 + i))

  // Block 3: ~40–50 days from now (3 days)
  const offset3 = (seed % 7) + 40
  for (let i = 0; i < 3; i++) blocked.push(addDays(today, offset3 + i))

  return blocked
}
