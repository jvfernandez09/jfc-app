"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { loginAction, AuthState } from "@/app/actions/auth";

const initialState: AuthState = { error: "" };

export default function LoginForm() {
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction] = React.useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.error) emailRef.current?.focus();
  }, [state.error]);

  const emailClass = `ui-input ${state.error ? "ui-input-error" : ""}`;

  return (
    <AuthLayout>
      <AuthCard>
        <form action={formAction} className="space-y-6">
          <div>
            <label className="ui-label">Email</label>
            <input ref={emailRef} name="email" type="email" className={emailClass} required />
            {state.error && <p className="ui-error-text">{state.error}</p>}
          </div>

          <div>
            <label className="ui-label">Password</label>
            <input name="password" type="password" className="ui-input" required />
          </div>

          <div className="flex items-center gap-3">
            <input id="remember" type="checkbox" className="ui-checkbox" />
            <label htmlFor="remember" className="text-lg text-gray-700">
              Remember me
            </label>
          </div>

          <div className="flex items-center justify-end gap-6 pt-2">
            <button type="submit" className="ui-button-primary">
              LOG IN
            </button>
          </div>

          <div className="text-right">
            <Link href="/register" className="ui-link text-sm">
              Not registered? Create account
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
