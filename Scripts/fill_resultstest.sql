-- Update script to fill in random scores for matches
UPDATE partidos SET id_ganador = 1, id_perdedor = 4, goles_ganador = 3, goles_perdedor = 2 WHERE id = 1;
UPDATE partidos SET id_ganador = 3, id_perdedor = 2, goles_ganador = 2, goles_perdedor = 1 WHERE id = 2;
UPDATE partidos SET id_ganador = 8, id_perdedor = 5, goles_ganador = 3, goles_perdedor = 1 WHERE id = 3;
UPDATE partidos SET id_ganador = 6, id_perdedor = 7, goles_ganador = 2, goles_perdedor = 0 WHERE id = 4;
UPDATE partidos SET id_ganador = 9, id_perdedor = 12, goles_ganador = 4, goles_perdedor = 2 WHERE id = 5;
UPDATE partidos SET id_ganador = 10, id_perdedor = 11, goles_ganador = 2, goles_perdedor = 1 WHERE id = 6;
UPDATE partidos SET id_ganador = 13, id_perdedor = 16, goles_ganador = 3, goles_perdedor = 0 WHERE id = 7;
UPDATE partidos SET id_ganador = 14, id_perdedor = 15, goles_ganador = 1, goles_perdedor = 0 WHERE id = 8;
UPDATE partidos SET id_ganador = 1, id_perdedor = 3, goles_ganador = 2, goles_perdedor = 1 WHERE id = 9;
UPDATE partidos SET id_ganador = 4, id_perdedor = 2, goles_ganador = 1, goles_perdedor = 0 WHERE id = 10;
UPDATE partidos SET id_ganador = 5, id_perdedor = 7, goles_ganador = 3, goles_perdedor = 2 WHERE id = 11;
UPDATE partidos SET id_ganador = 6, id_perdedor = 8, goles_ganador = 2, goles_perdedor = 1 WHERE id = 12;
UPDATE partidos SET id_ganador = 9, id_perdedor = 11, goles_ganador = 2, goles_perdedor = 0 WHERE id = 13;
UPDATE partidos SET id_ganador = 10, id_perdedor = 12, goles_ganador = 3, goles_perdedor = 1 WHERE id = 14;
UPDATE partidos SET id_ganador = 15, id_perdedor = 13, goles_ganador = 4, goles_perdedor = 2 WHERE id = 15;
UPDATE partidos SET id_ganador = 14, id_perdedor = 16, goles_ganador = 2, goles_perdedor = 1 WHERE id = 16;
UPDATE partidos SET id_ganador = 1, id_perdedor = 2, goles_ganador = 2, goles_perdedor = 0 WHERE id = 17;
UPDATE partidos SET id_ganador = 3, id_perdedor = 4, goles_ganador = 3, goles_perdedor = 1 WHERE id = 18;
UPDATE partidos SET id_ganador = 5, id_perdedor = 6, goles_ganador = 1, goles_perdedor = 0 WHERE id = 19;
UPDATE partidos SET id_ganador = 8, id_perdedor = 7, goles_ganador = 3, goles_perdedor = 2 WHERE id = 20;
UPDATE partidos SET id_ganador = 9, id_perdedor = 10, goles_ganador = 2, goles_perdedor = 1 WHERE id = 21;
UPDATE partidos SET id_ganador = 11, id_perdedor = 12, goles_ganador = 3, goles_perdedor = 1 WHERE id = 22;
UPDATE partidos SET id_ganador = 13, id_perdedor = 14, goles_ganador = 2, goles_perdedor = 0 WHERE id = 23;
UPDATE partidos SET id_ganador = 15, id_perdedor = 16, goles_ganador = 2, goles_perdedor = 1 WHERE id = 24;

/*
UPDATE partidos SET id_ganador = 1, id_perdedor = 2, goles_ganador = 2, goles_perdedor = 1 WHERE id = 25;
UPDATE partidos SET id_ganador = 3, id_perdedor = 4, goles_ganador = 3, goles_perdedor = 2 WHERE id = 26;
UPDATE partidos SET id_ganador = 5, id_perdedor = 6, goles_ganador = 2, goles_perdedor = 1 WHERE id = 27;
UPDATE partidos SET id_ganador = 8, id_perdedor = 7, goles_ganador = 3, goles_perdedor = 0 WHERE id = 28;
UPDATE partidos SET id_ganador = 9, id_perdedor = 11, goles_ganador = 1, goles_perdedor = 0 WHERE id = 29;
UPDATE partidos SET id_ganador = 12, id_perdedor = 10, goles_ganador = 4, goles_perdedor = 3 WHERE id = 30;
UPDATE partidos SET id_ganador = 29, id_perdedor = 30, goles_ganador = 3, goles_perdedor = 1 WHERE id = 31;
UPDATE partidos SET id_ganador = 31, id_perdedor = 32, goles_ganador = 2, goles_perdedor = 0 WHERE id = 32;
*/

--points mock
INSERT INTO posiciones (id_equipo, puntos, diferenciagoles) VALUES
(1, 9 , 0),
(2, 3 , 0),
(3, 1 , 0),
(4, 0 , 0),
(5, 7 , 3),
(6, 7, -1),
(7, 7 , 1),
(8, 0 , 0),
(9, 12 , 12),
(10, 0 , 0),
(11, 0 , 0),
(12, 0 , 0),
(13, 6 , 0),
(14, 6 , 1),
(15, 6 , 3),
(16, 6 , 2);

--get partidos con nombres de equipo

SELECT 
    p.id,
    p.fecha,
    p.etapa,
    e1.nombre_seleccion AS equipo1,
    e2.nombre_seleccion AS equipo2,
    eg.nombre_seleccion AS ganador,
    ep.nombre_seleccion AS perdedor,
    p.goles_ganador,
    p.goles_perdedor,
    p.penales_ganador,
    p.penales_perdedor
FROM 
    partidos p
JOIN 
    equipos e1 ON p.id_equipo1 = e1.id
JOIN 
    equipos e2 ON p.id_equipo2 = e2.id
JOIN 
    equipos eg ON p.id_ganador = eg.id
JOIN 
    equipos ep ON p.id_perdedor = ep.id;




--get all positions
SELECT 
    p.id_equipo, 
    e.nombre_seleccion, 
    p.puntos, 
    p.diferenciagoles 
FROM 
    posiciones p
JOIN 
    equipos e 
ON 
    p.id_equipo = e.id
order by p.id_equipo ASC;
