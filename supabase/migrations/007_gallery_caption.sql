-- Optional caption on gallery posts; posts persist across days (no day_key filter on fetch).
alter table gif_submissions
  add column if not exists caption text;

comment on column gif_submissions.caption is 'Optional one-line caption (max ~80 chars, enforced in app).';
