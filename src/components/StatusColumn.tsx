import { IJob } from "@/types/job.types.ts";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "./ui/card.tsx";

import { CSS } from "@dnd-kit/utilities";
import { JobSummary } from "./JobSummary.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";
export interface Column {
  title: string;
  id: number;
}

interface StatusColumnProps {
  column: Column;
  jobs?: IJob[];
  isOverlay?: boolean;
}

export function StatusColumn({
  column,
  jobs = [],
  isOverlay,
}: StatusColumnProps) {
  const tasksIds = useMemo(() => {
    return jobs.map((job) => job._id);
  }, [jobs]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] w-[250px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <p> {column.title}</p>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {jobs.map((job) => (
              <JobSummary key={job._id} job={job} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
