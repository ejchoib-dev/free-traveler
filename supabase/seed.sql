-- DB-SEED-BASE: 개발용 샘플 데이터 (로컬 개발·E2E 테스트)
-- RLS는 유지하되, SESSION auth.uid로 설정해 insert가 가능하도록 함

-- 사용자 3명의 고정 UUID (개발용)
-- 실제 프로덕션에서는 삭제되어야 함
do $$
declare
  user1_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  user2_id uuid := '22222222-2222-2222-2222-222222222222'::uuid;
  user3_id uuid := '33333333-3333-3333-3333-333333333333'::uuid;
begin
  -- RLS 우회: 각 사용자로 세션 설정해 INSERT

  -- USER 1: 동행 모집글 작성자
  set session "auth.uid" = user1_id;
  insert into public.user_profile (user_id, nickname, age_group, gender, travel_style, bio, verified_adult)
  values (
    user1_id,
    'traveler_kim',
    '30s',
    'male',
    array['adventure', 'culture'],
    '서울에서 온 여행 좋아하는 엔지니어입니다.',
    true
  )
  on conflict (user_id) do nothing;

  -- USER 2: 동행 모집글 작성자
  set session "auth.uid" = user2_id;
  insert into public.user_profile (user_id, nickname, age_group, gender, travel_style, bio, verified_adult)
  values (
    user2_id,
    'explorer_lee',
    '20s',
    'female',
    array['food', 'nature'],
    '백패킹과 현지 음식을 좋아합니다.',
    true
  )
  on conflict (user_id) do nothing;

  -- USER 3: 신청자
  set session "auth.uid" = user3_id;
  insert into public.user_profile (user_id, nickname, age_group, gender, travel_style, bio, verified_adult)
  values (
    user3_id,
    'wanderer_park',
    '20s',
    'male',
    array['culture', 'history'],
    '역사와 건축 여행을 즐깁니다.',
    true
  )
  on conflict (user_id) do nothing;
end $$;

-- MATE_POST: 모집글 4개 (다양한 국가·날짜)
do $$
declare
  user1_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  user2_id uuid := '22222222-2222-2222-2222-222222222222'::uuid;
begin
  set session "auth.uid" = user1_id;

  -- Post 1: 일본 도쿄 (2026년 5월)
  insert into public.mate_post (
    user_id, title, country, region, start_date, end_date,
    recruitment_count, preferred_conditions, travel_style, description, safety_agreed, status
  ) values (
    user1_id,
    '도쿄 봄 벚꽃 여행 함께할 사람 찾습니다',
    'Japan',
    'Tokyo',
    '2026-05-01'::date,
    '2026-05-07'::date,
    2,
    '능동적이고 새로운 경험을 즐기는 분',
    array['adventure', 'culture'],
    '도쿄 벚꽃 시즌에 주요 관광지를 도는 여행입니다. 아키하바라, 센소지, 메이지 신궁 등을 함께 즐길 분을 찾고 있습니다.',
    true,
    'OPEN'
  );

  -- Post 2: 베트남 호치민 (2026년 6월)
  insert into public.mate_post (
    user_id, title, country, region, start_date, end_date,
    recruitment_count, preferred_conditions, travel_style, description, safety_agreed, status
  ) values (
    user1_id,
    '호치민·메콩 델타 현지 음식 투어',
    'Vietnam',
    'Ho Chi Minh',
    '2026-06-10'::date,
    '2026-06-20'::date,
    3,
    '음식에 관심 많고 현지 문화에 개방적인 분',
    array['food', 'culture'],
    '호치민 야시장, 쿠이딘 거리, 메콩 델타 생선 시장을 돌아다니며 현지 음식을 맛보는 투어입니다.',
    true,
    'OPEN'
  );

  set session "auth.uid" = user2_id;

  -- Post 3: 태국 방콕 (2026년 7월)
  insert into public.mate_post (
    user_id, title, country, region, start_date, end_date,
    recruitment_count, preferred_conditions, travel_style, description, safety_agreed, status
  ) values (
    user2_id,
    '방콕·치앙마이 사찰 트레킹',
    'Thailand',
    'Bangkok',
    '2026-07-05'::date,
    '2026-07-15'::date,
    2,
    '느린 속도로 여유 있게 여행하는 분',
    array['nature', 'culture'],
    '방콕의 왓 포·왓 아룬에서 시작해 치앙마이 산림 트레킹을 계획 중입니다. 명상과 자연을 함께합니다.',
    true,
    'OPEN'
  );

  -- Post 4: 스페인 바르셀로나 (2026년 8월, CLOSED 상태)
  insert into public.mate_post (
    user_id, title, country, region, start_date, end_date,
    recruitment_count, preferred_conditions, travel_style, description, safety_agreed, status
  ) values (
    user2_id,
    '바르셀로나 건축 여행 (마감)',
    'Spain',
    'Barcelona',
    '2026-08-01'::date,
    '2026-08-10'::date,
    2,
    '건축과 미술에 관심 있는 분',
    array['culture', 'history'],
    '가우디 건축물 투어, 고딕 쿼터, 피카소 미술관을 함께 둘러보려고 합니다. (마감)',
    true,
    'CLOSED'
  );
end $$;

-- MATE_APPLICATION: 신청 3개
do $$
declare
  user3_id uuid := '33333333-3333-3333-3333-333333333333'::uuid;
  post1_id uuid;
  post2_id uuid;
begin
  -- Post 1의 ID 조회 (도쿄 여행)
  select id into post1_id from public.mate_post
  where title = '도쿄 봄 벚꽃 여행 함께할 사람 찾습니다' limit 1;

  -- Post 2의 ID 조회 (호치민 여행)
  select id into post2_id from public.mate_post
  where title = '호치민·메콩 델타 현지 음식 투어' limit 1;

  set session "auth.uid" = user3_id;

  -- Application 1: 도쿄 여행에 신청
  if post1_id is not null then
    insert into public.mate_application (mate_post_id, user_id, message, status)
    values (
      post1_id,
      user3_id,
      '안녕하세요! 도쿄의 역사적 건축물들을 구경하고 싶어 지원합니다. 영어와 한국어를 사용할 수 있습니다.',
      'PENDING'
    );
  end if;

  -- Application 2: 호치민 여행에 신청 (APPROVED 상태)
  if post2_id is not null then
    insert into public.mate_application (mate_post_id, user_id, message, status)
    values (
      post2_id,
      user3_id,
      '저도 베트남 음식에 정말 관심이 많습니다. 함께해도 괜찮을까요?',
      'APPROVED'
    );
  end if;
end $$;

-- OUTBOUND_URL_SETTING: 항공사·호텔 외부 링크 설정
insert into public.outbound_url_setting (url_type, url)
values
  ('flight', 'https://www.skyscanner.co.kr/'),
  ('hotel', 'https://www.booking.com/')
on conflict do nothing;

-- 세션 초기화
reset session "auth.uid";
