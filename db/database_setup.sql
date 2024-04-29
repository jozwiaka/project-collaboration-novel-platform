CREATE TABLE usr
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE novel (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES usr(id) ON DELETE CASCADE
);

CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES usr(id) ON DELETE CASCADE,
    CONSTRAINT unique_tag_name_user UNIQUE (name, user_id)
);

CREATE TABLE novel_tag (
    id SERIAL PRIMARY KEY,
    novel_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (novel_id) REFERENCES novel(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    CONSTRAINT unique_novel_tag UNIQUE (novel_id, tag_id)
);

CREATE TABLE collaborator (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    novel_id INT NOT NULL,
    is_read_only BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usr(id) ON DELETE CASCADE,
    FOREIGN KEY (novel_id) REFERENCES novel(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_novel_pair UNIQUE (user_id, novel_id)
);

CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    novel_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usr(id) ON DELETE SET NULL,
    FOREIGN KEY (novel_id) REFERENCES novel(id) ON DELETE CASCADE
);

CREATE TABLE token (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiration_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usr(id) ON DELETE CASCADE
);
