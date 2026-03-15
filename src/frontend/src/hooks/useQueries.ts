import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Design } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllDesigns() {
  const { actor, isFetching } = useActor();
  return useQuery<Design[]>({
    queryKey: ["designs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDesigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDesign(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Design>({
    queryKey: ["design", id],
    queryFn: async () => {
      if (!actor || !id) throw new Error("No id");
      return actor.getDesign(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSaveDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      partner1Name: string;
      partner2Name: string;
      weddingDate: string;
      venue: string;
      message: string;
      rsvpDetails: string;
      templateId: string;
      designName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveDesign(
        params.partner1Name,
        params.partner2Name,
        params.weddingDate,
        params.venue,
        params.message,
        params.rsvpDetails,
        params.templateId,
        params.designName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useUpdateDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      partner1Name: string;
      partner2Name: string;
      weddingDate: string;
      venue: string;
      message: string;
      rsvpDetails: string;
      templateId: string;
      designName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateDesign(
        params.id,
        params.partner1Name,
        params.partner2Name,
        params.weddingDate,
        params.venue,
        params.message,
        params.rsvpDetails,
        params.templateId,
        params.designName,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
      queryClient.invalidateQueries({ queryKey: ["design", variables.id] });
    },
  });
}

export function useDeleteDesign() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteDesign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}
