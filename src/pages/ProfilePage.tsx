import { useAuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { useState } from "react";
import { FiFileText, FiMail } from "react-icons/fi";
import { MdOutlineWork, MdPerson } from "react-icons/md";

interface IJob {
  title: string;
  company: string;
  link: string;
}

function ProfilePage() {
  const { user, uploadResume } = useAuthContext();
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        setFileContent(arrayBuffer);

        try {
          // Create a Blob from the ArrayBuffer
          const blob = new Blob([arrayBuffer], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          // Prepare the form data for Cloudinary upload
          const formData = new FormData();
          formData.append("file", blob, "uploaded_file.docx");
          formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset

          // Upload the file to Cloudinary
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dipx5fuza/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.secure_url) {
            setFileUploaded(true);
            uploadResume(response.data.secure_url);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid .docx file");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto my-8 p-8 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-4">
          <MdPerson className="text-pink-500 dark:text-indigo-400" />
          {user?.firstName} {user?.lastName}'s Profile
        </h1>
        <div className="grid gap-6">
          <div className="flex items-center">
            <FiMail className="text-pink-500 dark:text-indigo-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">
              Email:
            </span>
            <span className="ml-2 text-gray-800 dark:text-gray-200">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center">
            <FiFileText className="text-pink-500 dark:text-indigo-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">
              Resume Link:
            </span>
            {user?.resume_link ? (
              <a
                href={user?.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 dark:text-blue-400 underline"
              >
                View Resume
              </a>
            ) : (
              <span className="ml-2 text-gray-800 dark:text-gray-200">
                No resume uploaded
              </span>
            )}
          </div>
          <input type="file" accept=".docx" onChange={handleFileChange} />
          {fileUploaded && <div>File uploaded successfully!</div>}
          <div className="grid gap-2">
            <span className="flex items-center text-gray-600 dark:text-gray-400 font-medium">
              <MdOutlineWork className="mr-2 text-pink-500 dark:text-indigo-400" />
              Jobs Applied:
            </span>
            <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
              <li className="text-gray-600 dark:text-gray-400">
                No jobs applied yet
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
