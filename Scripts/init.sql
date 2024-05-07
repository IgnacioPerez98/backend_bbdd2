\c backend;

create table equipos (
    id serial primary key,
    nombre_seleccion varchar(80)
);

create table  usuario (
    ci integer primary key,
    username text not null,
    contrasena text not null,
    id_campeon integer,
    id_subcampeon integer,
    es_admin integer default 0
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
    penales_perdedor integer
);

create table predicciones (
    id serial primary key ,
    ci_usuario integer not null,
    id_partido integer,
    id_ganador integer,
    id_perdedor integer,
    goles_ganador integer,
    goles_perdedor integer
);

--refers to users points
create table puntos (
    ci_usuario integer primary key,
    puntos integer default 0
);

create table posiciones (
    id_equipo integer primary key,
    puntos integer not null default 0, 
    diferenciagoles integer not null default 0
);


--Startup data


--creo el admin
--INSERT INTO usuario(ci, username, contrasena, id_campeon, id_subcampeon, es_admin) VALUES ( -1, "Admin", "Admin", -1,-1,1);

--Agrego los Equipos
INSERT INTO equipos (nombre_seleccion) VALUES 
('Argentina'),--1 GA
('Perú'),--2 GA
('Chile'),--3 GA
('Canadá'),--4 GA
('México'),--5 GB
('Ecuador'),--6 GB
('Venezuela'),--7 GB
('Jamaica'),--8 GB
('Estados Unidos'),--9 GC
('Uruguay'),--10 GC
('Panamá'),--11 GC
('Bolivia'),--12 GC
('Brasil'),--13 GD
('Colombia'),--14 GD
('Paraguay'),--15 GD
('Costa Rica');--16 GD

--insert the temams in the table of positions, to simplify the sql query
q

--Ingreso los partidos
--https://copaamerica.com/calendario-de-partidos/

--Ojo al guardarlo el pg lo convierte a utc (el middleware cambia al datenow a utc antes de chequear)
INSERT INTO partidos (fecha, etapa, id_equipo1, id_equipo2) VALUES
('2024-06-20 20:00:00-04', 'Grupo A', 1 ,4),--1
('2024-06-21 19:00:00-05', 'Grupo A', 2 ,3),--2
('2024-06-22 20:00:00-05', 'Grupo B', 5 ,8),--3
('2024-06-22 15:00:00-07', 'Grupo B', 6 ,7),--4
('2024-06-23 17:00:00-05', 'Grupo C', 9 , 12),--5
('2024-06-23 21:00:00-04', 'Grupo C', 10 , 11),--6
('2024-06-24 18:00:00-07', 'Grupo D', 13 , 16),--7
('2024-06-24 17:00:00-05', 'Grupo D', 14 , 15),--8
('2024-06-25 21:00:00-04', 'Grupo A', 3 , 1),--9
('2024-06-25 17:00:00-05', 'Grupo A', 2 , 4),--10
('2024-06-26 18:00:00-07', 'Grupo B', 7 , 5),--11
('2024-06-26 15:00:00-07', 'Grupo B', 6 , 8),--12
('2024-06-27 18:00:00-04', 'Grupo C', 11 , 9),--13
('2024-06-27 21:00:00-04', 'Grupo C', 10 , 12),--14
('2024-06-28 18:00:00-07', 'Grupo D', 15 , 13),--15
('2024-06-28 15:00:00-07', 'Grupo D', 14 , 16),--16
('2024-06-29 21:00:00-04', 'Grupo A', 1 , 2),--17
('2024-06-29 20:00:00-04', 'Grupo A', 4 , 3),--18
('2024-06-30 17:00:00-07', 'Grupo B', 5 , 6),--19
('2024-06-30 19:00:00-05', 'Grupo B', 8 , 7),--20
('2024-07-01 20:00:00-05', 'Grupo C', 9 , 10),--21
('2024-07-01 21:00:00-04', 'Grupo C', 12 , 11),--22
('2024-07-02 18:00:00-07', 'Grupo D', 13 , 14),--23
('2024-07-02 20:00:00-05', 'Grupo D', 16 , 15),--24
('2024-07-04 20:00:00-05', 'Cuartos de Final', null , null), --25  1A VS 2B
('2024-07-05 20:00:00+00', 'Cuartos de Final', null , null), --26  1B VS 2A
('2024-07-06 18:00:00+00', 'Cuartos de Final', null , null), --27  1C VS 2D
('2024-07-06 15:00:00+00', 'Cuartos de Final', null , null), --28  1D VS 2C
('2024-07-09 20:00:00+00', 'Semifinales', null , null), --29   G25 vs G26
('2024-07-10 20:00:00+00', 'Semifinales', null , null), --30   G27 vs G28
('2024-07-13 20:00:00+00', '3er Puesto', null , null), --31   P29 vs P30
('2024-07-14 20:00:00+00', 'Final', null , null);--32  G29 vs G30








