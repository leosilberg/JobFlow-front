import api from "@/lib/api";
import { LinkedInJob } from "@/pages/LinkedinJobList";
import { useQuery } from "@tanstack/react-query";

export function useGetLinkedinJobDetails(jobId: string) {
  return useQuery({
    queryKey: ["linkedin", "job", { jobId }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<LinkedInJob>(`linkedin/job/${jobId}`, {
        signal,
      });
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!jobId,
  });
}

export function useGetLinkedinJobList(
  keywords: string,
  location: string,
  date_since_posted = "week",
  start: string = "0",
  sort_by: string = "recent"
) {
  return useQuery({
    queryKey: [
      "linkedin",
      "list",
      { keywords, location, date_since_posted, sort_by, start },
    ],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<LinkedInJob[]>(`linkedin/list`, {
        params: {
          keywords,
          location,
          date_since_posted,
          sort_by,
          start,
        },
        signal,
      });
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!keywords && !!location,
  });
}
