import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type ErrorPageProps = {};

export default function ErrorPage({}: ErrorPageProps) {
  return (
    <div className="flex flex-col min-h-screen justify-center p-8">
      <div className="grid gap-4 ">
        <h1 className="font-bold text-lg">Oops, something went wrong!</h1>
        <p>
          We're sorry, but an unexpected error has occurred. Please try again
          later or contact support if the issue persists.
        </p>
        <Link to={"/"}>
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
