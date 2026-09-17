-- DB-RLS-BASE: Row Level Security 정책
-- REQ-FUNC-044, REQ-NF-013

-- RLS 활성화
alter table public.user_profile enable row level security;
alter table public.mate_post enable row level security;
alter table public.mate_application enable row level security;
alter table public.user_block enable row level security;
alter table public.report enable row level security;
alter table public.outbound_url_setting enable row level security;

-- 1. USER_PROFILE — 본인 프로필만 조회/수정
create policy "Users can view their own profile"
  on public.user_profile for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.user_profile for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.user_profile for insert
  with check (auth.uid() = user_id);

-- 2. MATE_POST — 공개글은 누구나 조회, 본인만 수정/삭제
create policy "Anyone can view open mate posts"
  on public.mate_post for select
  using (status = 'OPEN' or auth.uid() = user_id);

create policy "Users can update own mate post"
  on public.mate_post for update
  using (auth.uid() = user_id);

create policy "Users can insert mate post"
  on public.mate_post for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own mate post"
  on public.mate_post for delete
  using (auth.uid() = user_id);

-- 3. MATE_APPLICATION — 본인 요청과 모집글 작성자만 조회, 본인만 수정
create policy "Users can view own applications"
  on public.mate_application for select
  using (
    auth.uid() = user_id
    or auth.uid() = (select user_id from public.mate_post where id = mate_post_id)
  );

create policy "Users can insert application"
  on public.mate_application for insert
  with check (auth.uid() = user_id);

create policy "Users can update own application"
  on public.mate_application for update
  using (auth.uid() = user_id);

-- 4. USER_BLOCK — 본인 차단 관계만 조회, 본인만 수정/삭제
create policy "Users can view own blocks"
  on public.user_block for select
  using (auth.uid() = blocker_id or auth.uid() = blocked_id);

create policy "Users can insert block"
  on public.user_block for insert
  with check (auth.uid() = blocker_id);

create policy "Users can delete own block"
  on public.user_block for delete
  using (auth.uid() = blocker_id);

-- 5. REPORT — 본인 신고만 조회, Admin만 상태 변경
create policy "Users can view own reports"
  on public.report for select
  using (auth.uid() = reporter_id);

create policy "Users can insert report"
  on public.report for insert
  with check (auth.uid() = reporter_id);

-- Admin만 상태 변경 가능 (간단한 구현: admin = true를 auth.user_metadata에서 확인)
create policy "Only admin can update report status"
  on public.report for update
  using (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'admin' = 'true'
  );

-- 6. OUTBOUND_URL_SETTING — Admin만 조회/수정
create policy "Only admin can view outbound urls"
  on public.outbound_url_setting for select
  using (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'admin' = 'true'
  );

create policy "Only admin can insert outbound url"
  on public.outbound_url_setting for insert
  with check (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'admin' = 'true'
  );

create policy "Only admin can update outbound url"
  on public.outbound_url_setting for update
  using (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'admin' = 'true'
  );
