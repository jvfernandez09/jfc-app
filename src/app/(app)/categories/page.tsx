import Link from "next/link";
import Table, { type TableColumn } from "@/components/ui/Table";
import AddButton from "@/components/ui/AddButton";
import { getCategories, type CategoryRow } from "@/app/actions/categories";
import CategoryRowActions from "@/components/categories/CategoriesRowActions";
import NoticeFromStorage from "@/components/ui/NoticeFromStorage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Categories Page",
};

export default async function CategoriesPage() {
  const rows = await getCategories();

  const columns: TableColumn<CategoryRow>[] = [
    {
      key: "name",
      header: "Category Name",
      width: "70%",
      render: (row) => <span className="text-sm text-gray-900">{row.name}</span>,
    },
    {
      key: "action",
      header: "Action",
      width: "30%",
      align: "center",
      render: (row) => <CategoryRowActions categoryId={row.id} />,
    },
  ];

  return (
    <div>
      <Table
        title=""
        notice={<NoticeFromStorage storageKey="categoryToast" durationMs={5000} />}
        actionButton={
          <Link href="/categories/create" className="inline-flex cursor-pointer">
            <AddButton label="Add Category" />
          </Link>
        }
        columns={columns}
        rows={rows}
        emptyText="No categories found."
      />
    </div>
  );
}
