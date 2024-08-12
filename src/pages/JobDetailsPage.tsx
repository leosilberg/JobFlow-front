import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { MapPin, DollarSign, Link, Trash } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust the path as needed
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetJob } from "@/queries/job.query";
import { useAuthContext } from "@/contexts/AuthContext";
import { columns } from "./DashboardPage";
import { useRemoveJob, useEditJob } from "../mutations/job.mutations.ts";
import { CiEdit } from "react-icons/ci";

const loggenInUser = {
  resume_link: "",
};

// Helper function to format the date
const formatDate = (date: Date) => {
  return date ? format(date, "PPP") : "Not set";
};

export const JobDetails = () => {
  const params = useParams();
  const { data: job } = useGetJob(params.jobId!);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const removeJob = useRemoveJob();
  const editJob = useEditJob();
  const [fileContent, setFileContent] = useState(null);
  const status = columns.find((column) => column.id)?.title;
  const location = useLocation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        // Process the file content or upload it
        setFileContent(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid .docx file");
    }
  };
  const handleRemoveJob = () => {
    removeJob.mutate(job._id, {
      onSuccess: () => {
        navigate(location.state?.from || "..");
      },
    });
  };
  const handleEditJob = () => {
    editJob.mutate(job._id, {
      onSuccess: () => {
        navigate(location.state?.from || "..");
      },
    });
  };

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
                <strong>{job?.title}</strong>{" "}
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
                <button className="text-red-500 dark:text-green-400">
                  <CiEdit
                    className="hover:animate-pulse"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditJob();
                    }}
                  />
                </button>
              </DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Select>
                <SelectTrigger className="border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <span className="sr-only">Select an action</span>{" "}
                  <p>Actions</p>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <SelectItem value="wishlist">Wishlist</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <DialogDescription>
            <div className="grid gap-2 lg:px-4 text-gray-700 dark:text-gray-300">
              <div className="flex lg:justify-between flex-col lg:flex-row items-center">
                <div className="text-gray-600 dark:text-gray-400 flex items-center">
                  <DollarSign
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                  <p className="ml-1">{job?.salary.toLocaleString()}</p>
                </div>
                <div className="text-gray-600 dark:text-gray-400 flex items-center">
                  <MapPin
                    size={16}
                    className="text-orange-400 dark:text-orange-300"
                  />
                  <p className="ml-1">{job?.location}</p>
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
                <strong>Company:</strong> {job?.company}
              </div>
              <div className="py-2">
                <strong>Description:</strong> {job?.description}
              </div>
              <div className="py-2">
                <strong>Status:</strong> {status}
              </div>
              <div className="py-2">
                <strong>Interview Date:</strong>{" "}
                {formatDate(job?.interview_date)}
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
            {loggenInUser.resume_link ? (
              <Button className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
                Match CV
              </Button>
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
      <div>
        <input type="file" accept=".docx" onChange={handleFileChange} />
        {fileContent && <div>File uploaded successfully!</div>}
      </div>
    </>
  );
};
