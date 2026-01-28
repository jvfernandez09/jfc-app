import Link from "next/link";
import Table, { type TableColumn } from "@/components/ui/Table";
import AddButton from "@/components/ui/AddButton";
import { getTags, type TagRow } from "@/app/actions/tags";
import TagRowActions from "@/components/tag/TagRowActions";
import NoticeFromStorage from "@/components/ui/NoticeFromStorage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Tags Page",
};

export default async function TagsPage() {
  const rows = await getTags();

  const columns: TableColumn<TagRow>[] = [
    {
      key: "name",
      header: "Tag Name",
      width: "70%",
      render: (row) => <span className="text-sm text-gray-900">{row.name}</span>,
    },
    {
      key: "action",
      header: "Action",
      width: "30%",
      align: "center",
      render: (row) => <TagRowActions tagId={row.id} />,
    },
  ];

  return (
    <div>
      <Table
        title=""
        notice={<NoticeFromStorage storageKey="tagToast" durationMs={5000} />}
        actionButton={
          <Link href="/tag/create" className="inline-flex cursor-pointer">
            <AddButton label="Add Tag" />
          </Link>
        }
        columns={columns}
        rows={rows}
        emptyText="No tags found."
      />
    </div>
  );
}
