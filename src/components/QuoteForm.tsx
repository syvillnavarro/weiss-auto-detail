import { useState, type FormEvent } from "react";
import { business, formatPrice, groupLabels, packages, type PackageGroup } from "../data/site";

type Props = {
  service: string;
  onServiceChange: (id: string) => void;
};

const groups: PackageGroup[] = ["exterior", "interior", "ceramic"];

export function QuoteForm({ service, onServiceChange }: Props) {
  const [contactMethod, setContactMethod] = useState<"phone" | "email">("phone");
  const [result, setResult] = useState<null | { name: string; service: string }>(null);

  const today = new Date().toISOString().slice(0, 10);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const chosen = packages.find((p) => p.id === data.get("service"));
    setResult({ name: String(data.get("name") || "").trim(), service: chosen?.name ?? "Not sure yet" });
  };

  if (result) {
    return (
      <div className="form-result" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="label">Demo only</p>
        <h3>Nothing was sent.</h3>
        <p>
          This is a design concept, so the form did not contact Weiss Auto Detail or book anything. On the
          live site, {result.name || "you"} would get a confirmation that the request for{" "}
          <strong>{result.service}</strong> arrived, and Weiss would reply to confirm a time.
        </p>
        <p>
          To reach Weiss today, call <a href={business.phoneHref}>{business.phone}</a> or email{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setResult(null)}>
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={submit} noValidate>
      <p className="form-note">Concept form. Submitting shows a preview and sends nothing.</p>
      <div className="field">
        <label htmlFor="q-name">Name</label>
        <input id="q-name" name="name" autoComplete="name" required />
      </div>

      <fieldset className="field">
        <legend>Best way to reach you</legend>
        <div className="segmented">
          {(["phone", "email"] as const).map((m) => (
            <label key={m}>
              <input
                type="radio"
                name="contactMethod"
                value={m}
                checked={contactMethod === m}
                onChange={() => setContactMethod(m)}
              />
              <span>{m === "phone" ? "Phone" : "Email"}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="q-contact">{contactMethod === "phone" ? "Phone number" : "Email address"}</label>
        <input
          id="q-contact"
          key={contactMethod}
          name="contact"
          type={contactMethod === "phone" ? "tel" : "email"}
          autoComplete={contactMethod === "phone" ? "tel" : "email"}
          inputMode={contactMethod === "phone" ? "tel" : "email"}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="q-vehicle">Vehicle year, make and model</label>
        <input id="q-vehicle" name="vehicle" placeholder="e.g. 2019 Ford F-150" required />
      </div>

      <div className="field">
        <label htmlFor="q-service">Service</label>
        <select id="q-service" name="service" value={service} onChange={(e) => onServiceChange(e.target.value)}>
          <option value="">Not sure yet</option>
          {groups.map((g) => (
            <optgroup key={g} label={groupLabels[g]}>
              {packages
                .filter((p) => p.group === g)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatPrice(p.price)})
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="q-date">Preferred date</label>
        <input id="q-date" name="date" type="date" min={today} />
        <p className="hint">A request only. Weiss confirms the actual time.</p>
      </div>

      <div className="field">
        <label htmlFor="q-message">
          Anything we should know? <span className="optional">Optional</span>
        </label>
        <textarea id="q-message" name="message" rows={4} />
      </div>

      <button type="submit" className="btn btn-dark btn-wide">
        Preview my request
      </button>
    </form>
  );
}
