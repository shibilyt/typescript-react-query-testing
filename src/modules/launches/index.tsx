import * as React from "react";
import { useParams } from "react-router";

export default function List() {
  const { id }: { id: string } = useParams();
  return <div>List {id ? `has id : ${id}` : ""}</div>;
}
