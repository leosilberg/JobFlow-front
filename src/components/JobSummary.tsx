import { IJob } from "@/types/job.types.ts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card.tsx";
type JobSummaryProps = {
  job: IJob;
  isOverlay?: boolean;
};

export type TaskType = "Task";

export function JobSummary({ job, isOverlay }: JobSummaryProps) {
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

  const variants = cva("cursor-grab", {
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
      {...attributes}
      {...listeners}
      onClick={() => navigate(`/job/${job._id}`)}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative"></CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        {job.title}
      </CardContent>
    </Card>
  );
}
