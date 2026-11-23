import { useEffect } from 'react'
import { useRoute } from './hooks/useRoute'
import { getTown } from './data/towns'
import { navigate } from './router'
import Home from './components/Home'
import TownView from './components/TownView'
import StreetView from './components/StreetView'

export default function App() {
  const route = useRoute()
  const town = route.town ? getTown(route.town) : undefined
  const street = town && route.street ? town.streets.find((s) => s.slug === route.street) : undefined

  useEffect(() => {
    if (route.town && !town) navigate('/', true)
    else if (town && route.street && !street) navigate(`/${town.slug}`, true)
  }, [route, town, street])

  if (!town) return <Home />
  if (route.street && street) return <StreetView town={town} scene={street} style={route.style} />
  return <TownView town={town} style={route.style} />
}