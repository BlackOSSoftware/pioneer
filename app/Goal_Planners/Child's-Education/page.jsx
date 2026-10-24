import { redirect } from "next/navigation";

/** Legacy / duplicate route — send users to the canonical Child-Education planner. */
export default function ChildsEducationAliasPage() {
  redirect("/Goal_Planners/Child-Education");
}
