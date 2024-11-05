import Editable from "@/components/Editable.tsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input.tsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust the path as needed
import { useAuthContext } from "@/contexts/AuthContext";
import api from "@/lib/api.ts";
import {
  useEditJob,
  useRemoveJob,
  useUpdateJob,
} from "@/mutations/job.mutations.ts";
import { useGetJob } from "@/queries/job.query.ts";
import { IJob } from "@/types/job.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import saveAs from "file-saver";
import { DollarSign, Link, MapPin, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { columns } from "./DashboardPage";

// Helper function to format the date
const formatDate = (date?: Date) => {
  return date ? format(date, "PPP") : "Not set";
};

export const JobDetails = () => {
  const { user, uploadResume } = useAuthContext();
  const params = useParams();
  const { data: job } = useGetJob(params.jobId!);
  const navigate = useNavigate();
  const removeJob = useRemoveJob();
  const editJob = useEditJob();
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(
    null
  );
  const status = columns[job?.status];
  const location = useLocation();

  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const companyRef = useRef(null);
  const salaryRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer !== undefined) {
          // Only set fileContent if arrayBuffer is defined
          setFileContent(arrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid .docx file");
    }
  };
  const handleRemoveJob = () => {
    if (job) {
      removeJob.mutate(job._id, {
        onSuccess: () => {
          navigate(location.state?.from || "..");
        },
      });
    } else {
      console.error("Job data is undefined, cannot remove the job.");
    }
  };

  const queryClient = useQueryClient();
  const update = useUpdateJob();
  async function handleEditStatus(newStatus: number) {
    const copy = queryClient
      .getQueryData<IJob[][]>(["jobs"])
      ?.map((jobs) => (jobs ? [...jobs] : []));

    const prevStatus = job.status;

    copy[prevStatus].splice(job.order, 1);
    copy[prevStatus] = copy[prevStatus].map((job, index) => ({
      ...job,
      order: index,
    }));

    if (copy[newStatus]) {
      copy[newStatus].push({ ...job, status: newStatus });
    } else {
      copy[newStatus] = [{ ...job, status: newStatus }];
    }
    copy[newStatus] = copy[newStatus].map((job, index) => ({
      ...job,
      order: index,
    }));
    queryClient.setQueryData(["job", { jobId: job._id }], (old: IJob) => {
      return { ...old, status: newStatus };
    });
    await update.mutateAsync(copy[newStatus].concat(copy[prevStatus]));
    queryClient.invalidateQueries({ queryKey: ["job", { jobId: job._id }] });
  }

  const parseDate = (dateString?: string): Date | undefined => {
    return dateString ? new Date(dateString) : undefined;
  };

  async function handleCreation() {
    try {
      const { data: blob } = await api.post(
        "openai/job-matcher",
        {
          description: job?.description,
        },
        {
          responseType: "blob",
        }
      );
      saveAs(blob, "cv.docx");

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", blob, "cv.docx");
      formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset

      try {
        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dipx5fuza/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Extract URL from response
        const fileUrl = uploadResponse.data.secure_url;

        editJob.mutate({
          jobId: job._id,
          changes: { custom_resume_link: fileUrl },
        });
      } catch (uploadError) {
        console.error("Error uploading file to Cloudinary:", uploadError);
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  return (
    <>
      <Dialog open onOpenChange={(open) => !open && navigate("..")}>
        <DialogContent
          className="rounded-lg shadow-lg mx-auto h-[80vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-y-auto"
          style={{
            borderRadius: "20px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DialogHeader className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <DialogTitle className="text-xl font-bold flex gap-3 items-center tracking-wide text-gray-800 dark:text-gray-100">
                <Editable
                  text={job?.title}
                  inputRef={titleRef}
                  className="font-bold"
                  onChange={(changes: any) => {
                    editJob.mutate({ jobId: job!._id, changes });
                  }}
                >
                  <Input
                    ref={titleRef}
                    defaultValue={job?.title}
                    name="title"
                  />
                </Editable>
                <button className="text-red-500 dark:text-red-400">
                  <Trash
                    size={16}
                    className="hover:animate-pulse"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveJob();
                    }}
                  />
                </button>
              </DialogTitle>
            </div>
            <div className="flex items-center space-x-2"></div>
          </DialogHeader>
          <DialogDescription>
            <div className="grid gap-2 lg:px-4 text-gray-700 dark:text-gray-300">
              <div className="flex lg:justify-between flex-col lg:flex-row items-center">
                <div className="text-gray-600 dark:text-gray-400 flex items-center">
                  <DollarSign
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                  <Editable
                    text={job?.salary}
                    inputRef={salaryRef}
                    onChange={(changes: any) => {
                      editJob.mutate({ jobId: job!._id, changes });
                    }}
                  >
                    <Input
                      ref={salaryRef}
                      defaultValue={job?.salary}
                      name="salary"
                    />
                  </Editable>
                </div>
                <div className="text-gray-600 dark:text-gray-400 flex items-center">
                  <MapPin
                    size={16}
                    className="text-orange-400 dark:text-orange-300"
                  />
                  <Editable
                    text={job?.location}
                    inputRef={locationRef}
                    onChange={(changes: any) => {
                      editJob.mutate({ jobId: job!._id, changes });
                    }}
                  >
                    <Input
                      ref={locationRef}
                      defaultValue={job?.location}
                      name="location"
                    />
                  </Editable>
                </div>
                <div className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Link
                    size={16}
                    className="text-neutral-500 dark:text-neutral-400"
                  />
                  <a
                    href={job?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 dark:text-blue-400 underline"
                  >
                    {job?.link}
                  </a>
                </div>
              </div>
              <div className="py-2">
                <strong>Company:</strong>{" "}
                <Editable
                  text={job?.company}
                  inputRef={companyRef}
                  onChange={(changes: any) => {
                    editJob.mutate({ jobId: job!._id, changes });
                  }}
                >
                  <Input
                    ref={companyRef}
                    defaultValue={job?.company}
                    name="company"
                  />
                </Editable>
              </div>
              <div className="py-2">
                <strong>Description:</strong>{" "}
                <Editable
                  text={job?.description}
                  inputRef={descriptionRef}
                  onChange={(changes: any) => {
                    editJob.mutate({ jobId: job!._id, changes });
                  }}
                >
                  <Input
                    ref={descriptionRef}
                    defaultValue={job?.description}
                    name="description"
                  />
                </Editable>
              </div>
              <div className="py-2">
                <strong>Status:</strong>
                <Select
                  onValueChange={(value) => handleEditStatus(parseInt(value))}
                  value={job?.status.toString()}
                >
                  <SelectTrigger className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <SelectItem value="0">Wishlist</SelectItem>
                    <SelectItem value="1">Applied</SelectItem>
                    <SelectItem value="2">Interview</SelectItem>
                    <SelectItem value="3">Offer</SelectItem>
                    <SelectItem value="4">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="py-2">
                <strong>Interview Date:</strong>{" "}
                {formatDate(parseDate(job?.interview_date))}
              </div>
              <div className="py-2">
                <strong>Contract Link:</strong>{" "}
                <a
                  href={job?.contract_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {job?.contract_link}
                </a>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            {user?.resume_link ? (
              <div>
                {job?.custom_resume_link && (
                  <Button
                    onClick={() => {
                      window.open(
                        job.custom_resume_link,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                  >
                    Dowload CV
                  </Button>
                )}
                <Button
                  onClick={handleCreation}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  Match CV
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
                  <a href="/create-resume">Create CV</a>
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
