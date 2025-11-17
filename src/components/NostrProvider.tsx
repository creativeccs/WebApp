import React, { useMemo } from 'react';
import { NostrEvent, NPool, NRelay1, type NostrFilter } from '@nostrify/nostrify';
import { NostrContext } from '@nostrify/react';
import { useAppContext } from '@/hooks/useAppContext';

interface NostrProviderProps {
  children: React.ReactNode;
}

const NostrProvider: React.FC<NostrProviderProps> = (props) => {
  const { children } = props;
  const { presetRelays } = useAppContext();

  // Create NPool instance with current preset relays
  const pool = useMemo(() => {
    const relays = presetRelays ?? [];
    
    return new NPool({
      open(url: string) {
        return new NRelay1(url);
      },
      reqRouter(filters) {
        // Use all available preset relays for reading to ensure better content discovery
        const readRelays = new Map<string, NostrFilter[]>();
        const allRelayUrls = relays.map((r) => r.url);

        // Distribute identical filters across all relays
        for (const rUrl of allRelayUrls) {
          readRelays.set(rUrl, filters);
        }

        return readRelays;
      },
      eventRouter(event: NostrEvent) {
        // Publish to ALL preset relays for maximum distribution and reliability
        const allRelays = new Set<string>();

        for (const { url } of relays) {
          allRelays.add(url);
        }

        return [...allRelays];
      },
    });
  }, [presetRelays]);

  return (
    <NostrContext.Provider value={{ nostr: pool }}>
      {children}
    </NostrContext.Provider>
  );
};

export default NostrProvider;