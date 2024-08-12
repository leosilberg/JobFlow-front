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
import { useAuthContext } from "@/contexts/AuthContext";
const Job = {
  title: "Software Engineer",
  company: "XYZ Corp",
  location: "New York, NY",
  description: "Software Engineer with experience in software development",
  salary: 11111111,
  link: "https://google.com",
  status: "wishlist",
  interview_date: new Date("2014-01-16"),
  contract_link: "https://google.com",
};

// Helper function to format the date
const formatDate = (date: Date) => {
  return date ? format(date, "PPP") : "Not set";
};

export const Test = () => {
  const { user } = useAuthContext();
  const [fileContent, setFileContent] = useState(null);

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

  return (
    <>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent
          className="rounded-lg shadow-lg p-6 max-w-md bg-white border border-gray-200"
          style={{
            borderRadius: "20px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DialogHeader className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <DialogTitle className="text-xl font-bold text-gray-800">
                <strong>{Job.title}</strong>
              </DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Select>
                <SelectTrigger className="border border-gray-300 rounded-md p-1">
                  <span className="sr-only">Select an action</span>{" "}
                  <p>Actions</p>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wishlist">wishlist</SelectItem>
                  <SelectItem value="applied">applied</SelectItem>
                  <SelectItem value="interview">interview</SelectItem>
                  <SelectItem value="offer">offer</SelectItem>
                  <SelectItem value="rejected">rejected</SelectItem>
                </SelectContent>
              </Select>
              <button className="text-red-500">
                <Trash size={16} />
              </button>
            </div>
          </DialogHeader>
          <DialogDescription>
            <div className="grid gap-2 p-4 text-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-gray-600 flex items-center">
                  <DollarSign size={16} />
                  <p className="ml-1">${Job.salary.toLocaleString()}</p>
                </div>
                <div className="text-gray-600 flex items-center">
                  <MapPin size={16} />
                  <p className="ml-1">{Job.location}</p>
                </div>
                <div className="text-gray-600 flex items-center">
                  <Link size={16} />
                  <a
                    href={Job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 underline"
                  >
                    {Job.link}
                  </a>
                </div>
              </div>
              <div>
                <strong>Company:</strong> {Job.company}
              </div>
              <div>
                <strong>Description:</strong> {Job.description}
              </div>
              <div>
                <strong>Status:</strong> {Job.status}
              </div>
              <div>
                <strong>Interview Date:</strong>{" "}
                {formatDate(Job.interview_date)}
              </div>
              <div>
                <strong>Contract Link:</strong>{" "}
                <a
                  href={Job.contract_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {Job.contract_link}
                </a>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            {user?.resume_link ? (
              <Button>Match CV</Button>
            ) : (
              <div>
                <Button>Create CV</Button> <Button>Upload CV</Button>
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
