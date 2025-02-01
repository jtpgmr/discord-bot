create schema if not exists "discordBot";

create table if not exists "discordBot".users (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"discordId" varchar not null,
	"isBot" bool null default false,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id)
);

create table if not exists "discordBot".guilds (
	"serialId" int4 generated always as identity primary key,
	id uuid not null unique,
	"discordId" varchar not null,
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
    "callbackSource" varchar null,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id)
);

-- https://discord.js.org/docs/packages/discord.js/main/CommandInteractionOptionResolver:Class
create table if not exists "discordBot"."commandOptions" (
    "serialId" int4 generated always as identity primary key,
    id uuid not null unique,
    "commandId" uuid not null references "discordBot".commands(id),
    name varchar not null,
    description varchar null,
    type int2 not null,
    required bool null default false,
    disabled bool null default false,
	"createdAt" timestamptz not null default now(),
	"createdBy" uuid not null references "discordBot".users(id),
	"updatedAt" timestamptz null,
	"updatedBy" uuid null references "discordBot".users(id),
	unique("commandId", name)
);



create user "" with password '';
grant usage on schema "discordBot" to "";
grant all privileges on all tables in schema "discordBot" to "";


