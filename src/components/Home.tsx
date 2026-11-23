import { TOWNS } from '../data/towns'
import TownCard from './TownCard'
import '../styles/home.css'

export default function Home() {
  return (
    <main className="home">
      <header className="home__hero">
        <h1>镇在画中</h1>
        <p className="home__tagline">三座小镇,三种笔触</p>
      </header>
      <div className="home__cards">
        {TOWNS.map((t) => (
          <TownCard key={t.slug} town={t} />
        ))}
      </div>
      <p className="home__foot">点一座镇,走进去。</p>
      <p className="home__credit">画面由 AI 生成 · 环境音为程序化合成</p>
    </main>
  )
}