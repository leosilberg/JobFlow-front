import { JobValues } from "@/pages/CreateJobPage.tsx";
import { JobService } from "@/services/job.service.ts";
import { IJob } from "@/types/job.types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newJob: JobValues) => JobService.createJob(newJob),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobs: IJob[]) => JobService.updateOrder(jobs),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useEditJob() {
  const queryClient = useQueryClient();
  return useMutation<
    IJob,
    Error,
    { jobId: string; changes: Partial<Omit<IJob, "_id" | "userId">> }
  >({
    mutationFn: ({ jobId, changes }) => JobService.editJob(jobId, changes),
    onMutate: ({ jobId, changes }) => {
      const prevJobs = queryClient.getQueryData<IJob[]>(["jobs"]);
      queryClient.setQueryData(
        ["jobs"],
        prevJobs?.map((job) =>
          job._id === jobId ? { ...job, ...changes } : job
        )
      );
      return { prevJobs };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => JobService.deleteJob(jobId),
    onMutate: (jobId: string) => {
      const prevJobs = queryClient.getQueryData<IJob[]>(["jobs"]);
      queryClient.setQueryData(
        ["jobs"],
        prevJobs?.filter((job) => job._id !== jobId)
      );
      return { prevJobs };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
