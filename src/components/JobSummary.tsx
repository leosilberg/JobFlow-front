import { IJob } from "@/types/job.types.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card.tsx";
import { useRemoveJob } from "../mutations/job.mutations.ts";
import { Trash } from "lucide-react";
type JobSummaryProps = {
  job: IJob;
  isOverlay?: boolean;
};

export type TaskType = "Task";

export function JobSummary({ job, isOverlay }: JobSummaryProps) {
  const removeJob = useRemoveJob();
  const navigate = useNavigate();
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job._id,
    data: {
      type: "Job",
      job,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("group", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
      onClick={() => navigate(`./job/${job._id}`)}
    >
      <CardHeader
        className="px-3 py-3 space-between flex flex-row border-b-2 cursor-grab relative"
        {...attributes}
        {...listeners}
      ></CardHeader>
      <CardContent className="px-3 pt-3 pb-6 flex items-center justify-between text-left cursor-pointer  whitespace-pre-wrap">
        {job.title}{" "}
        <button
          className="text-red-500 dark:text-red-400 hidden group-hover:block"
          onClick={(event) => {
            event.stopPropagation();
            removeJob.mutate(job._id);
          }}
        >
          <Trash size={16} className="hover:animate-pulse" />
        </button>
      </CardContent>
    </Card>
  );
}
