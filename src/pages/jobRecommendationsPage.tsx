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

const dummyJobs = {
  jobs: [
    {
      title: "Soccer Player",
      description:
        "Responsible for playing soccer at a professional level, participating in matches, and maintaining peak physical condition.",
    },
    {
      title: "Basketball Player",
      description:
        "Plays basketball professionally, focusing on teamwork, strategy, and physical fitness to compete in games.",
    },
    {
      title: "Football Player",
      description:
        "Engages in professional football, executing plays, practicing regularly, and maintaining strong physical endurance.",
    },
  ],
};

export const JobRecommendationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState(dummyJobs.jobs);
  const [country, setCountry] = useState("");
  const [salary, setSalary] = useState("");
  const [remoteOption, setRemoteOption] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = {
          keyword: "software engineer",
          location: "Israel",
          dateSincePosted: "past week",
          jobType: "full time",
          remoteFilter: "remote",
          salary: "100000",
          experienceLevel: "entry level",
          sortBy: "recent",
          limit: 10,
        };

        const { data } = await axios.get("http://localhost:3000/api/linkedin", {
          params,
        });

        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
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

      setJobs(data.jobs);
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
        <h1 className="text-3xl font-semibold text-gray-800">
          <span className="block text-indigo-600">Job Offers</span>
          Based on Your CV
        </h1>
      </div>
      {dummyJobs.jobs.map((job, index) => (
        <motion.div
          key={job.title}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <Card className="m-4">
            <CardHeader title={job.title} />
            <CardContent>
              <CardTitle className="mb-4">{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger className="btn btn-primary">
                  Show result on LinkedIn
                </DialogTrigger>
                <DialogContent className="p-6 max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
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
                          className="mb-4"
                        />
                        <Input
                          placeholder="Enter minimum salary"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="mb-4"
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
                        <Button onClick={handleFilterSubmit}>
                          Apply Filters
                        </Button>
                        <div className="space-y-4 mt-4">
                          {jobs.map((job, index) => (
                            <a
                              key={index}
                              href={job.jobUrl}
                              className="block"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Card className="shadow-lg border border-gray-200 rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl">
                                <CardContent>
                                  <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-800">
                                      {job.position}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardFooter className="text-gray-600">
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
