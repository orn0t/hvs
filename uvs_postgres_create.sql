CREATE TABLE public.User (
	id serial NOT NULL,
	userPriviledge varchar(10) NOT NULL,
	login varchar(50) NOT NULL UNIQUE,
	password varchar(100) NOT NULL,
	CONSTRAINT User_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE session (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;



CREATE TABLE Event (
	id serial NOT NULL,
	fblink varchar(200) NOT NULL,
	pointsCost integer NOT NULL,
	pointsRevenue integer NOT NULL,
	managerId integer NOT NULL,
	volunteersQuota integer NOT NULL,
	volunteersRevenueQuota integer NOT NULL,
	CONSTRAINT Event_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE UserTag (
	userId integer NOT NULL,
	tag varchar(200) NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE EventTag (
	eventId integer NOT NULL,
	tag varchar(100) NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE EventTicket (
	userId integer NOT NULL,
	eventId integer NOT NULL,
	participantType varchar(10) NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE Project (
	id serial NOT NULL,
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,
	managerId integer NOT NULL,
	CONSTRAINT Project_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE ProjectMember (
	userId integer NOT NULL,
	projectId integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE ProjectTag (
	projectId integer NOT NULL,
	tag varchar(200) NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE DonateTransaction (
	userId integer,
	amount integer NOT NULL,
	timestamp integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE MonthlyBudget (
	year integer NOT NULL,
	month integer NOT NULL,
	budget integer NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE Session ADD CONSTRAINT Session_fk0 FOREIGN KEY (userId) REFERENCES public.User(id);

ALTER TABLE Event ADD CONSTRAINT Event_fk0 FOREIGN KEY (managerId) REFERENCES public.User(id);

ALTER TABLE UserTag ADD CONSTRAINT UserTag_fk0 FOREIGN KEY (userId) REFERENCES public.User(id);

ALTER TABLE EventTag ADD CONSTRAINT EventTag_fk0 FOREIGN KEY (eventId) REFERENCES Event(id);

ALTER TABLE EventTicket ADD CONSTRAINT EventTicket_fk0 FOREIGN KEY (userId) REFERENCES public.User(id);
ALTER TABLE EventTicket ADD CONSTRAINT EventTicket_fk1 FOREIGN KEY (eventId) REFERENCES Event(id);

ALTER TABLE Project ADD CONSTRAINT Project_fk0 FOREIGN KEY (managerId) REFERENCES public.User(id);

ALTER TABLE ProjectMember ADD CONSTRAINT ProjectMember_fk0 FOREIGN KEY (userId) REFERENCES public.User(id);
ALTER TABLE ProjectMember ADD CONSTRAINT ProjectMember_fk1 FOREIGN KEY (projectId) REFERENCES Project(id);

ALTER TABLE ProjectTag ADD CONSTRAINT ProjectTag_fk0 FOREIGN KEY (projectId) REFERENCES Project(id);

ALTER TABLE DonateTransaction ADD CONSTRAINT DonateTransaction_fk0 FOREIGN KEY (userId) REFERENCES public.User(id);

