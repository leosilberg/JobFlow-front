import api from "@/lib/api.ts";
import { JobValues } from "@/pages/CreateJobPage.tsx";
import { IJob } from "@/types/job.types.ts";
import { isAxiosError } from "axios";

async function getJobs(
  signal: AbortSignal,
  searchParams?: string
): Promise<IJob[]> {
  try {
    const { data } = await api.get<IJob[]>(`job`, { signal });
    return data;
  } catch (error) {
    console.log(`job.service: `, error);
    if (isAxiosError(error))
      throw error.response?.data ? error.response.data : error.message;
    else throw (error as Error).message;
  }
}

async function getJob(jobId: string, signal: AbortSignal): Promise<IJob> {
  try {
    const { data: job } = await api.get<IJob>(`job/${jobId}`, { signal });
    return job;
  } catch (error) {
    console.log(`job.service: `, error);
    if (isAxiosError(error))
      throw error.response?.data ? error.response.data : error.message;
    else throw (error as Error).message;
  }
}

async function createJob(newJob: JobValues): Promise<IJob> {
  try {
    const { data } = await api.post<IJob>("job", newJob, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.log(`job.service: `, error);
    if (isAxiosError(error))
      throw error.response?.data ? error.response.data : error.message;
    else throw (error as Error).message;
  }
}

async function deleteJob(jobId: string): Promise<string> {
  try {
    const { data } = await api.delete<string>(`job/${jobId}`);
    return data;
  } catch (error) {
    console.log(`job.service: `, error);
    if (isAxiosError(error))
      throw error.response?.data ? error.response.data : error.message;
    else throw (error as Error).message;
  }
}

async function editJob(
  jobId: string,
  changes: Partial<Omit<IJob, "_id" | "userId">>
): Promise<IJob> {
  try {
    const { data } = await api.patch<IJob>(`job/${jobId}`, changes);
    return data;
  } catch (error) {
    console.log(`job.service: `, error);
    if (isAxiosError(error))
      throw error.response?.data ? error.response.data : error.message;
    else throw (error as Error).message;
  }
}

async function updateOrder(jobs: IJob[]): Promise<IJob> {
  try {
    const { data } = await await api.patch("job/order", {
      jobs: jobs.map((job) => ({
        _id: job._id,
        changes: { order: job.order, status: job.status },
      })),
    });
    return data;
  } catch (error) {
    console.log(`job.service: `, error);
    if (isAxiosError(error))
      throw error.response?.data ? error.response.data : error.message;
    else throw (error as Error).message;
  }
}
export const JobService = {
  getJobs,
  deleteJob,
  editJob,
  getJob,
  createJob,
  updateOrder,
};
