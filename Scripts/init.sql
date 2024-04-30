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


