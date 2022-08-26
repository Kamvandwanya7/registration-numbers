sudo -u postgres createdb my_registration;

sudo -u postgres createuser maker -P;

password kv123;

grant all privileges on database my_registration to maker;


Connect to your database using: psql -d my_registration;


create table registration (
	id serial not null primary key,
	platenumber varchar(255) not null
);