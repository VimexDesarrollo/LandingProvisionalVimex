import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// @testing-library/react auto-cleanup checks `typeof afterEach === 'function'`.
// With vitest globals disabled, afterEach is not in the global scope, so
// auto-cleanup never runs and rendered components accumulate across tests.
// This explicit registration fixes that.
afterEach(cleanup)
