\c backend;

create table equipos (
    id serial primary key,
    nombre_seleccion varchar(80)
);

create table  usuario (
    ci integer primary key,
    username text not null,
    contrasena varchar(500),
    id_campeon integer,
    id_subcampeon integer,
    es_admin integer
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
    goles_perdedor integer
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

create table puntos (
    ci_usuario integer primary key,
    puntos integer default 0
);

--Startup data


--creo el admin
INSERT INTO usuario (ci, username, contrasena, id_campeon, id_subcampeon, es_admin) VALUES ( -1, "Admin", "Admin", -1,-1,1);

--Agrego los Equipos
INSERT INTO equipos (nombre_seleccion) VALUES 
('Argentina'),--1
('Perú'),--2
('Chile'),--3
('Canadá'),--4
('México'),--5
('Ecuador'),--6
('Venezuela'),--7
('Jamaica'),--8
('Estados Unidos'),--9
('Uruguay'),--10
('Panamá'),--11
('Bolivia'),--12
('Brasil'),--13
('Colombia'),--14
('Paraguay'),--15
('Costa Rica');--16

--Ingreso los partidos
--https://copaamerica.com/calendario-de-partidos/

--Ojo al guardarlo el pg lo convierte a utc (el middleware cambia al datenow a utc antes de chequear)
INSERT INTO partidos (fecha, etapa, id_equipo1, id_equipo2) VALUES
('2024-06-20 20:00:00-04', 'Grupo A', 1 ,4),
('2024-06-21 19:00:00-05', 'Grupo A', 2 ,3),
('2024-06-22 20:00:00-05', 'Grupo B', 5 ,8),
('2024-06-22 15:00:00-07', 'Grupo B', 6 ,7),
('2024-06-23 17:00:00-05', 'Grupo C', 9 , 12),
('2024-06-23 21:00:00-04', 'Grupo C', 10 , 11),
('2024-06-24 18:00:00-07', 'Grupo D', 13 , 16),
('2024-06-24 17:00:00-05', 'Grupo D', 14 , 15),
('2024-06-25 21:00:00-04', 'Grupo A', 3 , 1),
('2024-06-25 17:00:00-05', 'Grupo A', 2 , 4),
('2024-06-26 18:00:00-07', 'Grupo B', 7 , 5),
('2024-06-26 15:00:00-07', 'Grupo B', 6 , 8),
('2024-06-27 18:00:00-04', 'Grupo C', 11 , 9),
('2024-06-27 21:00:00-04', 'Grupo C', 10 , 12),
('2024-06-28 18:00:00-07', 'Grupo D', 15 , 13),
('2024-06-28 15:00:00-07', 'Grupo D', 14 , 16),
('2024-06-29 21:00:00-04', 'Grupo A', 1 , 2),
('2024-06-29 20:00:00-04', 'Grupo A', 4 , 3),
('2024-06-30 17:00:00-07', 'Grupo B', 5 , 6),
('2024-06-30 19:00:00-05', 'Grupo B', 8 , 7),
('2024-07-01 20:00:00-05', 'Grupo C', 9 , 10),
('2024-07-01 21:00:00-04', 'Grupo C', 12 , 11),
('2024-07-02 18:00:00-07', 'Grupo D', 13 , 14),
('2024-07-02 20:00:00-05', 'Grupo D', 16 , 15),
('2024-07-04 20:00:00-05', 'Cuartos de Final', null , null), --1A VS 2B
('2024-07-05 20:00:00+00', 'Cuartos de Final', null , null), --1B VS 2A
('2024-07-06 18:00:00+00', 'Cuartos de Final', null , null), --1C VS 2D
('2024-07-06 15:00:00+00', 'Cuartos de Final', null , null), --1D VS 2C
('2024-07-09 20:00:00+00', 'Semifinales', null , null), --G25 vs G26
('2024-07-10 20:00:00+00', 'Semifinales', null , null), --G27 vs G28
('2024-07-13 20:00:00+00', '3er Puesto', null , null), --P29 vs P30
('2024-07-14 20:00:00+00', 'Final', null , null);--G29 vs G30








