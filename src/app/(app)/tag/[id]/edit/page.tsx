import { notFound } from "next/navigation";
import { getTagById } from "@/app/actions/tags";
import EditTagForm from "./EditTagForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditTagPage({ params }: Props) {
  const { id } = await params;

  const tag = await getTagById(id);

  if (!tag) notFound();

  return <EditTagForm tag={tag} />;
}
