"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/AlertMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  updatePersonAction,
  deletePersonAction,
  type BusinessOption,
  type TagOption,
  type PersonEditData,
  type UpdatePeopleState,
} from "@/app/actions/people";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

type Props = {
  person: PersonEditData;
  businesses: BusinessOption[];
  tags: TagOption[];
};

const initialState: UpdatePeopleState = {
  success: false,
  message: "",
  errors: {},
};

export default function EditPersonForm({ person, businesses, tags }: Props) {
  const router = useRouter();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(`Edit Person: ${person.firstName} ${person.lastName}`);
    return () => setTitle(null);
  }, [person.firstName, person.lastName, setTitle]);

  const boundUpdate = updatePersonAction.bind(null, person.id);
  const [state, updateAction, isUpdating] = useActionState(
    boundUpdate,
    initialState
  );

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const errorMsg =
    state?.errors?.firstName ||
    state?.errors?.lastName ||
    state?.errors?.email ||
    (!state.success ? state.message : "");

  useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "peopleToast",
        JSON.stringify({
          message: state.message,
          createdAt: Date.now(),
        })
      );
      router.push("/people");
    }
  }, [state.success, state.message, router]);

  const selectedTagIds = useMemo(() => new Set(person.tagIds), [person.tagIds]);

  const confirmDelete = () => {
    startDelete(async () => {
      sessionStorage.setItem(
        "peopleToast",
        JSON.stringify({
          message: `Deleted ${person.firstName} ${person.lastName}.`,
          createdAt: Date.now(),
        })
      );

      await deletePersonAction(person.id);

      setOpenDeleteModal(false);
      router.push("/people");
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mt-4">
        <AlertMessage
          variant="error"
          title={errorMsg ? "Error!" : undefined}
          message={errorMsg}
        />
      </div>

      <form action={updateAction} className="mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block font-medium text-gray-700">First Name</label>
            <input
              name="firstName"
              type="text"
              defaultValue={person.firstName}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Last Name</label>
            <input
              name="lastName"
              type="text"
              defaultValue={person.lastName}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="text"
              defaultValue={person.email ?? ""}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              type="text"
              defaultValue={person.phone ?? ""}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Business</label>
            <select
              name="businessId"
              defaultValue={person.businessId ?? ""}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">-- None --</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Tags</label>

            <div className="mt-2 space-y-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags found.</p>
              ) : (
                tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 text-sm text-gray-800"
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={tag.id}
                      defaultChecked={selectedTagIds.has(tag.id)}
                    />
                    {tag.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/people")}
            className="inline-flex items-center rounded-full bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Person"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-start">
          <button
            type="button"
            onClick={() => setOpenDeleteModal(true)}
            disabled={isDeleting}
            className="inline-flex items-center rounded-full bg-red-500 px-6 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Person"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={openDeleteModal}
        title="Delete Person"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
