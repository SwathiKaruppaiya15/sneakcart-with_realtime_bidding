import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auctionShoes } from '../services/productService'
import { getImage } from '../utils/getImage'
import './Trends.css'

const INR = (n) => `₹${n.toLocaleString('en-IN')}`

function useCountdown(endsAt) {
  const calc = () => {
    const diff = Math.max(0, endsAt - Date.now())
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s, done: diff === 0 }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [endsAt])
  return time
}

function AuctionCard({ shoe, rank }) {
  const navigate = useNavigate()
  const { h, m, s, done } = useCountdown(shoe.endsAt)
  const pad = (n) => String(n).padStart(2, '0')
  const urgent = h === 0 && m < 10

  return (
    <div className={`auction-card ${urgent ? 'urgent' : ''}`}>
      <div className="auction-rank">#{rank}</div>
      <div className="auction-img-wrap">
        <img src={getImage(shoe.image)} alt={shoe.name} className="auction-img" />
        <span className="auction-live-badge">🔴 LIVE</span>
      </div>
      <div className="auction-info">
        <p className="auction-brand">{shoe.brand}</p>
        <h3 className="auction-name">{shoe.name}</h3>
        <div className="auction-bid-row">
          <div>
            <p className="bid-label">Current Bid</p>
            <p className="bid-amount">{INR(shoe.currentBid)}</p>
          </div>
          <div className="auction-timer">
            <p className="bid-label">Ends In</p>
            {done ? (
              <p className="timer-ended">Ended</p>
            ) : (
              <p className={`timer-val ${urgent ? 'timer-urgent' : ''}`}>
                {pad(h)}:{pad(m)}:{pad(s)}
              </p>
            )}
          </div>
        </div>
        <button
          className="btn-bid"
          onClick={() => navigate(`/auction/${shoe.id}`)}
          disabled={done}
        >
          {done ? 'Auction Ended' : 'Place a Bid →'}
        </button>
      </div>
    </div>
  )
}

function Trends() {
  return (
    <div className="trends-page">
      <div className="trends-hero">
        <div>
          <p className="trends-sub">Limited Edition Drops</p>
          <h1>🔥 Live Auctions</h1>
          <p>Bid on the rarest sneakers before time runs out.</p>
        </div>
        <div className="trends-stats">
          <div className="stat"><span>{auctionShoes.length}</span><p>Active Auctions</p></div>
          <div className="stat"><span>3</span><p>Ending Soon</p></div>
        </div>
      </div>

      <div className="auction-grid">
        {auctionShoes.map((shoe, i) => (
          <AuctionCard key={shoe.id} shoe={shoe} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}

export default Trends
