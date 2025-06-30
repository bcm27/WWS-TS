-- Hardwood Species Selector Seed Data

-- Clear existing data
TRUNCATE TABLE wood_species RESTART IDENTITY CASCADE;

-- Insert Domestic Wood Species
INSERT INTO wood_species (species, size, price, grade, vendor, wood_type) VALUES
-- Red Oak varieties
('Red Oak', '4/4', 4.50, 'Select', 'Northern Timber Co', 'domestic'),
('Red Oak', '4/4', 3.75, 'Common #1', 'Northern Timber Co', 'domestic'),
('Red Oak', '6/4', 6.25, 'Select', 'Northern Timber Co', 'domestic'),
('Red Oak', '8/4', 8.50, 'Select', 'Midwest Hardwoods', 'domestic'),
('Red Oak', '4/4', 4.25, 'Select', 'Appalachian Lumber', 'domestic'),

-- White Oak varieties
('White Oak', '4/4', 5.75, 'Select', 'Northern Timber Co', 'domestic'),
('White Oak', '4/4', 4.95, 'Common #1', 'Northern Timber Co', 'domestic'),
('White Oak', '6/4', 7.80, 'Select', 'Midwest Hardwoods', 'domestic'),
('White Oak', '8/4', 10.25, 'Select', 'Appalachian Lumber', 'domestic'),
('White Oak', '12/4', 15.50, 'Select', 'Premium Wood Supply', 'domestic'),

-- Cherry varieties
('Cherry', '4/4', 8.95, 'Select', 'Northern Timber Co', 'domestic'),
('Cherry', '4/4', 7.50, 'Common #1', 'Midwest Hardwoods', 'domestic'),
('Cherry', '6/4', 12.75, 'Select', 'Appalachian Lumber', 'domestic'),
('Cherry', '8/4', 16.80, 'Select', 'Premium Wood Supply', 'domestic'),
('Cherry', '4/4', 8.25, 'Rustic', 'Budget Lumber Depot', 'domestic'),

-- Hard Maple varieties
('Hard Maple', '4/4', 6.25, 'Select', 'Northern Timber Co', 'domestic'),
('Hard Maple', '4/4', 5.45, 'Common #1', 'Midwest Hardwoods', 'domestic'),
('Hard Maple', '6/4', 8.90, 'Select', 'Premium Wood Supply', 'domestic'),
('Hard Maple', '8/4', 11.75, 'Select', 'Appalachian Lumber', 'domestic'),
('Hard Maple', '4/4', 7.15, 'Curly', 'Specialty Woods Inc', 'domestic'),

-- Soft Maple varieties
('Soft Maple', '4/4', 4.25, 'Select', 'Northern Timber Co', 'domestic'),
('Soft Maple', '4/4', 3.65, 'Common #1', 'Budget Lumber Depot', 'domestic'),
('Soft Maple', '6/4', 5.95, 'Select', 'Midwest Hardwoods', 'domestic'),
('Soft Maple', '8/4', 7.80, 'Select', 'Appalachian Lumber', 'domestic'),

-- Walnut varieties
('Black Walnut', '4/4', 12.50, 'Select', 'Premium Wood Supply', 'domestic'),
('Black Walnut', '4/4', 10.25, 'Common #1', 'Midwest Hardwoods', 'domestic'),
('Black Walnut', '6/4', 17.95, 'Select', 'Specialty Woods Inc', 'domestic'),
('Black Walnut', '8/4', 24.75, 'Select', 'Premium Wood Supply', 'domestic'),
('Black Walnut', '4/4', 15.50, 'Figured', 'Exotic Wood Emporium', 'domestic'),

-- Ash varieties
('White Ash', '4/4', 4.75, 'Select', 'Northern Timber Co', 'domestic'),
('White Ash', '4/4', 3.95, 'Common #1', 'Budget Lumber Depot', 'domestic'),
('White Ash', '6/4', 6.50, 'Select', 'Midwest Hardwoods', 'domestic'),
('White Ash', '8/4', 8.25, 'Select', 'Appalachian Lumber', 'domestic'),

-- Hickory varieties
('Hickory', '4/4', 5.25, 'Select', 'Appalachian Lumber', 'domestic'),
('Hickory', '4/4', 4.45, 'Common #1', 'Northern Timber Co', 'domestic'),
('Hickory', '6/4', 7.15, 'Select', 'Midwest Hardwoods', 'domestic'),
('Hickory', '8/4', 9.50, 'Select', 'Premium Wood Supply', 'domestic'),

-- Additional domestic species
('Poplar', '4/4', 2.95, 'Select', 'Budget Lumber Depot', 'domestic'),
('Poplar', '6/4', 4.25, 'Select', 'Northern Timber Co', 'domestic'),
('Basswood', '4/4', 3.50, 'Select', 'Midwest Hardwoods', 'domestic'),
('Basswood', '6/4', 4.95, 'Select', 'Appalachian Lumber', 'domestic'),
('Beech', '4/4', 4.85, 'Select', 'Northern Timber Co', 'domestic'),
('Beech', '6/4', 6.75, 'Select', 'Premium Wood Supply', 'domestic'),

-- Insert Exotic Wood Species
('Mahogany', '4/4', 18.50, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Mahogany', '6/4', 26.75, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Mahogany', '8/4', 35.25, 'Select', 'Premium Wood Supply', 'exotic'),
('Mahogany', '4/4', 22.95, 'Figured', 'Specialty Woods Inc', 'exotic'),

-- Teak varieties
('Teak', '4/4', 35.75, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Teak', '6/4', 52.50, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Teak', '8/4', 68.95, 'Select', 'Premium Wood Supply', 'exotic'),
('Teak', '4/4', 42.25, 'Quarter Sawn', 'Specialty Woods Inc', 'exotic'),

-- Rosewood varieties
('Brazilian Rosewood', '4/4', 125.00, 'Select', 'Rare Woods International', 'exotic'),
('Brazilian Rosewood', '6/4', 185.75, 'Select', 'Exotic Wood Emporium', 'exotic'),
('East Indian Rosewood', '4/4', 45.50, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('East Indian Rosewood', '6/4', 67.25, 'Select', 'Specialty Woods Inc', 'exotic'),

-- Ebony varieties
('Macassar Ebony', '4/4', 75.50, 'Select', 'Rare Woods International', 'exotic'),
('Macassar Ebony', '6/4', 112.75, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Gabon Ebony', '4/4', 95.25, 'Select', 'Rare Woods International', 'exotic'),
('Gabon Ebony', '6/4', 142.50, 'Select', 'Specialty Woods Inc', 'exotic'),

-- Exotic species varieties
('Purple Heart', '4/4', 12.75, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Purple Heart', '6/4', 18.95, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Purple Heart', '8/4', 24.50, 'Select', 'Premium Wood Supply', 'exotic'),

('Padauk', '4/4', 15.25, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Padauk', '6/4', 22.75, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Padauk', '8/4', 29.95, 'Select', 'Specialty Woods Inc', 'exotic'),

('Wenge', '4/4', 22.50, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Wenge', '6/4', 33.75, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Wenge', '8/4', 44.25, 'Select', 'Rare Woods International', 'exotic'),

('Zebrawood', '4/4', 28.95, 'Select', 'Exotic Wood Emporium', 'exotic'),
('Zebrawood', '6/4', 42.50, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Zebrawood', '8/4', 55.75, 'Select', 'Rare Woods International', 'exotic'),

('Bocote', '4/4', 19.75, 'Select', 'Tropical Hardwoods Ltd', 'exotic'),
('Bocote', '6/4', 29.25, 'Select', 'Exotic Wood Emporium', 'exotic'),

('Cocobolo', '4/4', 65.50, 'Select', 'Rare Woods International', 'exotic'),
('Cocobolo', '6/4', 97.75, 'Select', 'Exotic Wood Emporium', 'exotic'),

('Lignum Vitae', '4/4', 85.25, 'Select', 'Rare Woods International', 'exotic'),
('Lignum Vitae', '6/4', 127.50, 'Select', 'Specialty Woods Inc', 'exotic'),

-- Insert Plywood Species
('Baltic Birch', '1/4', 2.25, 'B/BB', 'Plywood Specialists', 'plywood'),
('Baltic Birch', '1/2', 3.75, 'B/BB', 'Plywood Specialists', 'plywood'),
('Baltic Birch', '3/4', 4.95, 'B/BB', 'Sheet Goods Supply', 'plywood'),
('Baltic Birch', '1', 6.25, 'B/BB', 'Premium Wood Supply', 'plywood'),
('Baltic Birch', '1/4', 1.95, 'BB/BB', 'Budget Sheet Goods', 'plywood'),

('Apple Ply', '1/4', 3.50, 'A1', 'Plywood Specialists', 'plywood'),
('Apple Ply', '1/2', 5.75, 'A1', 'Sheet Goods Supply', 'plywood'),
('Apple Ply', '3/4', 7.25, 'A1', 'Premium Wood Supply', 'plywood'),

('Cherry Ply', '1/4', 4.25, 'A1', 'Plywood Specialists', 'plywood'),
('Cherry Ply', '1/2', 6.95, 'A1', 'Sheet Goods Supply', 'plywood'),
('Cherry Ply', '3/4', 8.75, 'A1', 'Premium Wood Supply', 'plywood'),
('Cherry Ply', '1/4', 3.85, 'A2', 'Budget Sheet Goods', 'plywood'),

('Oak Ply', '1/4', 3.75, 'A1', 'Plywood Specialists', 'plywood'),
('Oak Ply', '1/2', 6.25, 'A1', 'Sheet Goods Supply', 'plywood'),
('Oak Ply', '3/4', 7.95, 'A1', 'Premium Wood Supply', 'plywood'),
('Oak Ply', '1/4', 3.25, 'A2', 'Budget Sheet Goods', 'plywood'),

('Maple Ply', '1/4', 3.95, 'A1', 'Plywood Specialists', 'plywood'),
('Maple Ply', '1/2', 6.50, 'A1', 'Sheet Goods Supply', 'plywood'),
('Maple Ply', '3/4', 8.25, 'A1', 'Premium Wood Supply', 'plywood'),

('Walnut Ply', '1/4', 8.50, 'A1', 'Plywood Specialists', 'plywood'),
('Walnut Ply', '1/2', 14.25, 'A1', 'Sheet Goods Supply', 'plywood'),
('Walnut Ply', '3/4', 18.75, 'A1', 'Premium Wood Supply', 'plywood'),

('Mahogany Ply', '1/4', 6.75, 'A1', 'Plywood Specialists', 'plywood'),
('Mahogany Ply', '1/2', 11.25, 'A1', 'Sheet Goods Supply', 'plywood'),
('Mahogany Ply', '3/4', 14.50, 'A1', 'Premium Wood Supply', 'plywood'),

('Teak Ply', '1/4', 12.95, 'A1', 'Marine Plywood Co', 'plywood'),
('Teak Ply', '1/2', 21.75, 'A1', 'Marine Plywood Co', 'plywood'),
('Teak Ply', '3/4', 28.50, 'A1', 'Premium Wood Supply', 'plywood'),

('Poplar Ply', '1/4', 2.75, 'A2', 'Budget Sheet Goods', 'plywood'),
('Poplar Ply', '1/2', 4.25, 'A2', 'Sheet Goods Supply', 'plywood'),
('Poplar Ply', '3/4', 5.50, 'A2', 'Plywood Specialists', 'plywood'),

('Basswood Ply', '1/4', 3.25, 'A2', 'Plywood Specialists', 'plywood'),
('Basswood Ply', '1/2', 5.25, 'A2', 'Sheet Goods Supply', 'plywood'),
('Basswood Ply', '3/4', 6.75, 'A2', 'Premium Wood Supply', 'plywood'),

-- Some specialty plywood
('Bamboo Ply', '1/4', 4.50, 'A1', 'Eco Plywood Supply', 'plywood'),
('Bamboo Ply', '1/2', 7.25, 'A1', 'Eco Plywood Supply', 'plywood'),
('Bamboo Ply', '3/4', 9.50, 'A1', 'Premium Wood Supply', 'plywood'),

-- MDF and particle board alternatives (technically plywood category)
('MDF Core Veneer', '1/2', 3.95, 'A1', 'Sheet Goods Supply', 'plywood'),
('MDF Core Veneer', '3/4', 5.25, 'A1', 'Budget Sheet Goods', 'plywood'),
('Particleboard Core', '1/2', 2.95, 'A2', 'Budget Sheet Goods', 'plywood'),
('Particleboard Core', '3/4', 3.75, 'A2', 'Budget Sheet Goods', 'plywood');

-- Update statistics
ANALYZE wood_species;

-- Show summary of inserted data
SELECT 
    wood_type,
    COUNT(*) as total_entries,
    COUNT(DISTINCT species) as unique_species,
    COUNT(DISTINCT vendor) as unique_vendors,
    MIN(price) as min_price,
    MAX(price) as max_price,
    ROUND(AVG(price), 2) as avg_price
FROM wood_species 
GROUP BY wood_type 
ORDER BY wood_type;

-- Show total counts
SELECT 
    COUNT(*) as total_entries,
    COUNT(DISTINCT species) as unique_species,
    COUNT(DISTINCT vendor) as unique_vendors
FROM wood_species;