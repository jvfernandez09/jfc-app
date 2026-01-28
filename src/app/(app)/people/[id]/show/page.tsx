import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersonShowData } from "@/app/actions/people";
import AddPersonTaskForm from "./AddPersonTaskForm";
import PersonShowTitle from "./PersonShowTitle";
import StatusPill from "@/components/ui/StatusPill";
import DetailRow from "@/components/ui/DetailRow";

export default async function PersonShowPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const data = await getPersonShowData(id);

  if (!data) notFound();

  const { person, tasks } = data;

  return (
    <>   <PersonShowTitle
      firstName={person.firstName}
      lastName={person.lastName}
    />
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Person Details
              </h2>

              <div className="flex items-center gap-3">
                <Link
                  href="/people"
                  className="text-sm font-medium text-gray-600 hover:underline"
                >
                  Back
                </Link>

                <Link
                  href={`/people/${person.id}/edit`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <DetailRow
                label="Name"
                value={`${person.lastName}, ${person.firstName}`}
              />
              <DetailRow label="Email" value={person.email} />
              <DetailRow label="Phone" value={person.phone} />
              <DetailRow label="Business" value={person.businessName} />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Add Task</h2>

            <div className="mt-4">
              <AddPersonTaskForm personId={person.id} />
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
                      <p className="mt-1 text-sm text-gray-600">{t.description}</p>
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
