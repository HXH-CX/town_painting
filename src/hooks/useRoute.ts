import { useSyncExternalStore } from 'react'
import { getRoute, subscribeRoute } from '../router'

export function useRoute() {
  return useSyncExternalStore(subscribeRoute, getRoute)
}