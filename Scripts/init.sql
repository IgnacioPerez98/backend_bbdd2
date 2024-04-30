CREATE DATABASE IF NOT EXISTS backend;


\c backend;

create table [IF NOT EXISTS] equipos(
    id serial primary key,
    nombre_seleccion varchar(80)
)

create table [IF NOT EXISTS] usuario(
    ci integer primary key,
    contrasena varchar(500)
    id_campeon integer,
    id_subcampeon integer
    es_admin integer
)

create table [IF NOT EXISTS] partidos(
    id serial primary key ,
    fecha date ,
    etapa text,
    id_ganador integer,
    id_perdedor integer,
    goles_ganador integer,
    goles_perdedor integer,
)

create table [IF NOT EXISTS] predicciones(
    id serial primary key ,
    ci_usuario integer not null,
    id_partido integer,
    id_ganador integer,
    id_perdedor integer,
    goles_ganador integer,
    goles_perdedor integer,
)


