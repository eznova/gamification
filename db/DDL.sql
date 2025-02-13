-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.achievement_groups_id_seq;

CREATE SEQUENCE public.achievement_groups_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.achievement_groups_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.achievement_groups_id_seq TO postgres;

-- DROP SEQUENCE public.achievements_id_seq;

CREATE SEQUENCE public.achievements_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.achievements_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.achievements_id_seq TO postgres;

-- DROP SEQUENCE public.codes_id_seq;

CREATE SEQUENCE public.codes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.codes_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.codes_id_seq TO postgres;

-- DROP SEQUENCE public.departments_id_seq;

CREATE SEQUENCE public.departments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.departments_id_seq TO postgres;

-- DROP SEQUENCE public.grades_id_seq;

CREATE SEQUENCE public.grades_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.grades_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.grades_id_seq TO postgres;

-- DROP SEQUENCE public.graduations_id_seq;

CREATE SEQUENCE public.graduations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.graduations_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.graduations_id_seq TO postgres;

-- DROP SEQUENCE public.memes_id_seq;

CREATE SEQUENCE public.memes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.memes_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.memes_id_seq TO postgres;

-- DROP SEQUENCE public.news_id_seq;

CREATE SEQUENCE public.news_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.news_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.news_id_seq TO postgres;

-- DROP SEQUENCE public.news_likes_id_seq;

CREATE SEQUENCE public.news_likes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.news_likes_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.news_likes_id_seq TO postgres;

-- DROP SEQUENCE public.role_achievements_id_seq;

CREATE SEQUENCE public.role_achievements_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.role_achievements_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.role_achievements_id_seq TO postgres;

-- DROP SEQUENCE public.roles_id_seq;

CREATE SEQUENCE public.roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.roles_id_seq TO postgres;

-- DROP SEQUENCE public.rules_id_seq;

CREATE SEQUENCE public.rules_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.rules_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.rules_id_seq TO postgres;

-- DROP SEQUENCE public.shop_id_seq;

CREATE SEQUENCE public.shop_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.shop_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.shop_id_seq TO postgres;

-- DROP SEQUENCE public.tasks_id_seq;

CREATE SEQUENCE public.tasks_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.tasks_id_seq TO postgres;

-- DROP SEQUENCE public.teams_id_seq;

CREATE SEQUENCE public.teams_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.teams_id_seq TO postgres;

-- DROP SEQUENCE public.thanks_details_id_seq;

CREATE SEQUENCE public.thanks_details_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.thanks_details_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.thanks_details_id_seq TO postgres;

-- DROP SEQUENCE public.user_achievements_balance_id_seq;

CREATE SEQUENCE public.user_achievements_balance_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_achievements_balance_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_achievements_balance_id_seq TO postgres;

-- DROP SEQUENCE public.user_achievements_id_seq;

CREATE SEQUENCE public.user_achievements_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_achievements_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_achievements_id_seq TO postgres;

-- DROP SEQUENCE public.user_memes_id_seq;

CREATE SEQUENCE public.user_memes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_memes_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_memes_id_seq TO postgres;

-- DROP SEQUENCE public.user_purchases_id_seq;

CREATE SEQUENCE public.user_purchases_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_purchases_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_purchases_id_seq TO postgres;

-- DROP SEQUENCE public.user_roles_id_seq;

CREATE SEQUENCE public.user_roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_roles_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_roles_id_seq TO postgres;

-- DROP SEQUENCE public.user_tasks_id_seq;

CREATE SEQUENCE public.user_tasks_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_tasks_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_tasks_id_seq TO postgres;

-- DROP SEQUENCE public.user_teams_id_seq;

CREATE SEQUENCE public.user_teams_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.user_teams_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.user_teams_id_seq TO postgres;

-- DROP SEQUENCE public.users_id_seq;

CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.users_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.users_id_seq TO postgres;
-- public.achievement_groups definition

-- Drop table

-- DROP TABLE public.achievement_groups;

CREATE TABLE public.achievement_groups (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT achievement_groups_name_key UNIQUE (name),
	CONSTRAINT achievement_groups_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.achievement_groups OWNER TO postgres;
GRANT ALL ON TABLE public.achievement_groups TO postgres;


-- public.codes definition

-- Drop table

-- DROP TABLE public.codes;

CREATE TABLE public.codes (
	id serial4 NOT NULL,
	code_value varchar(50) NULL,
	code_is_used bool DEFAULT false NULL,
	CONSTRAINT codes_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.codes OWNER TO postgres;
GRANT ALL ON TABLE public.codes TO postgres;


-- public.departments definition

-- Drop table

-- DROP TABLE public.departments;

CREATE TABLE public.departments (
	id serial4 NOT NULL,
	department_name varchar(100) NOT NULL,
	CONSTRAINT departments_department_name_key UNIQUE (department_name),
	CONSTRAINT departments_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.departments OWNER TO postgres;
GRANT ALL ON TABLE public.departments TO postgres;


-- public.grades definition

-- Drop table

-- DROP TABLE public.grades;

CREATE TABLE public.grades (
	id serial4 NOT NULL,
	grade_name varchar(100) NOT NULL,
	CONSTRAINT grades_grade_name_key UNIQUE (grade_name),
	CONSTRAINT grades_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.grades OWNER TO postgres;
GRANT ALL ON TABLE public.grades TO postgres;


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles (
	id serial4 NOT NULL,
	role_name varchar(50) NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_role_name_key UNIQUE (role_name)
);

-- Permissions

ALTER TABLE public.roles OWNER TO postgres;
GRANT ALL ON TABLE public.roles TO postgres;


-- public.rules definition

-- Drop table

-- DROP TABLE public.rules;

CREATE TABLE public.rules (
	id serial4 NOT NULL,
	rule_name varchar(100) NOT NULL,
	rule_description text NULL,
	rule_type varchar(50) NULL,
	CONSTRAINT rules_pkey PRIMARY KEY (id),
	CONSTRAINT rules_rule_name_key UNIQUE (rule_name)
);

-- Permissions

ALTER TABLE public.rules OWNER TO postgres;
GRANT ALL ON TABLE public.rules TO postgres;


-- public.shop definition

-- Drop table

-- DROP TABLE public.shop;

CREATE TABLE public.shop (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	description text NULL,
	image varchar(255) NULL,
	price int4 NULL,
	count int4 DEFAULT 0 NULL,
	CONSTRAINT shop_name_key UNIQUE (name),
	CONSTRAINT shop_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.shop OWNER TO postgres;
GRANT ALL ON TABLE public.shop TO postgres;


-- public.tasks definition

-- Drop table

-- DROP TABLE public.tasks;

CREATE TABLE public.tasks (
	id serial4 NOT NULL,
	task_name varchar(100) NOT NULL,
	task_description text NULL,
	task_weight int4 NULL,
	is_open bool DEFAULT true NOT NULL,
	CONSTRAINT tasks_pkey PRIMARY KEY (id),
	CONSTRAINT tasks_task_name_key UNIQUE (task_name)
);

-- Permissions

ALTER TABLE public.tasks OWNER TO postgres;
GRANT ALL ON TABLE public.tasks TO postgres;


-- public.achievements definition

-- Drop table

-- DROP TABLE public.achievements;

CREATE TABLE public.achievements (
	id serial4 NOT NULL,
	group_id int4 NULL,
	"name" varchar(100) NOT NULL,
	img_name varchar(255) NULL,
	achievement_weight int4 DEFAULT 3 NULL,
	description text NULL,
	department_only bool DEFAULT false NOT NULL,
	need_verification bool DEFAULT true NOT NULL,
	CONSTRAINT achievements_name_key UNIQUE (name),
	CONSTRAINT achievements_pkey PRIMARY KEY (id),
	CONSTRAINT achievements_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.achievement_groups(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.achievements OWNER TO postgres;
GRANT ALL ON TABLE public.achievements TO postgres;


-- public.role_achievements definition

-- Drop table

-- DROP TABLE public.role_achievements;

CREATE TABLE public.role_achievements (
	id serial4 NOT NULL,
	role_id int4 NULL,
	achievement_id int4 NULL,
	department_id int4 NULL,
	max_count int4 NULL,
	CONSTRAINT role_achievements_pkey PRIMARY KEY (id),
	CONSTRAINT role_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE,
	CONSTRAINT role_achievements_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE,
	CONSTRAINT role_achievements_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.role_achievements OWNER TO postgres;
GRANT ALL ON TABLE public.role_achievements TO postgres;


-- public.teams definition

-- Drop table

-- DROP TABLE public.teams;

CREATE TABLE public.teams (
	id serial4 NOT NULL,
	department_id int4 NULL,
	team_name varchar(100) NOT NULL,
	CONSTRAINT teams_pkey PRIMARY KEY (id),
	CONSTRAINT teams_team_name_key UNIQUE (team_name),
	CONSTRAINT teams_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.teams OWNER TO postgres;
GRANT ALL ON TABLE public.teams TO postgres;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	tg_id int8 NULL,
	login varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	jira_login varchar(100) NULL,
	"name" varchar(50) NOT NULL,
	patronymic varchar(50) NULL,
	surname varchar(50) NOT NULL,
	birthdate date NULL,
	tg_nickname varchar(50) NULL,
	phone varchar(20) NULL,
	department_id int4 NULL,
	grade_id int4 NULL,
	is_active bool DEFAULT true NULL,
	CONSTRAINT users_jira_login_key UNIQUE (jira_login),
	CONSTRAINT users_login_key UNIQUE (login),
	CONSTRAINT users_phone_key UNIQUE (phone),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_tg_id_key UNIQUE (tg_id),
	CONSTRAINT users_tg_nickname_key UNIQUE (tg_nickname),
	CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE,
	CONSTRAINT users_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.grades(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.users OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;


-- public.graduations definition

-- Drop table

-- DROP TABLE public.graduations;

CREATE TABLE public.graduations (
	id serial4 NOT NULL,
	grade_id int4 NULL,
	user_id int4 NULL,
	graduation_date date NULL,
	graduation_task text NULL,
	CONSTRAINT graduations_pkey PRIMARY KEY (id),
	CONSTRAINT graduations_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.grades(id) ON DELETE CASCADE,
	CONSTRAINT graduations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.graduations OWNER TO postgres;
GRANT ALL ON TABLE public.graduations TO postgres;


-- public.mems definition

-- Drop table

-- DROP TABLE public.mems;

CREATE TABLE public.mems (
	id int4 DEFAULT nextval('memes_id_seq'::regclass) NOT NULL,
	"name" varchar(150) NOT NULL,
	image bytea NULL,
	author_id int4 NULL,
	created_at date NULL,
	average_rate float8 DEFAULT 0 NULL,
	moderated bool DEFAULT false NOT NULL,
	CONSTRAINT memes_pkey PRIMARY KEY (id),
	CONSTRAINT memes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id)
);

-- Permissions

ALTER TABLE public.mems OWNER TO postgres;
GRANT ALL ON TABLE public.mems TO postgres;


-- public.news definition

-- Drop table

-- DROP TABLE public.news;

CREATE TABLE public.news (
	id serial4 NOT NULL,
	title varchar(255) NOT NULL,
	"content" text NOT NULL,
	author_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	image bytea NULL,
	likes_count int4 DEFAULT 0 NULL,
	CONSTRAINT news_pkey PRIMARY KEY (id),
	CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.news OWNER TO postgres;
GRANT ALL ON TABLE public.news TO postgres;


-- public.news_likes definition

-- Drop table

-- DROP TABLE public.news_likes;

CREATE TABLE public.news_likes (
	id serial4 NOT NULL,
	news_id int4 NULL,
	user_id int4 NULL,
	CONSTRAINT news_likes_pkey PRIMARY KEY (id),
	CONSTRAINT news_likes_news_id_fkey FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE,
	CONSTRAINT news_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.news_likes OWNER TO postgres;
GRANT ALL ON TABLE public.news_likes TO postgres;


-- public.thanks_details definition

-- Drop table

-- DROP TABLE public.thanks_details;

CREATE TABLE public.thanks_details (
	id serial4 NOT NULL,
	sender_id int4 NULL,
	reciever_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	message text NULL,
	CONSTRAINT thanks_details_pkey PRIMARY KEY (id),
	CONSTRAINT thanks_details_receiver_id_fkey FOREIGN KEY (reciever_id) REFERENCES public.users(id) ON DELETE CASCADE,
	CONSTRAINT thanks_details_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.thanks_details OWNER TO postgres;
GRANT ALL ON TABLE public.thanks_details TO postgres;


-- public.user_achievements definition

-- Drop table

-- DROP TABLE public.user_achievements;

CREATE TABLE public.user_achievements (
	id serial4 NOT NULL,
	user_id int4 NULL,
	achievement_id int4 NULL,
	achievement_date date NULL,
	achievement_weight int4 NULL,
	sender_id int4 NULL,
	verified bool DEFAULT false NULL,
	CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
	CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE,
	CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_achievements OWNER TO postgres;
GRANT ALL ON TABLE public.user_achievements TO postgres;


-- public.user_achievements_balance definition

-- Drop table

-- DROP TABLE public.user_achievements_balance;

CREATE TABLE public.user_achievements_balance (
	id serial4 NOT NULL,
	user_id int4 NULL,
	achievement_id int4 NULL,
	count int4 NULL,
	CONSTRAINT user_achievements_balance_pkey PRIMARY KEY (id),
	CONSTRAINT user_achievements_balance_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE,
	CONSTRAINT user_achievements_balance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_achievements_balance OWNER TO postgres;
GRANT ALL ON TABLE public.user_achievements_balance TO postgres;


-- public.user_details definition

-- Drop table

-- DROP TABLE public.user_details;

CREATE TABLE public.user_details (
	user_id int4 NOT NULL,
	interests text NULL,
	ncoins int4 DEFAULT 0 NULL,
	npoints int4 DEFAULT 0 NULL,
	thanks_count int4 DEFAULT 3 NOT NULL,
	CONSTRAINT user_details_pkey PRIMARY KEY (user_id),
	CONSTRAINT user_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_details OWNER TO postgres;
GRANT ALL ON TABLE public.user_details TO postgres;


-- public.user_job_titles definition

-- Drop table

-- DROP TABLE public.user_job_titles;

CREATE TABLE public.user_job_titles (
	user_id int4 NOT NULL,
	job_title varchar NOT NULL,
	job_role varchar NULL,
	projects text NULL,
	CONSTRAINT user_job_titles_pkey PRIMARY KEY (user_id, job_title),
	CONSTRAINT user_job_titles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_job_titles OWNER TO postgres;
GRANT ALL ON TABLE public.user_job_titles TO postgres;


-- public.user_mems definition

-- Drop table

-- DROP TABLE public.user_mems;

CREATE TABLE public.user_mems (
	id int4 DEFAULT nextval('user_memes_id_seq'::regclass) NOT NULL,
	mem_id int4 NULL,
	user_id int4 NULL,
	created_at date NULL,
	likes_count float8 NULL,
	CONSTRAINT user_memes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_mems OWNER TO postgres;
GRANT ALL ON TABLE public.user_mems TO postgres;


-- public.user_photos definition

-- Drop table

-- DROP TABLE public.user_photos;

CREATE TABLE public.user_photos (
	user_id int4 NOT NULL,
	photo bytea NULL,
	CONSTRAINT user_photos_pkey PRIMARY KEY (user_id),
	CONSTRAINT user_photos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_photos OWNER TO postgres;
GRANT ALL ON TABLE public.user_photos TO postgres;


-- public.user_purchases definition

-- Drop table

-- DROP TABLE public.user_purchases;

CREATE TABLE public.user_purchases (
	id serial4 NOT NULL,
	user_id int4 NULL,
	item_id int4 NULL,
	transaction_date date NULL,
	transaction_status varchar(50) NULL,
	money_spent text NULL,
	order_id int4 NOT NULL,
	CONSTRAINT user_purchases_pkey PRIMARY KEY (id),
	CONSTRAINT user_purchases_position_id_fkey FOREIGN KEY (item_id) REFERENCES public.shop(id) ON DELETE CASCADE,
	CONSTRAINT user_purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_purchases OWNER TO postgres;
GRANT ALL ON TABLE public.user_purchases TO postgres;


-- public.user_roles definition

-- Drop table

-- DROP TABLE public.user_roles;

CREATE TABLE public.user_roles (
	id serial4 NOT NULL,
	user_id int4 NULL,
	role_id int4 NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (id),
	CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_roles OWNER TO postgres;
GRANT ALL ON TABLE public.user_roles TO postgres;


-- public.user_tasks definition

-- Drop table

-- DROP TABLE public.user_tasks;

CREATE TABLE public.user_tasks (
	id serial4 NOT NULL,
	user_id int4 NULL,
	task_id int4 NULL,
	task_date date NULL,
	task_status varchar(50) NULL,
	task_description text NULL,
	CONSTRAINT user_tasks_pkey PRIMARY KEY (id),
	CONSTRAINT user_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
	CONSTRAINT user_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_tasks OWNER TO postgres;
GRANT ALL ON TABLE public.user_tasks TO postgres;


-- public.user_teams definition

-- Drop table

-- DROP TABLE public.user_teams;

CREATE TABLE public.user_teams (
	id serial4 NOT NULL,
	user_id int4 NULL,
	team_id int4 NULL,
	CONSTRAINT user_teams_pkey PRIMARY KEY (id),
	CONSTRAINT user_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
	CONSTRAINT user_teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.user_teams OWNER TO postgres;
GRANT ALL ON TABLE public.user_teams TO postgres;




-- Permissions;