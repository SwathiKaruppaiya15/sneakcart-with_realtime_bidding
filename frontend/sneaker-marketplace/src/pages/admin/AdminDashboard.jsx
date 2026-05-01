import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import OrdersList from './OrdersList'
import ProductStockManager from './ProductStockManager'
import IncomeDashboard from './IncomeDashboard'
import './Admin.css'

const TABS = ['Orders', 'Stock', 'Analytics']

function AdminDashboard() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('Orders')

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-sub">Logged in as <strong>{currentUser?.name}</strong> · ADMIN</p>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Orders'    && '📦 '}
            {tab === 'Stock'     && '🏷️ '}
            {tab === 'Analytics' && '📊 '}
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'Orders'    && <OrdersList />}
        {activeTab === 'Stock'     && <ProductStockManager />}
        {activeTab === 'Analytics' && <IncomeDashboard />}
      </div>
    </div>
  )
}

export default AdminDashboard
