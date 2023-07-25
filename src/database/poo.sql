-- Active: 1690225586659@@127.0.0.1@3306

CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    segundos INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);


INSERT INTO videos (id, titulo, segundos, created_at)
VALUES
	('v001', 'Markus - No Futur', '90s', datetime('now', 'localtime'));
	

DROP TABLE videos;

PRAGMA table_info('videos');

SELECT * FROM videos;

    
