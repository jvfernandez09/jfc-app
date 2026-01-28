import { getBusinessOptions, getTagOptions } from "@/app/actions/people";
import CreatePersonForm from "./CreatePeopleForm";

export default async function CreatePersonPage() {
  const businesses = await getBusinessOptions();
  const tags = await getTagOptions();

  return <CreatePersonForm businesses={businesses} tags={tags} />;
}
