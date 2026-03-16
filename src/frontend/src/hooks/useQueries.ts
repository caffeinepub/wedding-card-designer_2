import { useMutation, useQuery } from "@tanstack/react-query";
import type { Message } from "../backend.d";
import { useActor } from "./useActor";

export function useGetSession(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["session", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getSession(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

export function useGetAllSessions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllSessions();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      id,
      messages,
    }: {
      id: bigint;
      messages: Message[];
    }) => {
      if (!actor) return;
      try {
        try {
          await actor.updateSession(id, messages);
        } catch {
          await actor.saveSession(id, messages);
        }
      } catch {
        // Silent fail - local state is source of truth
      }
    },
  });
}

export function useDeleteSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) return;
      await actor.deleteSession(id);
    },
  });
}
