import Link from "next/link";
import Table, { TableColumn } from "@/components/ui/Table";
import AddButton from "@/components/ui/AddButton";
import NoticeFromStorage from "@/components/ui/NoticeFromStorage";
import BusinessRowActions from "@/components/business/BusinessRowActions";
import { getBusinesses, BusinessRow } from "@/app/actions/business";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Business Page",
};

export default async function BusinessPage() {
  const rows = await getBusinesses();

  const columns: TableColumn<BusinessRow>[] = [
    {
      key: "name",
      header: "Business Name",
      render: (row) => (
        <Link
          href={`/business/${row.id}/show`}
          className="text-sm text-blue-600 hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "contact_email",
      header: "Contact Email",
      render: (row) => row.contact_email ?? "-",
    },
    {
      key: "categories",
      header: "Categories",
      render: (row) =>
        row.categories.length === 0 ? "—" : (
          <div className="flex flex-wrap gap-2">
            {row.categories.map((c) => (
              <span key={c.id} className="rounded bg-gray-100 px-2 text-xs">
                {c.name}
              </span>
            ))}
          </div>
        ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (row) =>
        row.tags.length === 0 ? "—" : (
          <div className="flex flex-wrap gap-2">
            {row.tags.map((t) => (
              <span key={t.id} className="rounded bg-gray-100 px-2 text-xs">
                {t.name}
              </span>
            ))}
          </div>
        ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (row) => <BusinessRowActions businessId={row.id} />,
    },
  ];

  return (
    <Table
      title=""
      notice={<NoticeFromStorage storageKey="businessToast" durationMs={5000} />}
      actionButton={
        <Link href="/business/create">
          <AddButton label="Add Business" />
        </Link>
      }
      columns={columns}
      rows={rows}
      emptyText="No businesses found."
    />
  );
}
