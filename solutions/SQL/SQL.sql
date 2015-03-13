-- Car

SELECT name
FROM movies
WHERE name LIKE 'Car %';

-- Birth year

SELECT *
FROM movies
WHERE year = 1985;

-- Count year

SELECT COUNT(*) num85movies
FROM movies
WHERE year = 1982;

-- Stackersons

SELECT first_name, last_name
FROM actors
WHERE last_name LIKE '%stack%';

-- Popular names

SELECT first_name, COUNT(*) AS first_name_count
FROM actors
GROUP BY first_name
ORDER BY first_name_count DESC
LIMIT 10;

SELECT last_name, COUNT(*) AS last_name_count
FROM actors
GROUP BY last_name
ORDER BY last_name_count DESC
LIMIT 10;

-- Prolific

SELECT first_name, last_name, COUNT(*) AS num_roles
FROM actors
INNER JOIN roles ON actors.id = roles.actor_id
INNER JOIN movies ON roles.movie_id = movies.id
GROUP BY actors.id
ORDER BY num_roles DESC
LIMIT 100;

SELECT COUNT(*) as num_roles, first_name, last_name
FROM actors
INNER JOIN (
  SELECT actor_id, COUNT(*) as num_roles
  FROM roles
  GROUP BY roles.actor_id
  ORDER BY num_roles
  LIMIT 100
) ON id = actor_id;

-- Lowest genres (Bottom of the Barrel)

SELECT genre, COUNT(*) num_genre
FROM movies_genres
GROUP BY genre
ORDER BY num_genre ASC;

-- Braveheart

SELECT first_name, last_name
FROM actors
INNER JOIN roles ON actors.id = roles.actor_id
INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.name = 'Braveheart' AND
      movies.year = 1995
ORDER BY last_name ASC;

-- Leap Noir

SELECT directors.first_name, directors.last_name, movies.name, movies.year
FROM directors
INNER JOIN movies_directors ON directors.id = movies_directors.director_id
INNER JOIN movies ON movies_directors.movie_id = movies.id
INNER JOIN movies_genres ON movies.id = movies_genres.movie_id
WHERE genre = 'Film-Noir' AND (year % 4) = 0
ORDER BY movies.name;

-- ° Bacon

-- Note: inner joins can be written as where clauses.
-- The following two queries are equivalent.

-- SELECT *
-- FROM movies
-- INNER JOIN roles ON movie_id = movies.id

-- SELECT *
-- FROM movies, roles
-- WHERE movies.id = roles.movie_id

SELECT m.name, a2.first_name, a2.last_name
FROM actors a, roles r, movies m, movies_genres mg, roles r2, actors a2
WHERE
  a.first_name = 'Kevin' AND a.last_name = 'Bacon' AND
  a.id = r.actor_id AND
  r.movie_id = m.id AND
  m.id = mg.movie_id AND
  mg.genre = 'Drama' AND -- up to this point we have a table of KB Dramas
  m.id = r2.movie_id AND -- here on, we will expand to actors in those movies
  r2.actor_id = a2.id AND
  a2.id != a.id
ORDER BY a2.last_name;

-- Immortals

SELECT actors.first_name, actors.last_name
FROM actors
INNER JOIN roles ON roles.actor_id = actors.id
INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year < 1900
INTERSECT
SELECT actors.first_name, actors.last_name
FROM actors
INNER JOIN roles ON roles.actor_id = actors.id
INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 2000
ORDER BY actors.last_name;

SELECT first_name, last_name
FROM actors
INNER JOIN roles ON actors.id = roles.actor_id
INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 2000
AND roles.actor_id
IN (SELECT roles.actor_id FROM roles
INNER JOIN movies ON roles.movie_id=movies.id
WHERE movies.year < 1900)
GROUP BY actors.id
ORDER BY actors.first_name ASC;

-- Busy Filming

SELECT
  actors.first_name,
  actors.last_name,
  movies.name,
  movies.year,
  COUNT(DISTINCT roles.role) AS num_roles -- roles with DIFFERENT role names!
FROM actors
INNER JOIN roles ON actors.id = roles.actor_id
INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 1990
GROUP BY roles.actor_id, roles.movie_id
HAVING num_roles > 4;

-- Female actors only

-- includes movies with no actors!
SELECT m.year, count(*) femaleOnly
FROM movies m
WHERE not exists (SELECT *
  FROM roles as ma, actors as a
  WHERE a.id = ma.actor_id
  AND ma.movie_id = m.id
  AND a.gender = 'M')
GROUP BY m.year;

-- excludes movies with no actors
SELECT m.year, count(*) femaleOnly
FROM movies m
WHERE NOT EXISTS (SELECT *
  FROM roles AS ma, actors AS a
  WHERE a.id = ma.actor_id
    AND ma.movie_id = m.id
    AND a.gender = 'M')
AND EXISTS (SELECT *
  FROM roles AS ma, actors AS a
  WHERE a.id = ma.actor_id
    AND ma.movie_id = m.id
    AND a.gender = 'F')
GROUP BY m.year;
