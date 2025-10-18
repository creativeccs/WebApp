import React, { useEffect, useRef } from 'react';
import { NostrEvent, NPool, NRelay1 } from '@nostrify/nostrify';
import { NostrContext } from '@nostrify/react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@/hooks/useAppContext';

interface NostrProviderProps {
  children: React.ReactNode;
}

const NostrProvider: React.FC<NostrProviderProps> = (props) => {
  const { children } = props;
  const { config, presetRelays } = useAppContext();

  const queryClient = useQueryClient();

  // Create NPool instance only once
  const pool = useRef<NPool | undefined>(undefined);

  // Use refs so the pool always has the latest data
  const relayUrl = useRef<string>(config.relayUrl);

  // Update refs when config changes
  useEffect(() => {
    relayUrl.current = config.relayUrl;
    queryClient.resetQueries();
  }, [config.relayUrl, queryClient]);

  // Initialize NPool only once
  if (!pool.current) {
    pool.current = new NPool({
      open(url: string) {
        return new NRelay1(url);
      },
      reqRouter(filters) {
        // Use all available relays for reading to ensure better content discovery
        const readRelays = new Map();
        const allRelayUrls = [
          relayUrl.current,
          ...(presetRelays ?? []).map(relay => relay.url)
        ];

        // Distribute queries across all relays for better decentralization
        for (const relayUrl of allRelayUrls) {
          readRelays.set(relayUrl, filters);
        }

        return readRelays;
      },
      eventRouter(_event: NostrEvent) {
        // Publish to ALL relays for maximum distribution and reliability
        const allRelays = new Set<string>();

        // Always include the current selected relay
        allRelays.add(relayUrl.current);

        // Add all preset relays for comprehensive coverage
        for (const { url } of (presetRelays ?? [])) {
          allRelays.add(url);
        }

        return [...allRelays];
      },
    });
  }

  return (
    <NostrContext.Provider value={{ nostr: pool.current }}>
      {children}
    </NostrContext.Provider>
  );
};

export default NostrProvider;