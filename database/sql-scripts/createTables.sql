CREATE TABLE import_export_action(
    id INT NOT NULL AUTO_INCREMENT,
    action_name VARCHAR(255) NOT NULL,
    action_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE user_status(
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    status_value BOOLEAN NOT NULL,
    detail VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE inventory_log_status(
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    status_value BOOLEAN NOT NULL,
    detail VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE role_status(
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    status_value BOOLEAN NOT NULL,
    detail VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE product_status(
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    status_value BOOLEAN NOT NULL,
    detail VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    detail VARCHAR(512) NOT NULL,
    status int NOT NULL,
    permission JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (status) REFERENCES role_status(id)
);

CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    status int NOT NULL,
    detail VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (role) REFERENCES role(id),
    FOREIGN KEY (status) REFERENCES user_status(id)
);

CREATE TABLE product(
    id INT NOT NULL AUTO_INCREMENT,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NUll,
    location VARCHAR(255) NOT NULL,
    detail VARCHAR(512),
    status int NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (status) REFERENCES product_status(id),
    FOREIGN KEY (created_by) REFERENCES user(id)
);

CREATE TABLE inventory_log(
    id INT NOT NULL AUTO_INCREMENT,
    reference_number INT NOT NULL,
    action_type INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responsable INT NOT NULL,
    detail VARCHAR(512),
    status int NOT NULL DEFAULT 1,
    PRIMARY KEY(id),
    FOREIGN KEY (responsable) REFERENCES user(id),
    FOREIGN KEY (action_type) REFERENCES import_export_action(id),
    FOREIGN KEY (status) REFERENCES inventory_log_status(id)
);

CREATE TABLE inventory_log_product_list(
    id INT NOT NULL AUTO_INCREMENT,
    reference_number INT NOT NULL,
    product_id INT NOT NULL,
    detail VARCHAR(512),
    amount INT NOT NULL,
    balance INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (reference_number) REFERENCES inventory_log(id)
);

CREATE TABLE current_product_balance(
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    balance INT NOT NULL DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

INSERT INTO
    user_status(status_name, detail, status_value)
VALUES
    (
        "ACTIVE",
        "This user can use this application normally",
        TRUE
    ),
    (
        "INACTIVE",
        "This user has no longer accessable",
        FALSE
    );

INSERT INTO
    inventory_log_status(status_name, detail, status_value)
VALUES
    (
        "ACTIVE",
        "This transaction is valid and active",
        TRUE
    ),
    (
        "INACTIVE",
        "This transaction is invalid and inactive, checkout the edited reference",
        FALSE
    );

INSERT INTO
    product_status(status_name, detail, status_value)
VALUES
    (
        "AVAILABLE",
        "This product is still in system",
        TRUE
    ),
    (
        "NOT AVAILABLE",
        "This product no longer in this system",
        FALSE
    );

INSERT INTO
    role_status(status_name, detail, status_value)
VALUES
    (
        "ACTIVE",
        "This role can work normally in system",
        TRUE
    ),
    (
        "INACTIVE",
        "This role no longer authorized in this system",
        FALSE
    );

INSERT INTO
    role(role_name, detail, status, permission)
VALUES
    (
        "ADMIN",
        "Permission for admin",
        1,
        '{"overview": true, "productList": true, "importExport": true, "transaction": true, "map": true, "userManagement": true, "productManagement": true, "roleManagement": true}'
    ),
    (
        "CREW",
        "Permission for crew",
        1,
        '{"overview": false, "productList": false, "importExport": true, "transaction": true, "map": true, "userManagement":false, "productManagement":false, "roleManagement": false}'
    ),
    (
        "REPORTER",
        "Permission for reporter",
        1,
        '{"overview": true, "productList": true, "importExport": false, "transaction": true, "map": true, "userManagement":false, "productManagement":false, "roleManagement": false}'
    );

INSERT INTO
    user(
        username,
        firstname,
        lastname,
        password,
        role,
        status,
        email
    )
VALUES
    (
        "SYSTEM",
        "SYSTEM",
        "SYSTEM",
        "SYSTEM",
        1,
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "adminAcc",
        "AdminFirstname",
        "AdminLastname",
        "adminpassword",
        1,
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "crewAcc",
        "CrewFirstname",
        "CrewLastname",
        "crewpassword",
        2,
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "reporterAcc",
        "ReporterFirstname",
        "ReporterLastname",
        "reporterpassword",
        3,
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "tip",
        "TipFirstName",
        "TipLastName",
        "tip",
        1,
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    );

INSERT INTO
    import_export_action(action_name, action_type)
VALUES
    ("IMPORT", 'ADD'),
    ("EXPORT", 'DELETE'),
    ("EXPIRED", 'DELETE'),
    ("DAMAGED", 'DELETE');

INSERT INTO
    product(
        product_id,
        product_name,
        company_name,
        location,
        detail,
        status,
        created_by
    )
VALUES
    (
        "a3KEeZbXBx",
        "Drinking Glass",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "xEBjTv2RhB",
        "Post it",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "7i8xzdx1OO",
        "Marker(Black color)",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "7YcgFL8zb9",
        "Paper(A4)",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "XmUwfOCzKv",
        "Coffee maker",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "Y3nSy3Wcsw",
        "U Beer",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "WWcQZYpEEw",
        "Microwave",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "BImPJwGAZE",
        "Ceramic Plate",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "4Eh8SiaaWK",
        "Curtain",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    ),
    (
        "Db6yY11WIj",
        "Calendar",
        "Magic Box Asia",
        "Setthiwan 5th flr.",
        "some detail",
        1,
        1
    );

INSERT INTO
    current_product_balance(product_id, location)
SELECT
    id,
    location
FROM
    product;