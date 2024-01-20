CREATE TABLE customer (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(255),
    UserGrade VARCHAR(255)
)

CREATE TABLE orders (
    OrderId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    OrderDate DATE,
    OrderType ENUM('order', 'refund'),
    OrderPrice INT
)
