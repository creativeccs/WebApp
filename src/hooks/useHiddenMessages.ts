import { useLocalStorage } from '@/hooks/useLocalStorage';

/**
 * Hook to manage hidden messages (stored locally).
 * This allows admins to hide failed/unwanted messages from the view
 * without attempting to delete them from relays.
 */
export function useHiddenMessages() {
  const [hiddenIds, setHiddenIds] = useLocalStorage<string[]>('hidden-messages', []);

  const hideMessage = (messageId: string) => {
    setHiddenIds((prev) => [...prev, messageId]);
  };

  const unhideMessage = (messageId: string) => {
    setHiddenIds((prev) => prev.filter((id) => id !== messageId));
  };

  const isHidden = (messageId: string) => {
    return hiddenIds.includes(messageId);
  };

  const clearAll = () => {
    setHiddenIds([]);
  };

  return {
    hiddenIds,
    hideMessage,
    unhideMessage,
    isHidden,
    clearAll,
  };
}
