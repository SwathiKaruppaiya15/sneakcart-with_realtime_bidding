import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { auctionShoes, products } from '../services/productService'
import { getImage } from '../utils/getImage'
import './Auction.css'

const INR = (n) => `₹${n.toLocaleString('en-IN')}`

function useCountdown(endsAt) {
  const calc = () => {
    const diff = Math.max(0, endsAt - Date.now())
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      done: diff === 0,
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [endsAt])
  return time
}

function Auction() {
  const { id } = useParams()
  const base = auctionShoes.find(s => s.id === id)

  const [shoe, setShoe] = useState(base ? { ...base, leaderboard: [...base.leaderboard] } : null)
  const [bidInput, setBidInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bidderName, setBidderName] = useState('You')

  const { h, m, s, done } = useCountdown(shoe?.endsAt || Date.now())
  const pad = (n) => String(n).padStart(2, '0')
  const urgent = shoe && h === 0 && m < 10

  if (!shoe) {
    return (
      <div className="auction-not-found">
        <h2>Auction not found</h2>
        <Link to="/trends">← Back to Auctions</Link>
      </div>
    )
  }

  const handleBid = (e) => {
    e.preventDefault()
    const amount = Number(bidInput)
    setError('')
    setSuccess('')

    if (!amount || isNaN(amount)) { setError('Enter a valid amount.'); return }
    if (amount <= shoe.currentBid) {
      setError(`Bid must be higher than current bid of ${INR(shoe.currentBid)}.`)
      return
    }

    const newLeaderboard = [
      { name: bidderName || 'You', bid: amount },
      ...shoe.leaderboard,
    ]
      .sort((a, b) => b.bid - a.bid)
      .slice(0, 3)

    setShoe(prev => ({ ...prev, currentBid: amount, leaderboard: newLeaderboard }))
    setSuccess(`🎉 Bid of ${INR(amount)} placed successfully!`)
    setBidInput('')
  }

  const recommended = products.slice(0, 4)

  return (
    <div className="auction-page">
      <Link to="/trends" className="back-link">← Back to Auctions</Link>

      <div className="auction-layout">

        {/* Left — shoe details */}
        <div className="auction-detail">
          <div className="auction-img-box">
            <img src={getImage(shoe.image)} alt={shoe.name} />
            {!done && <span className="live-pill">🔴 LIVE AUCTION</span>}
          </div>
          <div className="auction-meta">
            <p className="a-brand">{shoe.brand}</p>
            <h1 className="a-name">{shoe.name}</h1>
            <div className="a-tags">
              <span className="tag">Color: {shoe.color}</span>
              <span className="tag">Sizes: {shoe.sizes.join(', ')}</span>
            </div>
            <p className="a-base">Base Price: <strong>{INR(shoe.basePrice)}</strong></p>
          </div>
        </div>

        {/* Right — bidding panel */}
        <div className="auction-panel">

          {/* Timer */}
          <div className={`timer-box ${urgent ? 'timer-box-urgent' : ''}`}>
            <p className="timer-label">{done ? 'Auction Ended' : 'Time Remaining'}</p>
            {!done && (
              <div className="timer-digits">
                <div className="digit-block"><span>{pad(h)}</span><p>HRS</p></div>
                <span className="colon">:</span>
                <div className="digit-block"><span>{pad(m)}</span><p>MIN</p></div>
                <span className="colon">:</span>
                <div className="digit-block"><span>{pad(s)}</span><p>SEC</p></div>
              </div>
            )}
          </div>

          {/* Current bid */}
          <div className="current-bid-box">
            <p className="cb-label">Current Highest Bid</p>
            <p className="cb-amount">{INR(shoe.currentBid)}</p>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h3>🏆 Top Bidders</h3>
            {shoe.leaderboard.map((b, i) => (
              <div key={i} className={`lb-row rank-${i + 1}`}>
                <span className="lb-rank">#{i + 1}</span>
                <span className="lb-name">{b.name}</span>
                <span className="lb-bid">{INR(b.bid)}</span>
              </div>
            ))}
          </div>

          {/* Bid form */}
          {!done && (
            <form className="bid-form" onSubmit={handleBid}>
              <h3>Place Your Bid</h3>
              <div className="bid-input-row">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={bidderName}
                  onChange={e => setBidderName(e.target.value)}
                  className="bid-name-input"
                />
              </div>
              <div className="bid-input-row">
                <span className="rupee-prefix">₹</span>
                <input
                  type="number"
                  placeholder={`Min. ${shoe.currentBid + 1}`}
                  value={bidInput}
                  onChange={e => setBidInput(e.target.value)}
                  className="bid-amount-input"
                  min={shoe.currentBid + 1}
                />
              </div>
              {error   && <p className="bid-error">{error}</p>}
              {success && <p className="bid-success">{success}</p>}
              <button type="submit" className="btn-place-bid">Place Bid</button>
            </form>
          )}
        </div>
      </div>

      {/* Recommended */}
      <section className="auction-recommended">
        <h2>You Might Also Like</h2>
        <div className="rec-grid">
          {recommended.map(p => (
            <div key={p.id} className="rec-card">
              <img src={getImage(p.image)} alt={p.name} />
              <p className="rec-brand">{p.brand}</p>
              <p className="rec-name">{p.name}</p>
              <p className="rec-price">{INR(p.price)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Auction
