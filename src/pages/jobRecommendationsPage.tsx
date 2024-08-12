import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import api from "@/lib/api";
import { FaLinkedin } from "react-icons/fa";

export const JobRecommendationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsByLinkedIn, setJobsByLinkedIn] = useState([]);
  const [country, setCountry] = useState("");
  const [salary, setSalary] = useState("");
  const [remoteOption, setRemoteOption] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchJobs = async () => {
      try {
        const params = {
          keyword: "software engineer",
          location: "Israel",
          dateSincePosted: "past week",
          jobType: "full time",
          remoteFilter: "remote",
          salary: "1000",
          experienceLevel: "entry level",
          sortBy: "recent",
          limit: 10,
        };

        const { data: var1 } = await axios.get(
          "http://localhost:3000/api/linkedin",
          {
            params,
            signal: abortController.signal,
          }
        );

        setJobsByLinkedIn(var1.jobs);

        const { data: var2 } = await api.get("openai/job-recomendation", {
          signal: abortController.signal,
        });
        console.log(var2);

        setJobs(var2);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
    () => abortController.abort();
  }, []);

  const handleFilterSubmit = async () => {
    try {
      const params = {
        keyword: "software engineer",
        location: country,
        dateSincePosted: "past week",
        jobType: "full time",
        remoteFilter: remoteOption,
        salary,
        experienceLevel: "entry level",
        sortBy: "recent",
        limit: 10,
      };

      const { data } = await axios.get("http://localhost:3000/api/linkedin", {
        params,
      });

      setJobsByLinkedIn(data.jobs);
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading)
    return <img src="spiner.svg" alt="" className="w-40 my-auto mx-auto" />;

  return (
    <>
      <div className="flex justify-center mt-8 mb-4">
        <h1 className="text-3xl font-semibold text-gray-700">
          <span className="block text-orange-500 dark:text-indigo-600">
            Job Offers
          </span>
          Based on Your CV
        </h1>
      </div>
      {jobs.map((job, index) => (
        <motion.div
          key={job.title}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="lg:px-[9.8em] px-2"
        >
          <Card className="my-4 border-2 border-orange-200 dark:border-none bg-gradient-to-tr from-orange-50 via-pink-50 to-red-50 dark:from-gray-800 dark:via-gray-900 dark:to-black overflow-y-auto">
            <CardHeader title={job.title} />
            <CardContent>
              <CardTitle className="mb-4">{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger className="btn flex items-center gap-2 btn-primary">
                  Show result on LinkedIn{" "}
                  <FaLinkedin className="text-blue-700 text-[1.1em]" />
                </DialogTrigger>
                <DialogContent className="p-6 lg:max-w-2xl mx-auto max-h-[80vh] overflow-y-auto lg:w-full  bg-gradient-to-br from-white via-pink-100 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-black shadow-xl rounded-2xl  transition-colors duration-300 ease-in-out">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Here are some jobs I've found
                    </DialogTitle>
                    <DialogDescription>
                      <div className="space-y-6">
                        <Input
                          placeholder="Enter country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="mb-4 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        />
                        <Input
                          placeholder="Enter minimum salary"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="mb-4 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        />
                        <Select
                          value={remoteOption}
                          onChange={(e) => setRemoteOption(e.target.value)}
                          className="mb-4"
                        >
                          <SelectContent>
                            <SelectItem value="none">Any</SelectItem>
                            <SelectItem value="on-site">On-site</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleFilterSubmit}
                          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                        >
                          Apply Filters
                        </Button>
                        <div className="space-y-4 mt-4">
                          {jobsByLinkedIn.map((job, index) => (
                            <a
                              key={index}
                              href={job.jobUrl}
                              className="block"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Card className="shadow-lg border border-gray-200 rounded-lg p-4 dark:bg-gray-700 transition-transform transform hover:scale-105 hover:shadow-xl">
                                <CardContent>
                                  <CardHeader>
                                    <CardTitle className="text-lg font-semibold dark:text-gray-200 text-gray-800">
                                      {job.position}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardFooter className="text-gray-600 dark:text-indigo-400">
                                    {job.company}
                                  </CardFooter>
                                </CardContent>
                              </Card>
                            </a>
                          ))}
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </>
  );
};
