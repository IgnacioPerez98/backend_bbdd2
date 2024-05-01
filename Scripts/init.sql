\c backend;

create table equipos (
    id serial primary key,
    nombre_seleccion varchar(80)
);

create table  usuario (
    ci integer primary key,
    contrasena varchar(500),
    id_campeon integer,
    id_subcampeon integer,
    es_admin integer
);

create table  partidos (
    id serial primary key ,
    fecha date ,
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

--Startup data


--creo el admin

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
INSERT INTO partidos (fecha, etapa) VALUES
('2024-06-14', 'Grupo A - Match 1')


