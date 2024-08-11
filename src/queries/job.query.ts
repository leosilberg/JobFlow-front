import { JobService } from "@/services/job.service.ts";
import { IJob } from "@/types/job.types.ts";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export function useGetFilteredJobs(filter: string) {
  const select = useCallback(
    (data: IJob[]) =>
      data.filter((job) =>
        job.title.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter]
  );
  return useGetJobs(select);
}

export function useGetJobs<T>(select: (data: IJob[]) => T) {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: ({ signal }) => JobService.getJobs(signal),
    select,
  });
}

export function useGetJob(jobId: string) {
  return useQuery({
    queryKey: ["job", { jobId }],
    queryFn: ({ signal }) => JobService.getJob(jobId, signal),
  });
}
