"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { FormState } from "./actions";

type Defaults = {
  title?: string;
  description?: string;
  location?: string;
  start_datetime?: string; // local datetime-local value
  end_datetime?: string;
  estimated_hours?: number;
  slots?: number;
  status?: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-lg" disabled={pending}>
      {pending ? <span className="spinner" /> : null}
      {pending ? "Saving…" : label}
    </button>
  );
}

export function OpportunityForm({
  action,
  defaults = {},
  submitLabel = "Create opportunity",
  showStatus = false,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Defaults;
  submitLabel?: string;
  showStatus?: boolean;
}) {
  const [state, formAction] = useActionState(action, { error: null });

  return (
    <form action={formAction}>
      {state.error && <div className="alert alert-error">{state.error}</div>}

      <div className="field">
        <label htmlFor="title">Title <span className="req">*</span></label>
        <input id="title" name="title" className="input" defaultValue={defaults.title} placeholder="Annadanam kitchen help" required />
      </div>

      <div className="field">
        <label htmlFor="description">What to do <span className="hint" style={{ fontWeight: 400 }}>(instructions for volunteers)</span></label>
        <textarea id="description" name="description" className="textarea" defaultValue={defaults.description} placeholder="Describe the tasks, what to wear, where to check in, who to ask for…" />
      </div>

      <div className="field">
        <label htmlFor="location">Location</label>
        <input id="location" name="location" className="input" defaultValue={defaults.location} placeholder="Main Temple Hall, 7400 City View Dr" />
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="start_datetime">Starts <span className="req">*</span></label>
          <input id="start_datetime" name="start_datetime" className="input" type="datetime-local" defaultValue={defaults.start_datetime} required />
        </div>
        <div className="field">
          <label htmlFor="end_datetime">Ends <span className="req">*</span></label>
          <input id="end_datetime" name="end_datetime" className="input" type="datetime-local" defaultValue={defaults.end_datetime} required />
        </div>
        <div className="field">
          <label htmlFor="estimated_hours">Estimated hours <span className="req">*</span></label>
          <input id="estimated_hours" name="estimated_hours" className="input" type="number" step="0.5" min="0" defaultValue={defaults.estimated_hours ?? 2} required />
          <span className="hint">Default hours credited on approval</span>
        </div>
        <div className="field">
          <label htmlFor="slots">Volunteer slots <span className="req">*</span></label>
          <input id="slots" name="slots" className="input" type="number" step="1" min="1" defaultValue={defaults.slots ?? 10} required />
        </div>
      </div>

      {showStatus && (
        <div className="field" style={{ maxWidth: 240 }}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" className="select" defaultValue={defaults.status ?? "open"}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="row gap wrap" style={{ marginTop: "1rem" }}>
        <SubmitButton label={submitLabel} />
        <Link href="/admin" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
