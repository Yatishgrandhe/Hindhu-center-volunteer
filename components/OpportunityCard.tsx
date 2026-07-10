import Link from "next/link";
import { IconCalendar, IconPin, IconHours, IconUsers } from "@/components/Icons";
import { formatTimeRange, formatHours } from "@/lib/utils";
import { opportunityImage } from "@/lib/opportunityImage";
import type { Opportunity } from "@/lib/database.types";

type Props = {
  o: Pick<
    Opportunity,
    "id" | "title" | "description" | "location" | "start_datetime" | "end_datetime" | "estimated_hours" | "slots"
  >;
  href: string;
  joined?: boolean;
  remaining?: number;
};

export function OpportunityCard({ o, href, joined, remaining }: Props) {
  const full = remaining !== undefined && remaining <= 0 && !joined;
  return (
    <Link href={href} className="card card-hover opp-card has-media">
      <div className="opp-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={opportunityImage(o)} alt="" loading="lazy" decoding="async" width={760} height={428} />
        <span className="badge badge-open">Open</span>
        {joined && <span className="badge badge-approved badge-joined">You&apos;re in</span>}
      </div>
      <div className="opp-body">
        <h3 className="opp-title">{o.title}</h3>
        {o.description && <p className="opp-desc">{o.description}</p>}
        <div className="meta" style={{ flexDirection: "column", gap: "0.4rem", alignItems: "flex-start" }}>
          <span className="meta-item"><IconCalendar /> {formatTimeRange(o.start_datetime, o.end_datetime)}</span>
          {o.location && <span className="meta-item"><IconPin /> {o.location}</span>}
          <span className="meta-item"><IconHours /> {formatHours(o.estimated_hours)} hrs</span>
        </div>
        <div className="opp-foot">
          <span className={`slots-left ${full ? "full" : ""}`}>
            <IconUsers width={14} height={14} style={{ verticalAlign: "-2px", marginRight: 4 }} />
            {remaining === undefined
              ? `${o.slots} spots`
              : full
                ? "Full"
                : `${remaining} of ${o.slots} spots left`}
          </span>
          <span style={{ color: "var(--saffron-deep)", fontWeight: 600, fontSize: "0.88rem" }}>View →</span>
        </div>
      </div>
    </Link>
  );
}
