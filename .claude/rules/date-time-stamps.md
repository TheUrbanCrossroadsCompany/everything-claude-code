# Date-time stamp requirement

Owner rule for every agent (Claude, Codex, and others) and every person working in this repository.
Adopted 2026-10-12 05:31 UTC.

Every document you create or update must carry a record block at the top. That includes notes,
handoffs, plans, reports, decision records, meeting notes, and session summaries.

| Field | Format |
|---|---|
| Version | `v1`, `v2`, … Increase it on every substantive change. |
| Issued / updated | `YYYY-MM-DD HH:MM UTC`, taken from the system clock (`date -u '+%Y-%m-%d %H:%M UTC'`). Never estimate it. |
| Prepared by | The agent or person who wrote it, and who it was prepared for. |

It must also end with a revision history:

| Version | Issued (UTC) | Change |
|---|---|---|
| v1 | YYYY-MM-DD HH:MM | What was created or changed. |

- Add a new row for every version. Never edit or delete past rows.
- Always use UTC, so times line up across people, machines, and time zones.
- Commits, pull requests, and CI runs already carry Git and GitHub timestamps. Code files don't need
  stamps.
