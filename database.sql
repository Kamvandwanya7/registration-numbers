sudo -u postgres createdb my_registration;

sudo -u postgres createuser maker -P;

password kv123;

grant all privileges on database my_registration to maker;


Connect to your database using: psql -d my_registration;

create table my_town (
	id serial not null primary key,
	town_name text not null,
	town_code text not null
);

INSERT INTO my_town (town_name,town_code) VALUES('Cape Town', 'CA');
INSERT INTO my_town (town_name,town_code) VALUES('Paarl', 'CL');
INSERT INTO my_town (town_name,town_code) VALUES('Belville', 'CY');
INSERT INTO my_town (town_name,town_code) VALUES('Stellenbosch', 'CJ');


create table registration (
	id serial not null primary key,
	platenumber varchar(255) not null,
	town_id int,	
FOREIGN KEY (town_id) REFERENCES my_town(id)


);