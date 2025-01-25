import LinkedInCard from "@/components/LinkedInCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useGetFilteredJobs } from "@/queries/job.query";
import { useGetLinkedinJobList } from "@/queries/linkedin.query";
import { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export type LinkedInJob = {
  id: string;
  link: string;
  position: string;
  company: string;
  companyLink: string;
  companyLogo: string;
  location: string;
  date?: string;
  agoTime: string;
  applicants?: string;
  level?: string;
  type?: string;
  description?: string;
  applyLink?: string;
};

export default function LinkedinJobList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [queryParams, setQueryParams] = useState(() =>
    Object.fromEntries(searchParams.entries())
  );

  useEffect(() => {
    if (!location.pathname.includes("/create")) {
      setQueryParams(Object.fromEntries(searchParams.entries()));
    }
  }, [searchParams, location]);

  const debouncedSearchParams = useDebouncedValue(queryParams, 500);
  const { data: jobs } = useGetLinkedinJobList(
    debouncedSearchParams["keywords"],
    debouncedSearchParams["location"],
    debouncedSearchParams["date_since_posted"],
    debouncedSearchParams["start"]
  );

  const { data: savedJobs = [] } = useGetFilteredJobs("");
  const savedLinks = useMemo(() => {
    return savedJobs.flatMap((jobs) => jobs.map((job) => job.link));
  }, [savedJobs]);

  return (
    <>
      <div className="grid gap-4 flex-1 items-start p-6 bg-gradient-to-br from-white via-pink-100 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-black  overflow-hidden transition-colors duration-300 ease-in-out">
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <p className="text-2xl font-bold">Search LinkedIn Jobs</p>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Enter keywords"
              value={searchParams.get("keywords") || ""}
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set("keywords", e.target.value);
                  return prev;
                })
              }
              className="mb-4 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
            <Input
              placeholder="Enter location"
              value={searchParams.get("location") || ""}
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set("location", e.target.value);
                  return prev;
                })
              }
              className="mb-4 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
            <Select
              value={searchParams.get("date_since_posted") || "week"}
              onValueChange={(value) => {
                setSearchParams((prev) => {
                  prev.set("date_since_posted", value);
                  prev.set("start", "0");
                  return prev;
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Past Day</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-full w-full px-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            {jobs?.map((job, index) => (
              <LinkedInCard key={job.id} job={job} savedLinks={savedLinks} />
            ))}
          </div>
          {jobs && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex justify-between">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                  onClick={() => {
                    setSearchParams((prev) => {
                      const prevStart = parseInt(prev.get("start")) - 10;
                      prev.set("start", `${prevStart < 0 ? 0 : prevStart}`);
                      return prev;
                    });
                  }}
                  disabled={
                    searchParams.get("start")
                      ? searchParams.get("start") === "0"
                      : true
                  }
                >
                  Previous
                </Button>

                <Button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                  onClick={() => {
                    setSearchParams((prev) => {
                      const nextStart =
                        parseInt(prev.get("start") ?? "0") + jobs.length;
                      prev.set("start", `${nextStart}`);
                      return prev;
                    });
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </ScrollArea>
      </div>
      <Outlet />
    </>
  );
}
