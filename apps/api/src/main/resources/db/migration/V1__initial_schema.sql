create table users (
  id uuid primary key,
  email varchar(320) not null unique,
  created_at timestamptz not null,
  last_login_at timestamptz
);

create table tags (
  id uuid primary key,
  public_id varchar(64) not null unique,
  owner_user_id uuid not null references users (id) on delete cascade,
  display_name varchar(120) not null,
  status varchar(32) not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index idx_tags_owner_user_id on tags (owner_user_id);

create table scan_events (
  id uuid primary key,
  tag_id uuid not null references tags (id) on delete cascade,
  scanned_at timestamptz not null,
  ownership_context varchar(32) not null,
  ip_hash varchar(255),
  user_agent text,
  accept_language varchar(255),
  referrer text,
  country_code varchar(8),
  region_code varchar(32),
  city_approx varchar(128),
  message_started_at timestamptz,
  message_submitted_at timestamptz
);

create index idx_scan_events_tag_id on scan_events (tag_id);
create index idx_scan_events_scanned_at on scan_events (scanned_at);

create table sighting_messages (
  id uuid primary key,
  tag_id uuid not null references tags (id) on delete cascade,
  scan_event_id uuid not null references scan_events (id) on delete cascade,
  message text not null,
  sender_contact_optional varchar(255),
  created_at timestamptz not null
);

create index idx_sighting_messages_tag_id on sighting_messages (tag_id);
create index idx_sighting_messages_scan_event_id on sighting_messages (scan_event_id);

create table magic_link_tokens (
  id uuid primary key,
  user_id uuid not null references users (id) on delete cascade,
  token_hash varchar(255) not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null
);

create index idx_magic_link_tokens_user_id on magic_link_tokens (user_id);
create index idx_magic_link_tokens_expires_at on magic_link_tokens (expires_at);
