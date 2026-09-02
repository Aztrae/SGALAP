import { createFileRoute } from "@tanstack/react-router";
import { SgaShell } from "@/components/sga/shell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SgaShell />;
}
