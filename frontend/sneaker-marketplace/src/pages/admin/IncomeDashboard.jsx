import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiAdminAnalytics } from '../../services/api'

const INR = n => `₹${Number(n).toLocaleString('en-IN')}`

const FILTERS = ['Daily', 'Weekly', 'Monthly', 'Yearly']

function IncomeDashboard() {
  const { currentUser } = useAuth()
  const [analytics,      setAnalytics]      = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [activeFilter,   setActiveFilter]   = useState('Monthly')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiAdminAnalytics(currentUser.id)
      setAnalytics(data)
    } catch {
      // Show dummy analytics when backend not connected
      setAnalytics({
        totalIncome:   0,
        dailyIncome:   0,
        weeklyIncome:  0,
        monthlyIncome: 0,
        yearlyIncome:  0,
        highestMonth:  'N/A',
        highestIncome: 0,
      })
      setError('Using local data — backend not connected.')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredIncome = () => {
    if (!analytics) return 0
    switch (activeFilter) {
      case 'Daily':   return analytics.dailyIncome
      case 'Weekly':  return analytics.weeklyIncome
      case 'Monthly': return analytics.monthlyIncome
      case 'Yearly':  return analytics.yearlyIncome
      default:        return analytics.monthlyIncome
    }
  }

  if (loading) return <div className="admin-loading">Loading analytics...</div>

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Income Analytics</h2>
        <button className="btn-refresh" onClick={fetchAnalytics}>↻ Refresh</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {/* Total income hero card */}
      <div className="analytics-hero">
        <div className="analytics-hero-label">Total Income (All Time)</div>
        <div className="analytics-hero-value">{INR(analytics?.totalIncome || 0)}</div>
      </div>

      {/* Filter buttons */}
      <div className="analytics-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`analytics-filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Filtered income */}
      <div className="analytics-filtered-card">
        <p className="filtered-label">{activeFilter} Income</p>
        <p className="filtered-value">{INR(getFilteredIncome())}</p>
      </div>

      {/* Income breakdown cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <p className="ac-label">Today</p>
          <p className="ac-value">{INR(analytics?.dailyIncome || 0)}</p>
        </div>
        <div className="analytics-card">
          <p className="ac-label">This Week</p>
          <p className="ac-value">{INR(analytics?.weeklyIncome || 0)}</p>
        </div>
        <div className="analytics-card">
          <p className="ac-label">This Month</p>
          <p className="ac-value">{INR(analytics?.monthlyIncome || 0)}</p>
        </div>
        <div className="analytics-card">
          <p className="ac-label">This Year</p>
          <p className="ac-value">{INR(analytics?.yearlyIncome || 0)}</p>
        </div>
      </div>

      {/* Highest income month */}
      <div className="highest-month-card">
        <div className="hm-icon">🏆</div>
        <div>
          <p className="hm-label">Highest Income Month</p>
          <p className="hm-month">{analytics?.highestMonth || 'N/A'}</p>
        </div>
        <div className="hm-amount">{INR(analytics?.highestIncome || 0)}</div>
      </div>
    </div>
  )
}

export default IncomeDashboard
