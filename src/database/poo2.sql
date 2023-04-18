-- Active: 1681837823998@@127.0.0.1@3306

CREATE TABLE
    videos (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT NOT NULL,
        duration INTEGER NOT NULL,
        uploaded_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    videos(id, title, duration)
VALUES ('v001', 'Video 1', 60);

SELECT * FROM videos;

DROP TABLE videos;