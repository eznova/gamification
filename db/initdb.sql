-- 1. Таблицы для пользователей и их данных
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO public.departments (department_name) VALUES
	 ('Администрация'),
	 ('ЦУП'),
	 ('ЦИИС'),
	 ('ЦИИС_ОРЦС'),
	 ('ЦВС_ОКР'),
	 ('ЦВС_МОСУ_СФБ'),
	 ('ОВТС'),
	 ('ЦРЦТП'),
	 ('ЦСКЗ'),
	 ('АиТ');
INSERT INTO public.departments (department_name) VALUES
	 ('ЦАМР'),
	 ('ЦРСОБД');


CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    grade_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
    -- auth
    id SERIAL PRIMARY KEY,
    tg_id BIGINT UNIQUE,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- info
    jira_login VARCHAR(100) UNIQUE,
    name VARCHAR(50) NOT NULL,
    patronymic VARCHAR(50),
    surname VARCHAR(50) NOT NULL,
    birthdate DATE,
    -- contacts
    tg_nickname VARCHAR(50) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    -- job info
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    grade_id INT REFERENCES grades(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Add admin user
INSERT INTO public.users (id, tg_id, login, password, jira_login, name, patronymic, surname, birthdate, tg_nickname, phone, department_id, is_active) VALUES
('1', '0', 'admin', 'admin', 'admin', 'Default', 'Admin', 'User', '2025-02-01', 'admin', '+7000000000', '1', 'true');


CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image BYTEA,
    likes_count INT DEFAULT 0
);

CREATE TABLE thanks_details (
    id SERIAL PRIMARY KEY,
    sender_id INT DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
    reciever_id INT DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT
);


CREATE TABLE news_likes (
    id SERIAL PRIMARY KEY,
    news_id INT REFERENCES news(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_details (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    interests TEXT,
    ncoins INT DEFAULT 0,
    npoints INT DEFAULT 0,
    thanks_count INT DEFAULT 3
);

INSERT INTO user_details (user_id) VALUES (1);

CREATE TABLE user_photos (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    photo BYTEA
);



-- 2. Таблицы для достижений и ролей
CREATE TABLE achievement_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Auto-generated SQL script #202502082009
INSERT INTO public.achievement_groups ("name")
	VALUES ('Спасибы');
INSERT INTO public.achievement_groups ("name")
	VALUES ('Помощь новичкам');
INSERT INTO public.achievement_groups ("name")
	VALUES ('Вехи пути');
INSERT INTO public.achievement_groups ("name")
	VALUES ('Достижения в деле');
INSERT INTO public.achievement_groups ("name")
	VALUES ('Лаборатория');
INSERT INTO public.achievement_groups ("name")
	VALUES ('Путь героя');
INSERT INTO public.achievement_groups ("name")
	VALUES ('Уникальные достижения');


CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES achievement_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL UNIQUE,
    img_name VARCHAR(255),
    achievement_weight INT DEFAULT 3,
    description TEXT,
    department_only BOOLEAN DEFAULT FALSE,
    need_verification BOOLEAN DEFAULT FALSE
);

INSERT INTO public.achievements (id,group_id,"name",img_name,achievement_weight,description,department_only,need_verification) VALUES
	 (19,6,'ДЖЕДАЙ БЛАГОДАРНОСТИ','thanksJedi.svg',20,'Достижение третьего уровня, вручается сотруднику, который выслал 100 “спасибо” коллегам',false,true),
	 (4,2,'НАСТАВНИК','mentor.svg',5,'Достижение класса MENTOR первого уровня, вручается персонажу после успешного завершения онбординга подопечного',false,true),
	 (5,2,'ПРОВОДНИК','mentor2.svg',10,'Достижение класса MENTOR второго уровня, вручается персонажу после успешного завершения онбординга 5 сотрудников',false,true),
	 (6,2,'МУДРЕЙШИЙ ДЖЕДАЙ','wiseJedi.svg',15,'Достижение класса MENTOR третьего уровня, вручается персонажу после успешного завершения онбординга 10 сотрудников',false,true),
	 (1,1,'СПАСИБО','thanks.svg',3,'Классическое достижение NIIAS GAME, каждый сотрудник может поблагодарить трех коллег в месяц',false,false),
	 (11,4,'ЛУЧШИЙ JUNIOR','bestJunior.svg',8,'Достижение класса PFP первого уровня, вручается молодому персонажу за особые трудовые подвиги персонажем класса РУКОВОДИТЕЛЬ ПОДРАЗДЕЛЕНИЯ',true,true),
	 (3,1,'ОГРОМНОЕ СПАСИБО','hugeThanks.svg',15,'Сможете получить это достижение после особой благодарности от Директора филиала!',false,false),
	 (9,3,'ЧАСТЬ КОМАНДЫ ЧАСТЬ КОРАБЛЯ','partOfTeam.svg',15,'Достижение класса ВЕХИ ПУТИ третьего уровня, вручается персонажу после пяти лет работы',false,false),
	 (15,5,'ПЕДАГОГ НИИАСа','niiasTeacher.svg',15,'Достижение класса EDUCATION второго уровня, вручается персонажу за проведение митапа для филиала от персонажа класса HR',false,true),
	 (16,5,'НАСТОЯЩИЙ УЧЕНЫЙ','realScientist.svg',15,'Достижение класса EDUCATION второго уровня, вручается лучшему персонажу за публикацию статьи по разработкам СПбФ в научном/тематическом журнале от персонажа класса HR',false,true);
INSERT INTO public.achievements (id,group_id,"name",img_name,achievement_weight,description,department_only,need_verification) VALUES
	 (12,4,'СОТРУДНИК КВАРТАЛА','3monthEmpl.svg',12,'Достижение класса PFP второго уровня, вручается персонажу за особые трудовые подвиги персонажем класса РУКОВОДИТЕЛЬ ПОДРАЗДЕЛЕНИЯ',true,true),
	 (20,6,'УЧЕНЫЙ МЕМОЛОГ','scientistMemolog.svg',15,'Достижение второго уровня, вручается сотруднику, который направил на модерацию 10 мемов',false,true),
	 (22,6,'ДОСТИГАТОР','allDonePerson.svg',30,'Достижение третьего уровня, вручается сотруднику, который получил все открытые достижения',false,true),
	 (13,4,'BRIGHT MIND','brightMind.svg',12,'Достижение класса PFP второго уровня, вручается персонажу за отличные идеи персонажем класса РУКОВОДИТЕЛЬ ПОДРАЗДЕЛЕНИЯ',true,true),
	 (14,4,'TOP REVIEWER','topReviewer.svg',8,'Достижение класса PFP первого уровня, вручается персонажу за уникальную внимательность персонажем класса РУКОВОДИТЕЛЬ ПОДРАЗДЕЛЕНИЯ',true,true),
	 (10,4,'СПАСАТЕЛЬ','lifeguard.svg',15,'Достижение класса PFP третьего уровня, вручается персонажу за спасение проекта и/или неоценимый вклад в проект персонажем класса РУКОВОДИТЕЛЬ ПРОЕКТА',false,true),
	 (8,3,'ПОЗНАЛ АББРЕВИАТУРЫ РЖД','knowAllAbbrs.svg',10,'Достижение класса ВЕХИ ПУТИ второго уровня, вручается персонажу после трех лет стажа в НИИАС',false,false),
	 (18,6,'МАСТЕР БЛАГОДАРНОСТИ','thanksMaster.svg',15,'Достижение второго уровня, вручается сотруднику, который выслал 50 “спасибо” коллегам',false,true),
	 (21,6,'СОТРУДНИК ТОПА','emplOfTop.svg',10,'Достижение первого уровня, вручается сотруднику, который вошел в топ-3 лидерборда',false,true),
	 (17,6,'ДОБРО ПОЖАЛОВАТЬ НА БОРТ','welcomeAboard.svg',3,'Стартовое достижение первого уровня за регистрацию в системе',false,false);
INSERT INTO public.achievements (id,group_id,"name",img_name,achievement_weight,description,department_only,need_verification) VALUES
	 (7,3,'ЗНАЮ ВСЕХ ПО ИМЕНИ','knowAllNames.svg',5,'Достижение класса ВЕХИ ПУТИ первого уровня, вручается персонажу после первого года работы',false,false),
	 (2,1,'БОЛЬШОЕ СПАСИБО','bigThanks.svg',8,'Достижение открывается после того, как вас поблагодарит сотрудник Администрации',false,false);



CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO public.roles (id,role_name) VALUES
	 (8,'СОТРУДНИК АДМИНИСТРАЦИИ'),
	 (9,'ПАВЕЛ АЛЕКСАНДРОВИЧ'),
	 (10,'СОТРУДНИК ПОДРАЗДЕЛЕНИЯ'),
	 (11,'УВОЛЕННЫЙ СОТРУДНИК'),
	 (2,'РУКОВОДИТЕЛЬ ПРОЕКТА'),
	 (3,'РУКОВОДИТЕЛЬ ПОДРАЗДЕЛЕНИЯ'),
	 (4,'АДМИНИСТРАТОР СИСТЕМЫ'),
	 (1,'ЗАРЕГИСТРИРОВАННЫЙ ПОЛЬЗОВАТЕЛЬ');


CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE
);

-- Add admin role
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles (user_id, role_id) VALUES (1, 4);

CREATE TABLE role_achievements (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    max_count INT
);

INSERT INTO public.role_achievements (id,role_id,achievement_id,department_id,max_count) VALUES
	 (2,3,12,1,1),
	 (3,3,13,1,1),
	 (4,3,14,1,1),
	 (5,2,10,1,1),
	 (1,3,11,1,1),
	 (6,9,3,1,1),
	 (7,8,2,1,1),
	 (8,4,4,1,500),
	 (9,4,5,1,500),
	 (10,4,15,1,500);
INSERT INTO public.role_achievements (id,role_id,achievement_id,department_id,max_count) VALUES
	 (11,4,16,1,500),
     (12,4,6,1,500);

CREATE TABLE user_achievements_balance (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
    count INT
);

INSERT INTO public.user_achievements_balance (user_id,achievement_id,count) VALUES
     (1,2,0);

-- 3. Таблицы для отделов и команд

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO public.teams (department_id, team_name) VALUES
     (1, 'АО НИИАС СПбФ');

CREATE TABLE user_job_titles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(100),
    job_role VARCHAR(100),
    projects TEXT,
    onboarding_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (user_id, job_title)
);

INSERT INTO public.user_job_titles (user_id, job_title, job_role, projects) VALUES
     (1, 'Администратор', 'Администратор', '1');

CREATE TABLE user_teams (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE
);

INSERT INTO user_teams (user_id, team_id) VALUES (1, 1);

-- 4. Таблицы для образовательных данных
CREATE TABLE graduations (
    id SERIAL PRIMARY KEY,
    grade_id INT REFERENCES grades(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    graduation_date DATE,
    graduation_task TEXT
);

-- 5. Таблица для достижений пользователей
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
    achievement_date DATE,
    achievement_weight INT,
    sender_id INT, 
    verified BOOLEAN DEFAULT FALSE
);

-- 6. Таблица для Заданий
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL UNIQUE,
    task_description TEXT,
    task_weight INT,
    is_open BOOLEAN
);

INSERT INTO public.tasks (id,task_name,task_description,task_weight,is_open) VALUES
	 (1,'Кофейная пауза','Станьте гидом для нового коллеги и помоги ему почувствовать себя частью команды! Пригласите новичка на чашечку кофе и поделитесь своими советами, рабочими лайфхаками и интересными историями. Это прекрасная возможность наладить дружеские отношения и укрепить корпоративный дух! Список новых сотрудников ты можешь попросить у HRa или посмотреть последние посты в NIIAS SPB',20,true),
	 (2,'Мемогенератор','Покажите своё чувство юмора и станьте мастером мемов! Придумайте или найдите смешной мем, связанный с работой, и поделитесь им во вкладке “мемы”. Ваш мем может стать звездой недели в общем голосовании и поднять настроение всему коллективу!',5,true),
	 (3,'Наставник в деле','Станьте проводником для новичков или стажёров и помогите им освоить азы профессии! Поделитесь своим опытом проведя практику для студента и выполни задание!',40,true);


CREATE TABLE user_tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    task_date DATE,
    task_status VARCHAR(50),
    task_description TEXT
);

-- 7. Таблица для магазина
CREATE TABLE shop (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(255),
    price INT,
    count INT DEFAULT 0
);

INSERT INTO public.shop (id,"name",description,image,price,count) VALUES
	 (10,'Помощь животным',NULL,'default.svg',50,0),
	 (2,'Картхолдер',NULL,'card.svg',50,0),
	 (3,'Блокнот на пружине',NULL,'book.svg',90,0),
	 (4,'Блокнот XDDESIGN',NULL,'XDDESIGN.svg',500,0),
	 (5,'Термос',NULL,'termos.svg',170,0),
	 (6,'Путеводитель',NULL,'bookrzd.svg',500,0),
	 (8,'Шоппер красный',NULL,'red.svg',150,0),
	 (7,'Шоппер черный',NULL,'black.svg',160,0),
	 (9,'Помощь детям',NULL,'child.svg',50,0),
	 (1,'Пин НИИАС',NULL,'pin.svg',30,1);


CREATE TABLE user_purchases (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    item_id INT REFERENCES shop(id) ON DELETE CASCADE,
    transaction_date DATE,
    transaction_status VARCHAR(50),
    money_spent TEXT, 
    order_id INT
);

-- 8. Таблица для кодов
CREATE TABLE codes (
    id SERIAL PRIMARY KEY,
    code_value VARCHAR(50),
    code_is_used BOOLEAN DEFAULT FALSE
);

-- 9. Таблица для мемов
CREATE TABLE mems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    image BYTEA,
    author_id INT REFERENCES users(id),
    created_at DATE,
    likes_count FLOAT DEFAULT 0,
    moderated BOOLEAN DEFAULT FALSE,
    average_rate FLOAT DEFAULT 0
);

-- 10. Таблица для лайков
CREATE TABLE user_mems (
    id SERIAL PRIMARY KEY,
    mem_id INT REFERENCES mems(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at DATE,
    average_rate FLOAT,
    likes_count INT DEFAULT 0
);


-- 11. Таблица для правил
CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL UNIQUE,
    rule_description TEXT, 
    rule_type VARCHAR(50)
);

INSERT INTO public.rules (rule_name,rule_description,rule_type) VALUES
	 ('welcome','<p>NIIAS GAME — это наша внутренняя игра, созданная для того, чтобы сделать работу увлекательнее и укрепить командный дух. Выполняйте квесты, зарабатывайте достижения и баллы, которые можно обменять на фирменный мерч и другие приятные бонусы. Чем активнее вы участвуете, тем больше возможностей открывается перед вами! 💡🏆</p>
<p>Желаем приятной игры!</p>','welcome'),
	 ('Ncoins & Npoints','<p>В рамках игры ваша активность поощряется. Вы можете выполнять квесты, получать достижения, участвовать в офисных активностях для того чтобы зарабатывать очки Npoints. Сотрудники, набравшие большее количество баллов отражаются в <a href="" onclick="localStorage.setItem(''selectedNav'',''top10'');">рейтинге сотрудников</a>, в конце года лидеры рейтинга поощряются призами на ежегодном награждении филиала. Раз в год количество баллов обнуляется, для того чтобы каждый сотрудник имел возможность обходить коллег в рейтинге 😎</p>
<p>Все баллы конвертируются во внутреннюю валюту Ncoins (конвертация 1:1), их можно потратить в <a href="" onclick="localStorage.setItem(''selectedNav'',''store'');">Магазине</a>. В отличии от Npoints, Ncoins не обнуляются и остаются с вами, пока вы их не потратите.</p>','rule'),
	 ('Система достижений','<p>Для того чтобы зарабатывать баллы мы используем достижения. Они отличаются по баллам, отправителям и кратности начислений. Ознакомиться со списком можно на <a href="" onclick="localStorage.setItem(''selectedNav'', ''my-achievements'');">карте достижений</a>, там же можно посмотреть какие достижения получены, а какие еще нет</p>
<p>Базовое достижение, доступное каждому игроку — это спасибо. Раз в месяц вы можете выслать до 3 спасибо любому пользователю. Все остальные достижения высылаются раз в квартал.</p>
<p>Вы можете распознать спасибо по кнопке: <img src=''imgs/icons/v/hand.svg''></img></p>
','rule'),
	 ('Квесты','<p>Мы любим отлично проводить время, поэтому решили, что такая деятельность сотрудников тоже должна поощряться. За ряд действий в компании можно также получить баллы. Доступные <a href="" onclick="localStorage.setItem(''selectedNav'', ''season-tasks'');">сезонные задания</a> можно посмотреть на соответствующей вкладке.</p>

<p>Пока что один квест можно пройти только один раз, также они могут меняться, поэтому торопись получить свои баллы!</p>
','rule'),
	 ('Мемы и лента новостей','<p>Мемы — неотъемлемая часть нашей корпоративной культуры, поэтому мы не могли их обойти стороной. Теперь ты можешь определять мем дня посредством голосования на вкладке <a href="" onclick="localStorage.setItem(''selectedNav'', ''mems'');">Мемы</a>. Автор самого залайканного мема в квартал получает 5 Npoints</p>

<p>Для того чтобы сохранять историю филиала мы создали Ленту новостей, любой желающий может оставить на ней новость (про работу и офис любой степени важности). Автор самой популярной новости в квартал также получает 5 Npoints</p>','rule'),
	 ('О том, что мы не любим фрод','<p>Мы понимаем, что находить уязвимости систем — это очень весело и интересно, и на протяжении всей NIIAS GAME с этим сталкивались :)</p>
<p>Мы благодарим пользователей за внимательность, но просим понимания в отношении того, что NIIAS GAME прежде всего некоммерческая система, она разрешает себе быть не идеальной ;)</p>
<p>За зафиксированный фрод (обман) администратор оставляет за собой право снять баллы</p>','rule');