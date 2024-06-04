

\c backend;


--////////////////////////
--////DEFINE TABLES///////
--////////////////////////

CREATE SEQUENCE equipos_id_seq MINVALUE 0 START 0;

create table equipos (
    id integer PRIMARY KEY DEFAULT nextval('equipos_id_seq'),
    nombre_seleccion varchar(80)
);

-- Alter the table to set the default value for the id column
ALTER TABLE equipos ALTER COLUMN id SET DEFAULT nextval('equipos_id_seq');

create table  usuario (
    ci integer primary key,
    username text not null,
    contrasena text not null,
    id_campeon integer,
    id_subcampeon integer,
    es_admin integer default 0,
    CONSTRAINT fk_campeon FOREIGN KEY(id_campeon) REFERENCES equipos(ci),
    CONSTRAINT fk_subcampeon FOREIGN KEY(ci_usuario) REFERENCES equipos(ci)
);

create table  partidos (
    id serial primary key ,
    fecha timestamp with time zone ,
    etapa text,
    id_equipo1 integer,
    id_equipo2 integer,
    id_ganador integer,
    id_perdedor integer,
    goles_ganador integer,
    goles_perdedor integer,
    penales_ganador integer,
    penales_perdedor integer,
    CONSTRAINT fk_id_e1 FOREIGN KEY(id_equipo1) REFERENCES equipos(id),
    CONSTRAINT fk_id_e2 FOREIGN KEY(id_equipo2) REFERENCES equipos(id),
    CONSTRAINT fk_id_g FOREIGN KEY(id_ganador) REFERENCES equipos(id),
    CONSTRAINT fk_id_p FOREIGN KEY(id_perdedor) REFERENCES equipos(id)
);

create table predicciones (
    id serial primary key ,
    ci_usuario integer not null,
    id_partido integer,
    id_ganador integer,
    id_perdedor integer,
    goles_ganador integer,
    goles_perdedor integer,
    penales_ganador integer,
    penales_perdedor integer,
    CONSTRAINT fk_usuario FOREIGN KEY(ci_usuario) REFERENCES usuario(ci),
    CONSTRAINT fk_id_g FOREIGN KEY(id_ganador) REFERENCES equipos(id),
    CONSTRAINT fk_id_p FOREIGN KEY(id_perdedor) REFERENCES equipos(id),
    CONSTRAINT fk_id_partido FOREIGN KEY(id_partido) REFERENCES partidos(id)

);

--refers to users points
create table puntos (
    ci_usuario integer primary key,
    puntos integer default 0,
    CONSTRAINT fk_usuario FOREIGN KEY(ci_usuario) REFERENCES usuario(ci)
);

create table posiciones (
    id_equipo integer primary key,
    puntos integer not null default 0, 
    diferenciagoles integer not null default 0,
    CONSTRAINT fk_id_partido FOREIGN KEY(id_equipo) REFERENCES equipos(id)
);


--////////////////////////
--//////CONSTRAINS////////
--////////////////////////

--predicciones, usuario partido unicas
ALTER TABLE predicciones ADD CONSTRAINT onecibyteam UNIQUE (ci_usuario, id_partido);





--////////////////////////
--//////SETUP DATA////////
--////////////////////////

--creo el admin
--INSERT INTO usuario(ci, username, contrasena, id_campeon, id_subcampeon, es_admin) VALUES ( -1, "Admin", "Admin", -1,-1,1);

--Agrego los Equipos
INSERT INTO equipos (nombre_seleccion) VALUES 
('Argentina'),--0
('Perú'),--1
('Chile'),--2
('Canadá'),--3
('México'),--4
('Ecuador'),--5
('Venezuela'),--6
('Jamaica'),--7
('Estados Unidos'),--8
('Uruguay'),--9
('Panamá'),--10
('Bolivia'),--11
('Brasil'),--12
('Colombia'),--13
('Paraguay'),--14
('Costa Rica');--15

--insert the temams in the table of positions, to simplify the sql query
INSERT INTO posiciones (id_equipo, puntos, diferenciagoles) VALUES
(0, 0 , 0),
(1, 0 , 0),
(2, 0 , 0),
(3, 0 , 0),
(4, 0 , 0),
(5, 0 , 0),
(6, 0 , 0),
(7, 0 , 0),
(8, 0 , 0),
(9, 0 , 0),
(10, 0 , 0),
(11, 0 , 0),
(12, 0 , 0),
(13, 0 , 0),
(14, 0 , 0),
(15, 0 , 0);

--Ingreso los partidos
--https://copaamerica.com/calendario-de-partidos/

--Ojo al guardarlo el pg lo convierte a utc (el middleware cambia al datenow a utc antes de chequear)
INSERT INTO partidos (fecha, etapa, id_equipo1, id_equipo2) VALUES
('2024-06-20 20:00:00-04', 'Grupo A', 0 ,3),--0
('2024-06-21 19:00:00-05', 'Grupo A', 1 ,2),--1
('2024-06-22 20:00:00-05', 'Grupo B', 4 ,7),--2
('2024-06-22 15:00:00-07', 'Grupo B', 5 ,6),--3
('2024-06-23 17:00:00-05', 'Grupo C', 8 , 11),--4
('2024-06-23 21:00:00-04', 'Grupo C', 9 , 10),--5
('2024-06-24 18:00:00-07', 'Grupo D', 12 , 15),--6
('2024-06-24 17:00:00-05', 'Grupo D', 13 , 14),--7
('2024-06-25 21:00:00-04', 'Grupo A', 2 , 0),--8
('2024-06-25 17:00:00-05', 'Grupo A', 1 , 3),--9
('2024-06-26 18:00:00-07', 'Grupo B', 6 , 4),--10
('2024-06-26 15:00:00-07', 'Grupo B', 5 , 7),--11
('2024-06-27 18:00:00-04', 'Grupo C', 10 , 8),--12
('2024-06-27 21:00:00-04', 'Grupo C', 9 , 11),--13
('2024-06-28 18:00:00-07', 'Grupo D', 14 , 12),--14
('2024-06-28 15:00:00-07', 'Grupo D', 13 , 15),--15
('2024-06-29 21:00:00-04', 'Grupo A', 0 , 1),--16
('2024-06-29 20:00:00-04', 'Grupo A', 3 , 2),--17
('2024-06-30 17:00:00-07', 'Grupo B', 4 , 5),--18
('2024-06-30 19:00:00-05', 'Grupo B', 7 , 6),--19
('2024-07-01 20:00:00-05', 'Grupo C', 8 , 9),--20
('2024-07-01 21:00:00-04', 'Grupo C', 11 , 10),--21
('2024-07-02 18:00:00-07', 'Grupo D', 12 , 13),--22
('2024-07-02 20:00:00-05', 'Grupo D', 15 , 14),--23
('2024-07-04 20:00:00-05', 'Cuartos de Final', null , null), --24  1A VS 2B
('2024-07-05 20:00:00+00', 'Cuartos de Final', null , null), --25  1B VS 2A
('2024-07-06 18:00:00+00', 'Cuartos de Final', null , null), --26  1C VS 2D
('2024-07-06 15:00:00+00', 'Cuartos de Final', null , null), --27  1D VS 2C
('2024-07-09 20:00:00+00', 'Semifinales', null , null), --28   G25 vs G26
('2024-07-10 20:00:00+00', 'Semifinales', null , null), --29   G27 vs G28
('2024-07-13 20:00:00+00', '3er Puesto', null , null), --30   P29 vs P30
('2024-07-14 20:00:00+00', 'Final', null , null);--31  G29 vs G30


