# Student results and teacher access

The game pages use the configured Supabase project in `results-api.js`. This file contains only the public project URL and publishable key. Never add a database password, secret API key, service-role key, or teacher password to the repository.

## Database prerequisites

The owner created `public.student_results` in the Supabase SQL editor with columns `id`, `student_name`, `class_section`, `game`, `exercise`, `score`, `total`, and a server-default `completed_at` timestamp. Sections are limited to CE2 A and CE2 D. Row level security is enabled.

Anonymous and authenticated users have insert permission only on the submission fields; they cannot set the timestamp. Authenticated users have SELECT permission with a policy restricted to teacher UID `eb3a0fce-6c14-48df-bdd5-0b1bcdbee4c9`. Anonymous users have no SELECT permission. No client UPDATE or DELETE permission is granted. The authorized teacher account was created in Supabase Authentication.

Student submissions do not require accounts. The public submission endpoint can receive fabricated submissions from anyone with the public configuration; these are classroom practice records, not verified exam results. If restricted submission access is needed later, add student authentication or a server-validated class code.

## Local preview before Netlify

From this repository run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/` and finish any game/exercise. Enter a test name and select CE2 A or CE2 D, then submit. A success message appears only after Supabase accepts the request. Failed requests can be retried using the same completion ID, without creating another result. Restarting or switching exercises clears the previous student's form. No student details are stored in browser storage.

Open `http://localhost:8000/teacher.html` and sign in with the teacher account's email and private password. Verify the submitted record, section grouping, name sorting, and CSV download. Test another browser/device against the same project to verify central storage. Only the owner can remove test rows through the Supabase dashboard; the website cannot delete them.

The teacher page is accessible as a URL but contains no results before sign-in. Supabase's database policies protect records independently of the page's UI. Sessions are held only in memory and are cleared on reload or sign-out. Large result sets are loaded in pages. Display timestamps use Asia/Qatar (UTC+03:00); CSV timestamps explicitly use UTC. CSV values are quoted and protected against spreadsheet formula injection. Result scores preserve the existing games' retry-friendly scoring: questions eventually solved, not first-attempt accuracy.

## Validation and deployment status

Browser tests exercised all 11 game modes, completion forms, failed submission retries, duplicate acknowledgment, teacher login gating, alphabetical groups, safe text rendering, CSV export, and logout. The submission and teacher tests used a mock API. The execution environment blocked the Supabase domain, so live database rules, credentials, and cross-device behavior still require the local test above.

The results integration has not been pushed or deployed, to avoid triggering automatic Netlify builds before the owner's local test. PR #4 was already merged before this work; the earlier activity commit is on its existing source branch. No new branch, repository, PR, environment, or merge was created.
