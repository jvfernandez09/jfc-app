import {
  getBusinessById,
  getBusinessCategories,
  getBusinessTags,
} from "@/app/actions/business";
import { getCategories } from "@/app/actions/categories";
import { getTags } from "@/app/actions/tags";
import { notFound } from "next/navigation";
import EditBusinessForm from "./EditBusinessForm";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const business = await getBusinessById(id);
  if (!business) notFound();

  const [categories, tags, categoryIds, tagIds] = await Promise.all([
    getCategories(),
    getTags(),
    getBusinessCategories(id),
    getBusinessTags(id),
  ]);

  return (
    <EditBusinessForm
      business={{
        ...business,
        categoryIds,
        tagIds,
      }}
      categories={categories}
      tags={tags}
    />
  );
}
