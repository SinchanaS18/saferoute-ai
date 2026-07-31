-- Historical crime records setup
-- Run the first two CREATE TABLE blocks only. Stop before the INSERT when instructed.

CREATE TABLE historical_crime_records (
    record_id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    place_name VARCHAR(150) NOT NULL,
    incident_type VARCHAR(50) NOT NULL,
    incident_date DATE,
    incident_time TIME,
    time_of_day VARCHAR(20),
    victim_age INT,
    fir_section VARCHAR(50),
    case_status VARCHAR(30),
    data_source VARCHAR(100),
    location_geom GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crime_district ON historical_crime_records(district);
CREATE INDEX idx_crime_geom ON historical_crime_records USING GIST(location_geom);

CREATE TABLE crime_import_staging (
    district VARCHAR(50),
    place_name VARCHAR(150),
    incident_type VARCHAR(50),
    incident_date DATE,
    incident_time TIME,
    time_of_day VARCHAR(20),
    victim_age INT,
    fir_section VARCHAR(50),
    case_status VARCHAR(30),
    data_source VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

-- After importing CSV into `crime_import_staging`, run the INSERT below to populate
-- `historical_crime_records`. Do not run this until the staging table is populated.

-- INSERT INTO historical_crime_records
--     (district, place_name, incident_type, incident_date, incident_time,
--      time_of_day, victim_age, fir_section, case_status, data_source, location_geom)
-- SELECT
--     district, place_name, incident_type, incident_date, incident_time,
--     time_of_day, victim_age, fir_section, case_status, data_source,
--     ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
-- FROM crime_import_staging;
