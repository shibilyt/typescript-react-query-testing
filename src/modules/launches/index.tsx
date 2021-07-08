import * as React from "react";
import { useParams } from "react-router";

export default function Launches() {
  const { id }: { id: string } = useParams();
  return <div>launches {id ? `has id : ${id}` : ""}</div>;
}
