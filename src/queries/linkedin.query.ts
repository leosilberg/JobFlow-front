import api from "@/lib/api";
import { IJob } from "@/types/job.types";
import { useQuery } from "@tanstack/react-query";

export function useGetLinkedinJobDetails(jobId: string) {
  return useQuery({
    queryKey: ["linkedin", "job", { jobId }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<Partial<IJob>>(`linkedin/job/${jobId}`, {
        signal,
      });
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
