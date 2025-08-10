'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { parseEventLogs } from 'viem';
import { contractABI } from '@/contract/abi';
import { CONTRACT_ADDRESS } from '@/contract/types';

interface EventData {
  txHash: string;
  logIndex: number;
  blockNumber: bigint;
  eventName: string;
  args: any;
  timestamp?: number;
}

interface UseContractEventsReturn {
  events: EventData[];
  isConnected: boolean;
  isPolling: boolean;
  resync: () => void;
}

export function useContractEvents(): UseContractEventsReturn {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<EventData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastBlockRef = useRef<bigint>(0n);
  const seenEventsRef = useRef<Set<string>>(new Set());

  const processEvents = useCallback((logs: any[]) => {
    const parsedEvents = parseEventLogs({
      abi: contractABI,
      logs,
    });

    const newEvents: EventData[] = [];
    
    for (const event of parsedEvents) {
      const eventId = `${event.transactionHash}-${event.logIndex}`;
      
      if (!seenEventsRef.current.has(eventId)) {
        seenEventsRef.current.add(eventId);
        newEvents.push({
          txHash: event.transactionHash,
          logIndex: event.logIndex,
          blockNumber: event.blockNumber,
          eventName: event.eventName,
          args: event.args,
        });
      }
    }

    if (newEvents.length > 0) {
      setEvents(prev => {
        const combined = [...prev, ...newEvents];
        // Keep only the last 100 events to prevent memory issues
        return combined.slice(-100).sort((a, b) => Number(b.blockNumber - a.blockNumber));
      });
    }
  }, []);

  const pollEvents = useCallback(async () => {
    if (!publicClient) return;
    
    try {
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlock = lastBlockRef.current === 0n ? currentBlock - 1000n : lastBlockRef.current + 1n;
      
      if (fromBlock <= currentBlock) {
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          fromBlock,
          toBlock: currentBlock,
        });
        
        if (logs.length > 0) {
          processEvents(logs);
        }
        
        lastBlockRef.current = currentBlock;
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, [publicClient, processEvents]);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    
    setIsPolling(true);
    pollEvents(); // Initial poll
    pollingIntervalRef.current = setInterval(pollEvents, 10000); // Poll every 10 seconds
  }, [pollEvents]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const setupWebSocket = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_FUJI_RPC_WS;
    if (!wsUrl) {
      startPolling();
      return;
    }

    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        stopPolling();
        
        // Subscribe to logs for our contract
        wsRef.current?.send(JSON.stringify({
          id: 1,
          method: 'eth_subscribe',
          params: ['logs', { address: CONTRACT_ADDRESS }]
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.params && data.params.result) {
            processEvents([data.params.result]);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        startPolling(); // Fallback to polling
      };

      wsRef.current.onerror = () => {
        setIsConnected(false);
        startPolling(); // Fallback to polling
      };
    } catch (error) {
      console.error('WebSocket setup error:', error);
      startPolling(); // Fallback to polling
    }
  }, [startPolling, stopPolling, processEvents]);

  const resync = useCallback(() => {
    seenEventsRef.current.clear();
    setEvents([]);
    lastBlockRef.current = 0n;
    pollEvents();
  }, [pollEvents]);

  useEffect(() => {
    if (!publicClient) return;

    setupWebSocket();

    // Handle tab focus
    const handleFocus = () => {
      if (!isConnected) {
        pollEvents();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      if (wsRef.current) {
        wsRef.current.close();
      }
      stopPolling();
    };
  }, [publicClient, setupWebSocket, pollEvents, isConnected, stopPolling]);

  return {
    events,
    isConnected,
    isPolling,
    resync,
  };
}