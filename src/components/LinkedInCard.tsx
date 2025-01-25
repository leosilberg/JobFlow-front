import type { LinkedInJob } from "@/pages/LinkedinJobList";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type LinkedInCardProps = { job: LinkedInJob; savedLinks: string[] };

export default function LinkedInCard({ job, savedLinks }: LinkedInCardProps) {
  const saved = useMemo(() => {
    return savedLinks.includes(job.link);
  }, [savedLinks, job]);
  return (
    <Card className="shadow-lg border border-gray-200 rounded-lg dark:bg-gray-700 ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-gray-200 text-gray-800">
          {job.position}
        </CardTitle>
        <CardDescription>{job.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-row items-center justify-start gap-2">
            {job.companyLogo && (
              <img src={job.companyLogo} className="w-12 h-12 rounded-sm" />
            )}
            <p>{job.company}</p>
          </div>
          <p>Posted {job.agoTime}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex gap-4">
          <Link
            to={`https://www.linkedin.com/jobs/view/${job.id}`}
            target="_blank"
          >
            <Button
              className="border-pink-500 dark:indigo-600 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600"
              variant={"outline"}
            >
              View Job
            </Button>
          </Link>
          <Link to={`./create?linkedIn=${job.id}`}>
            <Button
              disabled={saved}
              className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
            >
              {saved ? "Saved" : "Add Job"}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
