create schema if not exists "chatBot";

create table if not exists "chatBot".users (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"isBot" bool null default false,
	"platform" int2 not null,
	"platformId" varchar not null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "chatBot".users(id)
);

create table if not exists "chatBot".servers (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"platform" int2 not null,
	"platformId" varchar not null,
	"ownerId" uuid not null references "chatBot".users(id),
	"name" varchar not null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "chatBot".users(id)
);

create table if not exists "chatBot"."serverUsers" (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"userId" uuid not null references "chatBot".users(id),
	"serverId" uuid not null references "chatBot".servers(id),
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	unique("userId", "serverId")
);

create table if not exists "chatBot".commands (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    name varchar not null unique,
    description varchar null,
    type int2 not null default 1, -- 1: Chat input, 2: User, 3: Message, 4: primary Entry Point
    nsfw bool null default false,
    disabled bool null default false,
	"serverId" uuid null references "chatBot".servers(id),
    "callbackSource" varchar null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "chatBot".users(id)
);

create table if not exists "chatBot"."subGroupCommands" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    "commandId" uuid not null references "chatBot".commands(id),
    name varchar not null,
    description varchar null,
    disabled bool null default false,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "chatBot".users(id),
	unique("commandId", name)
);

-- https://discord.js.org/docs/packages/discord.js/main/CommandInteractionOptionResolver:Class
create table if not exists "chatBot"."commandOptions" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    "commandId" uuid not null references "chatBot".commands(id),
	"subGroupCommandId" uuid null references "chatBot"."subGroupCommands"(id),
    name varchar not null,
    description varchar null,
    type int2 not null CHECK (type <> 2), -- cannot be the value of a group command
    required bool null default false,
    disabled bool null default false,
	choices jsonb null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "chatBot".users(id),
	unique("commandId", "subGroupCommandId", name)
);

-- https://discord.js.org/docs/packages/discord.js/main/CommandInteractionOptionResolver:Class
create table if not exists "chatBot"."registeredAIModels" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
	category int2 not null, -- 1: LLM, 2: TTS, 3: SST
	"subCategory" int2 not null, -- depends on category
	"provider" varchar not null,
	"modelName" varchar not null,
	"isActive" bool null default true,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "chatBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "chatBot".users(id),
	unique("provider", "modelName")
);


--drop view "chatBot"."userSummary";
create or replace view 
	"chatBot"."userSummary"
as
	select 
		u."serialId",
		u.id,
		u."platformId",
		u.platform,
		u."isBot",
		u."createdAt",
		u."createdBy",
		u."updatedAt",
		u."updatedBy",
		case 
			when 
				count(distinct s.id) = 0 then '[]'::jsonb 
			else 
				jsonb_agg(
					distinct jsonb_build_object(
						'id', s."id",
						'name', s."name",
						'createdAt', replace(to_char(s."createdAt" at time zone 'utc', 'YYYY-MM-DDT HH:MI:SS.MSZ'), ' ', '') ,
						'updatedAt', s."updatedAt"
					)
				)
		end servers
	from 
		"chatBot".users u
	left join 
		"chatBot".servers s
	on 
		u."platformId" = s."platformId" 
	left join 
		"chatBot"."serverUsers" su
	on 
		u.id = su."userId"
	group by
		u."serialId",
		u.id,
		u."isBot",
		u."platformId",
		u.platform,
		u."createdAt",
		u."createdBy",
		u."updatedAt",
		u."updatedBy"
;

create user "" with password '';
grant usage on schema "chatBot" to "";
grant all privileges on all tables in schema "chatBot" to "";


