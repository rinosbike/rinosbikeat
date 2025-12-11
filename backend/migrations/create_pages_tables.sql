-- Create pages table for the blocks-based page builder
CREATE TABLE IF NOT EXISTS pages (
    page_id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    show_in_header BOOLEAN DEFAULT FALSE,
    menu_position INTEGER DEFAULT 0,
    menu_label VARCHAR(100),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES web_users(user_id)
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Create index for header menu queries
CREATE INDEX IF NOT EXISTS idx_pages_header ON pages(show_in_header, menu_position) WHERE show_in_header = TRUE;

-- Create page_blocks table for storing blocks within pages
CREATE TABLE IF NOT EXISTS page_blocks (
    block_id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pages(page_id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL,
    block_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    configuration JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on page_id for fast block lookups
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_id ON page_blocks(page_id);

-- Create index on block_order for sorting
CREATE INDEX IF NOT EXISTS idx_page_blocks_order ON page_blocks(page_id, block_order);

-- Add comment to tables
COMMENT ON TABLE pages IS 'Custom pages created via the admin page builder';
COMMENT ON TABLE page_blocks IS 'Individual blocks that make up each page';

-- Insert a sample "About Us" page to demonstrate the system
INSERT INTO pages (slug, title, show_in_header, menu_position, menu_label, is_published)
VALUES ('about-us', 'Über uns', TRUE, 1, 'Über uns', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Get the page_id of the about-us page (or create sample blocks if it exists)
DO $$
DECLARE
    about_page_id INTEGER;
BEGIN
    SELECT page_id INTO about_page_id FROM pages WHERE slug = 'about-us';

    IF about_page_id IS NOT NULL THEN
        -- Insert sample blocks if they don't exist
        INSERT INTO page_blocks (page_id, block_type, block_order, configuration)
        SELECT about_page_id, 'hero', 0, '{
            "image_url": "/images/hero-about.jpg",
            "title": "Über RINOS Bikes",
            "subtitle": "Qualität und Leidenschaft für das Radfahren seit 2015",
            "text_alignment": "center",
            "height": "medium"
        }'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM page_blocks WHERE page_id = about_page_id AND block_type = 'hero');

        INSERT INTO page_blocks (page_id, block_type, block_order, configuration)
        SELECT about_page_id, 'text', 1, '{
            "content": "<h2>Unsere Geschichte</h2><p>RINOS Bikes wurde aus der Leidenschaft für hochwertige Fahrräder geboren. Wir glauben, dass jeder Radfahrer das beste Equipment verdient.</p>",
            "alignment": "center",
            "max_width": "800px"
        }'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM page_blocks WHERE page_id = about_page_id AND block_type = 'text');

        INSERT INTO page_blocks (page_id, block_type, block_order, configuration)
        SELECT about_page_id, 'feature_grid', 2, '{
            "title": "Unsere Werte",
            "columns": 3,
            "features": [
                {"icon": "Award", "title": "Qualität", "description": "Nur die besten Komponenten für unsere Fahrräder"},
                {"icon": "Heart", "title": "Leidenschaft", "description": "Wir leben und atmen Radsport"},
                {"icon": "Truck", "title": "Service", "description": "Schnelle Lieferung und kompetente Beratung"}
            ]
        }'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM page_blocks WHERE page_id = about_page_id AND block_type = 'feature_grid');
    END IF;
END $$;
