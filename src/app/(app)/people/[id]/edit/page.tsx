import { notFound } from "next/navigation";
import {
  getPersonById,
  getBusinessOptions,
  getTagOptions,
} from "@/app/actions/people";
import EditPersonForm from "./EditPeopleForm";

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = await getPersonById(id);
  if (!person) notFound();

  const businesses = await getBusinessOptions();
  const tags = await getTagOptions();

  return (
    <EditPersonForm person={person} businesses={businesses} tags={tags} />
  );
}
