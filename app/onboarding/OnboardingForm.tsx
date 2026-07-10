"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { completeOnboarding, type OnboardingState } from "./actions";
import { ageFromDob } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-lg btn-block" disabled={pending}>
      {pending ? <span className="spinner" /> : null}
      {pending ? "Saving…" : "Complete profile & continue"}
    </button>
  );
}

export function OnboardingForm({
  email,
  defaultName,
}: {
  email: string;
  defaultName: string;
}) {
  const [state, action] = useActionState<OnboardingState, FormData>(
    completeOnboarding,
    { error: null }
  );
  const [dob, setDob] = useState("");
  const age = ageFromDob(dob || null);
  const minor = age !== null && age < 18;

  return (
    <form action={action}>
      {state.error && <div className="alert alert-error">{state.error}</div>}

      <div className="form-grid">
        <div className="field col-span-2">
          <label htmlFor="full_name">Full name <span className="req">*</span></label>
          <input id="full_name" name="full_name" className="input" defaultValue={defaultName} required autoComplete="name" />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" className="input" value={email} disabled />
          <span className="hint">From your Google account</span>
        </div>

        <div className="field">
          <label htmlFor="phone">Phone number <span className="req">*</span></label>
          <input id="phone" name="phone" className="input" type="tel" placeholder="(704) 555-0123" required autoComplete="tel" />
        </div>

        <div className="field">
          <label htmlFor="emergency_contact_name">Emergency contact name <span className="req">*</span></label>
          <input id="emergency_contact_name" name="emergency_contact_name" className="input" required />
        </div>

        <div className="field">
          <label htmlFor="emergency_contact_phone">Emergency contact phone <span className="req">*</span></label>
          <input id="emergency_contact_phone" name="emergency_contact_phone" className="input" type="tel" required />
        </div>

        <div className="field">
          <label htmlFor="date_of_birth">Date of birth <span className="req">*</span></label>
          <input id="date_of_birth" name="date_of_birth" className="input" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
        </div>

        <div className="field">
          <label htmlFor="tshirt_size">T-shirt size <span className="hint" style={{ fontWeight: 400 }}>(optional)</span></label>
          <select id="tshirt_size" name="tshirt_size" className="select" defaultValue="">
            <option value="">Select…</option>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {minor && (
          <>
            <div className="col-span-2">
              <div className="alert alert-info mb-0" style={{ marginBottom: "1rem" }}>
                Because this volunteer is under 18, a parent or guardian&apos;s
                details are required.
              </div>
            </div>
            <div className="field">
              <label htmlFor="guardian_name">Parent / guardian name <span className="req">*</span></label>
              <input id="guardian_name" name="guardian_name" className="input" required={minor} />
            </div>
            <div className="field">
              <label htmlFor="guardian_phone">Parent / guardian phone <span className="req">*</span></label>
              <input id="guardian_phone" name="guardian_phone" className="input" type="tel" required={minor} />
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: "0.6rem" }}>
        <SubmitButton />
      </div>
    </form>
  );
}
