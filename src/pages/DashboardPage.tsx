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
import { Outlet } from "react-router-dom";

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
    console.log(
      `DashboardPage: `,
      jobs.map((job) => ({
        order: job.order,
        status: job.status,
      }))
    );
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
        <div className="flex gap-4 items-center flex-row justify-center">
          {columns.map((col) => (
            <StatusColumn
              key={col.title}
              column={col}
              jobs={jobs?.filter((job) => job.status === col.id)}
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
