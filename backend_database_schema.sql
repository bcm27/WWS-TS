-- Hardwood Species Selector Database Schema

-- Create database (run this separately if needed)
-- CREATE DATABASE hardwood_selector;

-- Connect to the database
-- \c hardwood_selector;

-- Enable UUID extension for future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for wood types
CREATE TYPE wood_type_enum AS ENUM ('domestic', 'exotic', 'plywood');

-- Create the main wood_species table
CREATE TABLE IF NOT EXISTS wood_species (
    id SERIAL PRIMARY KEY,
    species VARCHAR(100) NOT NULL,
    size VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    grade VARCHAR(50),
    vendor VARCHAR(100) NOT NULL,
    wood_type wood_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wood_species_type ON wood_species(wood_type);
CREATE INDEX IF NOT EXISTS idx_wood_species_species ON wood_species(species);
CREATE INDEX IF NOT EXISTS idx_wood_species_vendor ON wood_species(vendor);
CREATE INDEX IF NOT EXISTS idx_wood_species_price ON wood_species(price);
CREATE INDEX IF NOT EXISTS idx_wood_species_type_species ON wood_species(wood_type, species);

-- Create composite index for search functionality
CREATE INDEX IF NOT EXISTS idx_wood_species_search ON wood_species 
    USING gin(to_tsvector('english', species || ' ' || COALESCE(grade, '') || ' ' || vendor));

-- Create a partial index for non-null grades
CREATE INDEX IF NOT EXISTS idx_wood_species_grade ON wood_species(grade) WHERE grade IS NOT NULL;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wood_species_updated_at 
    BEFORE UPDATE ON wood_species 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for quick species overview
CREATE OR REPLACE VIEW wood_species_overview AS
SELECT 
    wood_type,
    COUNT(*) as total_species,
    COUNT(DISTINCT species) as unique_species,
    COUNT(DISTINCT vendor) as unique_vendors,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price
FROM wood_species
GROUP BY wood_type
ORDER BY wood_type;

-- Create a function to get species by type (for demonstration)
CREATE OR REPLACE FUNCTION get_species_by_type(p_wood_type wood_type_enum)
RETURNS TABLE(
    species VARCHAR(100),
    size VARCHAR(20),
    price DECIMAL(10,2),
    grade VARCHAR(50),
    vendor VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ws.species,
        ws.size,
        ws.price,
        ws.grade,
        ws.vendor
    FROM wood_species ws
    WHERE ws.wood_type = p_wood_type
    ORDER BY ws.species ASC, ws.size ASC, ws.grade ASC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your user)
-- GRANT ALL PRIVILEGES ON DATABASE hardwood_selector TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Add comments for documentation
COMMENT ON TABLE wood_species IS 'Main table storing all wood species information for the hardwood selector application';
COMMENT ON COLUMN wood_species.species IS 'Name of the wood species (e.g., Red Oak, Cherry, etc.)';
COMMENT ON COLUMN wood_species.size IS 'Lumber size in quarters (e.g., 4/4, 6/4, 8/4)';
COMMENT ON COLUMN wood_species.price IS 'Price per board foot in USD';
COMMENT ON COLUMN wood_species.grade IS 'Wood grade classification (optional)';
COMMENT ON COLUMN wood_species.vendor IS 'Supplier or vendor name';
COMMENT ON COLUMN wood_species.wood_type IS 'Category of wood: domestic, exotic, or plywood';

-- Create a simple audit log table for future use
CREATE TABLE IF NOT EXISTS wood_species_audit (
    audit_id SERIAL PRIMARY KEY,
    species_id INTEGER REFERENCES wood_species(id),
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE wood_species_audit IS 'Audit trail for wood_species table changes';

-- Create function for audit logging
CREATE OR REPLACE FUNCTION wood_species_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO wood_species_audit (species_id, action, new_values)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO wood_species_audit (species_id, action, old_values, new_values)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO wood_species_audit (species_id, action, old_values)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger (optional - uncomment if you want audit logging)
-- CREATE TRIGGER wood_species_audit_trigger
--     AFTER INSERT OR UPDATE OR DELETE ON wood_species
--     FOR EACH ROW EXECUTE FUNCTION wood_species_audit_trigger();

-- Analyze tables for better query planning
ANALYZE wood_species;