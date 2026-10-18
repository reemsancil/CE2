-- Run once in the Supabase SQL Editor used by the CP, CE2 and CM1 websites.
-- Only the two teacher-confirmed identities below are combined.
BEGIN;

-- Preserve the affected rows before changing names or combining certificates.
CREATE TABLE IF NOT EXISTS public.student_name_merge_results_backup
AS SELECT r.*, now() AS backed_up_at FROM public.student_results r WITH NO DATA;
ALTER TABLE public.student_name_merge_results_backup ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.student_name_merge_results_backup FROM anon, authenticated;
CREATE TABLE IF NOT EXISTS public.student_name_merge_certificates_backup
AS SELECT c.*, now() AS backed_up_at FROM public.school_certificates c WITH NO DATA;
ALTER TABLE public.student_name_merge_certificates_backup ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.student_name_merge_certificates_backup FROM anon, authenticated;

DO $$
DECLARE
  pair record;
  old_certificate record;
  existing_id uuid;
BEGIN
  -- Prevent new submissions or gifts from arriving halfway through this merge.
  LOCK TABLE public.student_results, public.school_certificates IN SHARE ROW EXCLUSIVE MODE;
  FOR pair IN SELECT * FROM (VALUES
    ('CE2 D', 'soufia', 'Sofia'),
    ('CM1 D', 'ziad mabrouk', 'Ziad')
  ) AS confirmed(section, old_key, registered_name)
  LOOP
    INSERT INTO public.student_name_merge_results_backup
    SELECT r.*, now() FROM public.student_results r
    WHERE r.class_section=pair.section
      AND public.school_student_key(r.student_name) IN
          (pair.old_key, public.school_student_key(pair.registered_name));
    INSERT INTO public.student_name_merge_certificates_backup
    SELECT c.*, now() FROM public.school_certificates c
    WHERE c.class_section=pair.section
      AND (c.student_key IN (pair.old_key, public.school_student_key(pair.registered_name))
        OR public.school_student_key(c.student_name) IN
          (pair.old_key, public.school_student_key(pair.registered_name)));

    -- Keep every attempt, including scores, completion dates and record IDs.
    UPDATE public.student_results r SET student_name=pair.registered_name
    WHERE r.class_section=pair.section
      AND public.school_student_key(r.student_name) IN
          (pair.old_key, public.school_student_key(pair.registered_name));

    FOR old_certificate IN
      SELECT * FROM public.school_certificates c
      WHERE c.class_section=pair.section
        AND (c.student_key=pair.old_key
          OR public.school_student_key(c.student_name)=pair.old_key)
      ORDER BY c.awarded_at, c.id
    LOOP
      SELECT c.id INTO existing_id FROM public.school_certificates c
      WHERE c.class_level=old_certificate.class_level
        AND c.class_section=pair.section
        AND c.unit_id=old_certificate.unit_id
        AND c.student_key=public.school_student_key(pair.registered_name)
        AND c.id<>old_certificate.id;
      IF existing_id IS NOT NULL THEN
        UPDATE public.school_certificates c
        SET awarded_at=least(c.awarded_at,old_certificate.awarded_at),
            opened_at=least(c.opened_at,old_certificate.opened_at),
            student_name=pair.registered_name
        WHERE c.id=existing_id;
        -- The original remains in the restricted backup; its award is now combined.
        DELETE FROM public.school_certificates WHERE id=old_certificate.id;
      ELSE
        UPDATE public.school_certificates
        SET student_key=public.school_student_key(pair.registered_name),
            student_name=pair.registered_name
        WHERE id=old_certificate.id;
      END IF;
    END LOOP;
    UPDATE public.school_certificates c SET student_name=pair.registered_name
    WHERE c.class_section=pair.section
      AND c.student_key=public.school_student_key(pair.registered_name);
  END LOOP;
END $$;
COMMIT;

-- Check that no attempts remain under the old names (expected: no rows).
SELECT class_section, student_name, count(*) AS attempts
FROM public.student_results
WHERE (class_section='CE2 D' AND public.school_student_key(student_name)='soufia')
   OR (class_section='CM1 D' AND public.school_student_key(student_name)='ziad mabrouk')
GROUP BY class_section, student_name;
