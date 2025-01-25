import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useCreateAIResume() {
  return useMutation({
    mutationFn: async (description: string) => {
      const blob = await api.post(
        "openai/matcher",
        {
          description,
        },
        {
          responseType: "blob",
        }
      );
      return blob as any;
    },
  });
}
