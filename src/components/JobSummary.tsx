import { IJob } from "@/types/job.types.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRemoveJob } from "../mutations/job.mutations.ts";
import { Card, CardContent, CardHeader } from "./ui/card.tsx";
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
      <CardHeader className="px-3 py-3 space-y-0 flex flex-row  items-center justify-between border-b-2 ">
        <button className="cursor-grab" {...attributes} {...listeners}>
          <GripVertical size={16} />
        </button>
        <button
          className="hidden group-hover:block"
          onClick={(event) => {
            event.stopPropagation();
            removeJob.mutate(job._id);
          }}
        >
          <TrashIcon
            size={16}
            className="text-red-500 dark:text-red-400 hover:animate-pulse"
          />
        </button>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 flex flex-col items-start gap-4 text-left cursor-pointer  whitespace-pre-wrap">
        <p className="font-bold">{job.position} </p>
        <div className="flex flex-row items-center justify-start gap-2">
          {job.company_logo && (
            <img src={job.company_logo} className="w-12 h-12 rounded-sm" />
          )}
          <p>{job.company}</p>
        </div>
      </CardContent>
    </Card>
  );
}
