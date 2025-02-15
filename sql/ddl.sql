create schema if not exists "discordBot";

create table if not exists "discordBot".users (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"isBot" bool null default false,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id)
);


create table if not exists "discordBot"."platformUser" (
	 "serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"userId" uuid not null references "discordBot".users(id),
	"platformId" varchar not null,
	"platform" int2 not null, -- 1: Discord, 2: Slack
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	unique("userId", "platformId", "platform")
)

create table if not exists "discordBot".servers (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"platform" int2 not null,
	"ownerId" uuid not null references "discordBot".users(id),
	"name" varchar not null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id)
);

create table if not exists "discordBot".commands (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    name varchar not null unique,
    description varchar null,
    type int2 not null default 1, -- 1: Chat input, 2: User, 3: Message, 4: primary Entry Point
    nsfw bool null default false,
    disabled bool null default false,
	"serverId" uuid null references "discordBot".servers(id),
    "callbackSource" varchar null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id)
);

create table if not exists "discordBot"."subGroupCommands" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    "commandId" uuid not null references "discordBot".commands(id),
    name varchar not null,
    description varchar null,
    disabled bool null default false,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id),
	unique("commandId", name)
);

-- https://discord.js.org/docs/packages/discord.js/main/CommandInteractionOptionResolver:Class
create table if not exists "discordBot"."commandOptions" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    "commandId" uuid not null references "discordBot".commands(id),
	"subGroupCommandId" uuid null references "discordBot"."subGroupCommands"(id),
    name varchar not null,
    description varchar null,
    type int2 not null CHECK (type <> 2), -- cannot be the value of a group command
    required bool null default false,
    disabled bool null default false,
	choices jsonb null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id),
	unique("commandId", "subGroupCommandId", name)
);

-- https://discord.js.org/docs/packages/discord.js/main/CommandInteractionOptionResolver:Class
create table if not exists "discordBot"."registeredAIModels" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
	category int2 not null, -- 1: LLM, 2: TTS, 3: SST
	"subCategory" int2 not null, -- depends on category
	"provider" varchar not null,
	"modelName" varchar not null,
	"isActive" bool null default true,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id),
	unique("provider", "modelName")
);


create user "" with password '';
grant usage on schema "discordBot" to "";
grant all privileges on all tables in schema "discordBot" to "";


