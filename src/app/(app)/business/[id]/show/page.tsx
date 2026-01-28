import Link from "next/link";
import { notFound } from "next/navigation";
import { getBusinessShowData } from "@/app/actions/business";
import AddBusinessTaskForm from "./AddBusinessTaskForm";
import BusinessShowTitle from "./BusinessShowTitle";
import DetailRow from "@/components/ui/DetailRow";
import StatusPill from "@/components/ui/StatusPill";

export default async function BusinessShowPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const data = await getBusinessShowData(id);
  if (!data) notFound();

  const { business, tasks } = data;

  return (
    <>
      <BusinessShowTitle name={business.name} />
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Business Details
              </h2>

              <div className="flex items-center gap-3">
                <Link
                  href="/business"
                  className="text-sm font-medium text-gray-600 hover:underline"
                >
                  Back
                </Link>

                <Link
                  href={`/business/${business.id}/edit`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <DetailRow label="Name" value={business.name} />
              <DetailRow
                label="Contact Email"
                value={business.contact_email}
              />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Add Task
            </h2>

            <div className="mt-4">
              <AddBusinessTaskForm businessId={business.id} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Tasks</h2>
            <p className="text-sm text-gray-500">{tasks.length} total</p>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              No tasks assigned yet.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {t.title}
                      </p>
                      <StatusPill done={t.isDone} />
                    </div>

                    {t.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {t.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Created: {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>

  );
}
