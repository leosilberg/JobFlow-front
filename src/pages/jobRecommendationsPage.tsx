import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion"; // Import Framer Motion

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

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
      {dummyJobs.jobs.map((job, index) => {
        return (
          <motion.div
            key={job.title}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: index * 0.2 }} // Delays each card slightly
          >
            <Card className=" m-4">
              <CardHeader title={job.title} />
              <CardContent>
                <CardTitle className="mb-4">{job.title}</CardTitle>
                <CardDescription>{job.description}</CardDescription>
              </CardContent>
              <CardFooter>
                {/* <a
                  href={`https://www.linkedin.com/jobs/search?keywords=${job.title}&location=&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`}
                  className="btn btn-primary"
                >
                  Visit linkedIn page
                </a> */}

                <Dialog>
                  <DialogTrigger>Show result on LinkedIn</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Here are some jobs i've found </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
};
