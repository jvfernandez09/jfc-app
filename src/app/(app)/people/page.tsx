import Link from "next/link";
import Table, { type TableColumn } from "@/components/ui/Table";
import AddButton from "@/components/ui/AddButton";
import { getPeople, type PersonRow } from "@/app/actions/people";
import PeopleRowActions from "@/components/people/PeopleRowActions";
import NoticeFromStorage from "@/components/ui/NoticeFromStorage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | People Page",
};

export default async function PeoplePage() {
  const rows = await getPeople();

  const columns: TableColumn<PersonRow>[] = [
    {
      key: "name",
      header: "Name",
      width: "20%",
      render: (row) => (
        <Link
          href={`/people/${row.id}/show`}
          className="text-sm text-blue-600 hover:underline"
        >
          {row.lastName}, {row.firstName}
        </Link>
      ),
    },

    {
      key: "email",
      header: "Email",
      width: "20%",
      render: (row) => (
        <span className="text-sm text-gray-700">{row.email ?? "-"}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      width: "15%",
      align: "center",
      render: (row) => <span className="text-sm text-gray-700">{row.phone ?? "-"}</span>,
    },
    {
      key: "business",
      header: "Business",
      width: "20%",
      render: (row) => (
        <span className="text-sm text-gray-700">{row.businessName ?? "-"}</span>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      width: "20%",
      align: "center",
      render: (row) => (
        <div className="flex flex-wrap justify-center gap-2">
          {row.tags.length === 0 ? (
            <span className="text-sm text-gray-400">-</span>
          ) : (
            row.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {tag.name}
              </span>
            ))
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "10%",
      align: "center",
      render: (row) => <PeopleRowActions personId={row.id} />,
    }

  ];


  return (
    <div>
      <Table
        title=""
        notice={<NoticeFromStorage storageKey="peopleToast" durationMs={5000} />}
        actionButton={
          <Link href="/people/create" className="inline-flex cursor-pointer">
            <AddButton label="Add Person" />
          </Link>
        }
        columns={columns}
        rows={rows}
        emptyText="No people found."
      />
    </div>
  );
}
