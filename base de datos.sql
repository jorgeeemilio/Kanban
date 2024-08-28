CREATE SCHEMA kanban_board CHARSET utf8mb4 COLLATE utf8mb4_spanish2_ci;
USE kanban_board;
CREATE TABLE cards (id INT AUTO_INCREMENT, title VARCHAR(45), status VARCHAR(45),
PRIMARY KEY(id));
CREATE TABLE subtasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (card_id) REFERENCES cards(id)
);
CREATE USER 'adminKanban'@'localhost' IDENTIFIED BY 'remoto';
GRANT SELECT, INSERT, DELETE, UPDATE ON kanban_board.* TO 'adminKanban'@'localhost';
FLUSH PRIVILEGES;