import { JobSummary } from "@/components/JobSummary.tsx";
import { StatusColumn } from "@/components/StatusColumn.tsx";
import { Job } from "@/types/job.types.ts";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet } from "react-router-dom";

type DashboardPageProps = {};

const columns = [
  {
    title: "Wishlist",
  },
  {
    title: "Applied",
  },
  {
    title: "Interview",
  },
  {
    title: "Offer",
  },
  {
    title: "Rejected",
  },
];

export default function DashboardPage({}: DashboardPageProps) {
  const columnsId = useMemo(() => columns.map((col) => col.title), [columns]);
  const [jobs, setJobs] = useState<Job[]>([
    {
      _id: "1",
      userId: "user123",
      title: "Software Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      description:
        "Develop and maintain web applications using modern technologies.",
      salary: "$120,000",
      link: "https://techinnovations.com/careers/1",
      status: "Applied",
      custom_resume_link: "https://example.com/resume1",
      interview_date: "2024-08-20",
      contract_link: "https://example.com/contract1",
    },
    {
      _id: "2",
      userId: "user456",
      title: "Data Scientist",
      company: "Data Insights LLC",
      location: "New York, NY",
      description:
        "Analyze large datasets to provide actionable insights and build predictive models.",
      salary: "$130,000",
      link: "https://datainsights.com/careers/2",
      status: "Wishlist",
      custom_resume_link: "https://example.com/resume2",
      interview_date: "2024-08-25",
      contract_link: "https://example.com/contract2",
    },
    {
      _id: "3",
      userId: "user789",
      title: "UX Designer",
      company: "Creative Solutions",
      location: "Remote",
      description:
        "Design user-friendly interfaces and create engaging user experiences.",
      salary: "$110,000",
      link: "https://creativesolutions.com/careers/3",
      status: "Wishlist",
      custom_resume_link: "https://example.com/resume3",
      interview_date: "2024-08-15",
      contract_link: "https://example.com/contract3",
    },
  ]);

  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [activeTask, setActiveTask] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Job") {
      setActiveTask(data.job);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Job";
    const isOverATask = overData?.type === "Job";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((t) => t._id === activeId);
        const overIndex = jobs.findIndex((t) => t._id === overId);
        const activeTask = jobs[activeIndex];
        const overTask = jobs[overIndex];
        if (activeTask && overTask && activeTask.status !== overTask.status) {
          activeTask.status = overTask.status;
          return arrayMove(jobs, activeIndex, Math.max(0, overIndex - 1));
        }

        return arrayMove(jobs, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((t) => t._id === activeId);
        const activeTask = jobs[activeIndex];
        if (activeTask) {
          activeTask.status = overId as string;
          return arrayMove(jobs, activeIndex, activeIndex);
        }
        return jobs;
      });
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4 items-center flex-row justify-center">
          {columns.map((col) => (
            <StatusColumn
              key={col.title}
              column={col}
              jobs={jobs.filter((task) => task.status === col.title)}
            />
          ))}
        </div>
        {"document" in window &&
          createPortal(
            <DragOverlay>
              {activeTask && <JobSummary job={activeTask} isOverlay />}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
      <Outlet />
    </>
  );
}
