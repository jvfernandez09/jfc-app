"use client";

import React from "react";
import {
  ProfileState,
  PasswordState,
  updateProfileAction,
  updatePasswordAction,
} from "@/app/actions/profile";
import DeleteAccountModal from "./DeleteAccountModal";

const initialProfileState: ProfileState = {
  success: false,
  message: "",
};

const initialPasswordState: PasswordState = {
  success: false,
  message: "",
};

type Props = {
  initialName: string;
  initialEmail: string;
};

export default function ProfilePageClient({ initialName, initialEmail }: Props) {
  const inputClass =
    "mt-1 block w-full h-[42px] rounded-md border border-gray-300 px-3 text-sm shadow-sm " +
    "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  const fieldWrapClass = "w-full sm:w-[576px]";

  const [profileState, profileFormAction, profilePending] = React.useActionState(
    updateProfileAction,
    initialProfileState
  );

  const [passwordState, passwordFormAction, passwordPending] =
    React.useActionState(updatePasswordAction, initialPasswordState);

  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);

  // ✅ delete modal state
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string>(""); // optional
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteConfirm = async (password: string) => {
    try {
      setDeleteError("");
      setIsDeleting(true);

      // ✅ Later: call deleteAccountAction(password)
      console.log("Deleting account with password:", password);

      setDeleteOpen(false);
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : "Unable to delete account."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
        <h2 className="text-lg font-medium text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your account&apos;s profile information and email address.
        </p>

        <form action={profileFormAction} className="mt-6 space-y-6">
          <div className={fieldWrapClass}>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className={fieldWrapClass}>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={profilePending}
              className="inline-flex h-9 items-center rounded-md bg-gray-900 px-5 text-xs font-semibold tracking-widest text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {profilePending ? "SAVING..." : "SAVE"}
            </button>

            {profileState.message && (
              <p
                className={
                  "text-xs " +
                  (profileState.success ? "text-green-600" : "text-red-600")
                }
              >
                {profileState.message}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
        <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
        <p className="mt-1 text-sm text-gray-600">
          Ensure your account is using a long, random password to stay secure.
        </p>

        <form action={passwordFormAction} className="mt-6 space-y-6">
          <div className={fieldWrapClass}>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              className={inputClass}
            />

            {passwordState.errors?.currentPassword && (
              <p className="mt-1 text-xs text-red-600">
                {passwordState.errors.currentPassword}
              </p>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              className={inputClass}
            />

            {passwordState.errors?.newPassword && (
              <p className="mt-1 text-xs text-red-600">
                {passwordState.errors.newPassword}
              </p>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className={inputClass}
            />

            {passwordState.errors?.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {passwordState.errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={passwordPending}
              className="inline-flex h-9 items-center rounded-md bg-gray-900 px-5 text-xs font-semibold tracking-widest text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {passwordPending ? "SAVING..." : "SAVE"}
            </button>

            {passwordState.message && (
              <p
                className={
                  "text-xs " +
                  (passwordState.success ? "text-green-600" : "text-red-600")
                }
              >
                {passwordState.message}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
        <div className="max-w-xl">
          <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
          <p className="mt-1 text-sm text-gray-600">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </p>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-5 inline-flex h-9 items-center rounded-md bg-red-600 px-5 text-xs font-semibold tracking-widest text-white hover:bg-red-700"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>

      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        errorMessage={deleteError}
      />
    </div>
  );
}
