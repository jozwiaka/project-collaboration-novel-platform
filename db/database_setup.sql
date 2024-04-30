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


-- Inserting users
INSERT INTO usr (name, email, password_hash) VALUES
('Alice', 'alice@example.com', 'hashed_password_1'),
('Bob', 'bob@example.com', 'hashed_password_2'),
('Charlie', 'charlie@example.com', 'hashed_password_3');

-- Inserting novels
INSERT INTO novel (title, author_id, content) VALUES
('The Great Adventure', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
('Mystery Mansion', 2, 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
('Fantasy World', 3, 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');

-- Inserting tags
INSERT INTO tag (name, user_id) VALUES
('Adventure', 1),
('Adventure2', 1),
('Mystery', 2),
('Mystery2', 2),
('Fantasy', 3),
('Fantasy2', 3);

-- Inserting novel tags
INSERT INTO novel_tag (novel_id, tag_id) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 3), 
(2, 4), 
(3, 5), 
(3, 6); 

-- Inserting collaborators
INSERT INTO collaborator (user_id, novel_id, is_read_only) VALUES
(2, 1, false), -- Bob is a collaborator on The Great Adventure
(3, 2, true); -- Charlie is a read-only collaborator on Mystery Mansion

-- Inserting messages
INSERT INTO message (user_id, novel_id, content) VALUES
(1, 1, 'This is a message about The Great Adventure'),
(2, 2, 'This is a message about Mystery Mansion'),
(3, 3, 'This is a message about Fantasy World');

-- Inserting tokens
INSERT INTO token (user_id, token, expiration_date) VALUES
(1, 'token_1', '2024-05-30 12:00:00'),
(2, 'token_2', '2024-05-30 12:00:00'),
(3, 'token_3', '2024-05-30 12:00:00');
