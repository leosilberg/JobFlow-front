import { JobSummary } from "@/components/JobSummary.tsx";
import { StatusColumn } from "@/components/StatusColumn.tsx";
import { useUpdateJob } from "@/mutations/job.mutations.ts";
import { useGetFilteredJobs } from "@/queries/job.query.ts";
import { IJob } from "@/types/job.types.ts";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet } from "react-router-dom";

type DashboardPageProps = {};

const columns = [
  {
    id: 1,
    title: "Wishlist",
  },
  { id: 2, title: "Applied" },
  {
    id: 3,
    title: "Interview",
  },
  {
    id: 4,
    title: "Offer",
  },
  {
    id: 5,
    title: "Rejected",
  },
];

export default function DashboardPage({}: DashboardPageProps) {
  const columnsId = useMemo(() => columns.map((col) => col.title), [columns]);
  const { data: jobs = [] } = useGetFilteredJobs("");
  useEffect(() => {
    console.log(`DashboardPage: `, jobs);
  }, [jobs]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [activeTask, setActiveTask] = useState<IJob | null>(null);
  const queryClient = useQueryClient();
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

  const update = useUpdateJob();
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

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
      const activeIndex = jobs?.findIndex((t) => t._id === activeId);
      const overIndex = jobs?.findIndex((t) => t._id === overId);
      const activeTask = jobs[activeIndex];
      const overTask = jobs[overIndex];
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        console.log(`DashboardPage: drop on job differnt status`);
        return queryClient.setQueryData(["jobs"], (old: IJob[]) => {
          const oldjob = old?.find((t) => t._id === activeId);
          if (oldjob) oldjob.status = overTask.status;
          const newarr = arrayMove(old, activeIndex, overIndex).map(
            (job, index) => ({
              ...job,
              order: index,
            })
          );
          update.mutate(newarr);
          return newarr;
        });
      }
      console.log(`DashboardPage: drop on job same status`);
      return queryClient.setQueryData(["jobs"], (old: IJob[]) => {
        return arrayMove(old, activeIndex, overIndex).map((job, index) => ({
          ...job,
          order: index,
        }));
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      console.log(`DashboardPage: drop over column`, overData.endOrder);
      queryClient.setQueryData(["jobs"], (old: IJob[]) =>
        old?.map((job) =>
          job._id === activeId ? { ...job, status: overId } : job
        )
      );
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 flex-wrap lg:items-start items-center lg:flex-row flex-col justify-center lg:py-10 p-6 bg-gradient-to-tr from-orange-100 via-pink-200 to-red-300 dark:bg-gradient-to-tr dark:from-gray-800 dark:via-gray-900 dark:to-black">
          {columns.map((col) => (
            <StatusColumn
              key={col.title}
              column={col}
              jobs={jobs?.filter((job) => job.status == col.id)}
              className="bg-gradient-to-r from-orange-50 via-pink-100 to-red-100 dark:from-gray-700 dark:via-gray-800 dark:to-black p-5 rounded-2xl text-gray-800 dark:text-white shadow-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out"
            />
          ))}
        </div>
        {"document" in window &&
          createPortal(
            <DragOverlay>
              {activeTask && (
                <div className="p-2 bg-gradient-to-r from-pink-100 via-red-200 to-orange-300 dark:bg-gradient-to-r dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-2xl transform transition-transform duration-200 ease-in-out">
                  <JobSummary job={activeTask} isOverlay />
                </div>
              )}
            </DragOverlay>,
            document.body
          )}
        <footer className="w-full bg-gradient-to-br from-orange-100 via-pink-200 to-red-300 dark:from-gray-800 dark:via-gray-900 dark:to-black text-center text-gray-700 dark:text-gray-400 py-8">
          <p>&copy; 2024 All rights reserved.</p>
          <div className="mt-4">
            <Link to="#" className="text-blue-600 dark:text-blue-400">
              Privacy Policy
            </Link>
            {" | "}
            <Link to="#" className="text-blue-600 dark:text-blue-400">
              Terms of Service
            </Link>
          </div>
        </footer>
      </DndContext>
      <Outlet />
    </>
  );
}
