CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE action(
    id INT NOT NULL AUTO_INCREMENT,
    action_type VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (role) REFERENCES role(id)
);

CREATE TABLE product(
    id INT NOT NULL AUTO_INCREMENT,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NUll,
    location VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE inventory_log(
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    action_type INT NOT NULL,
    amount INT NOT NULL,
    timestamp TIMESTAMP,
    balance INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    responsable INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (responsable) REFERENCES user(id),
    FOREIGN KEY (action_type) REFERENCES action(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE current_product_balance(
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    balance INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

INSERT INTO
    role(role_name)
VALUES
    ("ADMIN"),
    ("CREW"),
    ("REPORTER");

INSERT INTO
    user(username, first_name, last_name, password, role)
VALUES
    (
        "adminAcc",
        "AdminFirstame",
        "AdminLastname",
        "adminpassword",
        1
    ),
    (
        "crewAcc",
        "CrewFirstname",
        "CrewLastname",
        "crewpassword",
        2
    ),
    (
        "reporterAcc",
        "ReporterFirstname",
        "ReporterLastname",
        "reporterpassword",
        3
    );

INSERT INTO
    action(action_type)
VALUES
    ("IMPORT"),
    ("EXPORT"),
    ("EXPIRED"),
    ("DAMAGED");