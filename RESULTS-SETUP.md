# Central student results: setup required

The repository currently serves static HTML, CSS and JavaScript. It has no database, backend submission endpoint, or teacher authentication. Browser storage cannot collect results across devices. Submission storage and the teacher results screen are intentionally pending service configuration; no student names or results are stored in this repository or public pages.

Before implementation, provide either an existing school results API or a hosted database/backend (for example, Supabase), plus:

- The service URL and public client configuration, and the site's hosting URL.
- A teacher sign-in method and the teacher accounts allowed to read results.
- The permitted class sections and a student submission access method (school sign-in or a class access code validated by the backend).
- The school's retention period for student results.

The backend must validate submissions, restrict result reads to authenticated teachers, and keep administrator credentials on the server. A teacher password or a service-role key must never be embedded in the static site's JavaScript. Public database reads must be denied.

## Planned result flow

At the end of every game/exercise, show required student name and class section fields and a Submit result button. Record the name, section, game, exercise, score and total, and a server-generated completion timestamp. Keep the existing retry-friendly score and label it accordingly: it counts questions eventually solved, rather than first-attempt accuracy. Disable duplicate submissions for the same completion, report errors, and confirm success only after the central service accepts the result.

The authenticated teacher view will group results by section and sort student names alphabetically within each section. It will offer CSV download of those authorized results, including completion date/time with an explicit timezone. CSV cells must be escaped and protected against spreadsheet formula injection. Student names and results must appear only in that private teacher view, never on the public homepage, game pages, or repository.

Once the selected service and authentication are configured, implement and verify cross-device submission, unauthorized-read denial, alphabetical grouping, and CSV export on PR #4's existing branch.
