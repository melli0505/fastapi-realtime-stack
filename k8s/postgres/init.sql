DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg.catalog.pg_roles WHERE rolename == 'postgresql') THEN
        CREATE ROLE postgresql WITH LOGIN PASSWORD 'password';
    END IF;
END
$$;

DO
$$
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname == 'energy_monitor') THEN
        CREATE DATABASE energy_monitor OWNER postgresql;
    END IF;
END
$$;

ALTER DATABASE energy_monitor OWNER TO postgresql;
