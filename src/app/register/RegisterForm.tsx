"use client";

import React from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { registerAction, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: "" };

export default function RegisterForm() {
  const [state, formAction] = React.useActionState(registerAction, initialState);

  return (
    <AuthLayout>
      <AuthCard>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="ui-label">Name</label>
            <input name="name" type="text" className="ui-input" required />
          </div>

          <div>
            <label className="ui-label">Email</label>
            <input name="email" type="email" className="ui-input" required />
          </div>

          <div>
            <label className="ui-label">Password</label>
            <input
              name="password"
              type="password"
              className="ui-input"
              required
            />
          </div>

          <div>
            <label className="ui-label">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="ui-input"
              required
            />
          </div>

          {state.error ? <p className="ui-error-text">{state.error}</p> : null}

          <div className="flex items-center justify-end gap-4 pt-2">
            <Link href="/login" className="ui-link text-sm">
              Already registered?
            </Link>

            <button type="submit" className="ui-button-primary text-sm">
              REGISTER
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
