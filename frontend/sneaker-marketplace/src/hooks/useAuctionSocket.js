import { useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = 'http://localhost:8084/ws'
const RECONNECT_DELAY = 3000

/**
 * useAuctionSocket(auctionId)
 * Connects to the bidding-service WebSocket and subscribes to
 * /topic/auction/:auctionId for real-time bid updates.
 *
 * Returns { latestBid, connected, reconnecting }
 */
export function useAuctionSocket(auctionId) {
  const [latestBid,    setLatestBid]    = useState(null)
  const [connected,    setConnected]    = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const clientRef = useRef(null)

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: RECONNECT_DELAY,

      onConnect: () => {
        setConnected(true)
        setReconnecting(false)

        client.subscribe(`/topic/auction/${auctionId}`, (msg) => {
          try {
            const bid = JSON.parse(msg.body)
            setLatestBid(bid)
          } catch (e) {
            console.error('WS parse error', e)
          }
        })
      },

      onDisconnect: () => {
        setConnected(false)
        setReconnecting(true)
      },

      onStompError: (frame) => {
        console.error('STOMP error', frame)
        setConnected(false)
        setReconnecting(true)
      },
    })

    client.activate()
    clientRef.current = client
  }, [auctionId])

  useEffect(() => {
    connect()
    return () => {
      clientRef.current?.deactivate()
    }
  }, [connect])

  return { latestBid, connected, reconnecting }
}
