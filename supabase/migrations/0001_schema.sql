-- DB-SCHEMA-BASE: 6개 테이블 스키마
-- REQ-FUNC-029, 031, 034, 039, 040, 077

-- 1. USER_PROFILE — 사용자 프로필 (REQ-FUNC-029)
create table public.user_profile (
  id uuid primary key default gen_random_uuid(),
  -- auth.users.id와 1:1로 연결하되, 명시적 FK는 만들지 않음 (Supabase Auth 구조)
  user_id uuid not null unique default auth.uid(),
  nickname text not null unique,
  age_group text not null check (age_group in ('10s', '20s', '30s', '40s', '50s')),
  gender text check (gender is null or gender in ('male', 'female')),
  travel_style text[] not null default '{}',
  bio text,
  verified_adult boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 2. MATE_POST — 동행 모집글 (REQ-FUNC-031)
create table public.mate_post (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profile(id) on delete cascade,
  title text not null,
  country text not null,
  region text not null,
  start_date date not null,
  end_date date not null,
  recruitment_count integer not null check (recruitment_count > 0),
  preferred_conditions text,
  travel_style text[] not null default '{}',
  description text not null,
  safety_agreed boolean not null default false,
  status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 3. MATE_APPLICATION — 참가 요청 (REQ-FUNC-034)
create table public.mate_application (
  id uuid primary key default gen_random_uuid(),
  mate_post_id uuid not null references public.mate_post(id) on delete cascade,
  user_id uuid not null references public.user_profile(id) on delete cascade,
  message text not null check (length(message) <= 500),
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 4. USER_BLOCK — 사용자 차단 (REQ-FUNC-040)
create table public.user_block (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.user_profile(id) on delete cascade,
  blocked_id uuid not null references public.user_profile(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  check (blocker_id != blocked_id),
  unique(blocker_id, blocked_id)
);

-- 5. REPORT — 신고 (REQ-FUNC-039)
create table public.report (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'user', 'application')),
  target_id uuid not null,
  reporter_id uuid not null references public.user_profile(id) on delete cascade,
  reason text not null,
  description text,
  status text not null default 'PENDING' check (status in ('PENDING', 'RESOLVED')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 6. OUTBOUND_URL_SETTING — 관리자 설정 외부 URL (REQ-FUNC-077)
create table public.outbound_url_setting (
  id uuid primary key default gen_random_uuid(),
  url_type text not null check (url_type in ('flight', 'hotel')),
  url text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  check (url like 'https://%')
);

-- 인덱스: 조회 성능 최적화
create index idx_user_profile_user_id on public.user_profile(user_id);
create index idx_mate_post_user_id on public.mate_post(user_id);
create index idx_mate_post_status on public.mate_post(status);
create index idx_mate_application_mate_post_id on public.mate_application(mate_post_id);
create index idx_mate_application_user_id on public.mate_application(user_id);
create index idx_mate_application_status on public.mate_application(status);
create index idx_user_block_blocker_id on public.user_block(blocker_id);
create index idx_user_block_blocked_id on public.user_block(blocked_id);
create index idx_report_target_id on public.report(target_id);
create index idx_report_reporter_id on public.report(reporter_id);
create index idx_report_status on public.report(status);
