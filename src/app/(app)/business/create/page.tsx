import { getCategories } from "@/app/actions/categories";
import { getTags } from "@/app/actions/tags";
import CreateBusinessForm from "./CreateBusinessForm";

export default async function CreateBusinessPage() {
  return (
    <CreateBusinessForm
      categories={await getCategories()}
      tags={await getTags()}
    />
  );
}
