CREATE TABLE activity_type(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    detail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE warehouse_list(
    id INT NOT NULL AUTO_INCREMENT,
    warehouse_name VARCHAR(255) NOT NULL,
    detail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE warehouse_stock_area(
    id INT NOT NULL AUTO_INCREMENT,
    area_name VARCHAR(255) NOT NULL,
    detail VARCHAR(255),
    warehouse INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (warehouse) REFERENCES warehouse_list(id)
);
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
    status int NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (status) REFERENCES role_status(id)
);
CREATE TABLE permission_list(
    id INT NOT NULL AUTO_INCREMENT,
    permission_name VARCHAR(255) NOT NULL,
    detail VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE role_permission(
    id INT NOT NULL AUTO_INCREMENT,
    role INT NOT NULL,
    permission INT NOT NULL,
    status BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (role) REFERENCES role(id),
    FOREIGN KEY (permission) REFERENCES permission_list(id)
);
CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    status int NOT NULL DEFAULT 1,
    detail VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (role) REFERENCES role(id),
    FOREIGN KEY (status) REFERENCES user_status(id)
);
CREATE TABLE activity_log(
    id INT NOT NULL AUTO_INCREMENT,
    user INT NOT NULL,
    activity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detail VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY (activity) REFERENCES activity_type(id),
    FOREIGN KEY (user) REFERENCES user(id)
);
CREATE TABLE product(
    id INT NOT NULL AUTO_INCREMENT,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NUll,
    location INT NOT NULL,
    detail VARCHAR(512),
    status int NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (status) REFERENCES product_status(id),
    FOREIGN KEY (location) REFERENCES warehouse_stock_area(id),
    FOREIGN KEY (created_by) REFERENCES user(id)
);
CREATE TABLE inventory_log(
    id INT NOT NULL AUTO_INCREMENT,
    reference_number INT NOT NULL,
    action_type INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responsable INT NOT NULL,
    detail VARCHAR(512),
    warehouse INT NOT NULL,
    status int NOT NULL DEFAULT 1,
    refer int,
    PRIMARY KEY(id),
    FOREIGN KEY (responsable) REFERENCES user(id),
    FOREIGN KEY (action_type) REFERENCES import_export_action(id),
    FOREIGN KEY (warehouse) REFERENCES warehouse_list(id),
    FOREIGN KEY (status) REFERENCES inventory_log_status(id)
);
CREATE TABLE inventory_log_product_list(
    id INT NOT NULL AUTO_INCREMENT,
    reference_number INT NOT NULL,
    product_id INT NOT NULL,
    detail VARCHAR(512),
    amount INT NOT NULL,
    balance INT NOT NULL,
    location INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (location) REFERENCES warehouse_stock_area(id),
    FOREIGN KEY (reference_number) REFERENCES inventory_log(id)
);
CREATE TABLE current_product_balance(
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    balance INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);
INSERT INTO activity_type(name)
VALUES ('login'),
    ('logout'),
    ('scan id card'),
    ('import/export product'),
    ('create new user information'),
    ('create new product information'),
    ('create new role information'),
    ('update user information'),
    ('update product information'),
    ('update role information'),
    ('edit / update transaction');
INSERT INTO warehouse_list(warehouse_name, detail)
VALUES(
        'Magic Box Solution',
        'Magic Box Solution warehouse'
    ),
    (
        'ENE KMUTT',
        'Electronics and telecommunication engineering warehouse'
    );
INSERT INTO warehouse_stock_area(area_name, detail, warehouse)
VALUES('MBX-001', '', 1),
    ('MBX-002', '', 1),
    ('MBX-003', '', 1),
    ('MBX-004', '', 1),
    ('MBX-005', '', 1),
    ('MBX-006', '', 1),
    ('MBX-007', '', 1),
    ('MBX-008', '', 1),
    ('MBX-009', '', 1),
    ('MBX-010', '', 1),
    ('ENE-001', '', 2),
    ('ENE-002', '', 2),
    ('ENE-003', '', 2),
    ('ENE-004', '', 2),
    ('ENE-005', '', 2),
    ('ENE-006', '', 2),
    ('ENE-007', '', 2),
    ('ENE-008', '', 2),
    ('ENE-009', '', 2),
    ('ENE-010', '', 2);
INSERT INTO user_status(status_name, detail, status_value)
VALUES (
        "ACTIVE",
        "This user can use this application normally",
        TRUE
    ),
    (
        "INACTIVE",
        "This user has no longer accessable",
        FALSE
    );
INSERT INTO inventory_log_status(status_name, detail, status_value)
VALUES (
        "ACTIVE",
        "This transaction is valid and active",
        TRUE
    ),
    (
        "INACTIVE",
        "This transaction is invalid and inactive, checkout the edited reference",
        FALSE
    );
INSERT INTO product_status(status_name, detail, status_value)
VALUES (
        "AVAILABLE",
        "This product is still in system",
        TRUE
    ),
    (
        "NOT AVAILABLE",
        "This product no longer in this system",
        FALSE
    );
INSERT INTO role_status(status_name, detail, status_value)
VALUES (
        "ACTIVE",
        "This role can work normally in system",
        TRUE
    ),
    (
        "INACTIVE",
        "This role no longer authorized in this system",
        FALSE
    );
INSERT INTO role(role_name, detail)
VALUES (
        "ADMIN",
        "Permission for admin"
    ),
    (
        "CREW",
        "Permission for crew"
    ),
    (
        "REPORTER",
        "Permission for reporter"
    );
INSERT INTO permission_list(permission_name, detail)
VALUES (
        'Map',
        "Access to the map of warehouse and product's location"
    ),
    (
        'Overview',
        'Access to warehouse overview information eg: Activity logs, monthly summary'
    ),
    (
        'Product List',
        'Access to current products data that stored in the warehouse'
    ),
    (
        'Transaction',
        'Access to read and edit the transaction data'
    ),
    (
        'Import Export Product',
        'Access to create a new transaction(Import product to warehouse or Export product from warehouse)'
    ),
    (
        'Role Management',
        'Access to read, create and edit role information'
    ),
    (
        'User Management',
        'Access to read, create and edit user information'
    ),
    (
        'Product Management',
        'Access to read, create and edit product information'
    );
INSERT INTO role_permission(role, permission, status)
VALUES (1, 1, TRUE),
    (1, 2, TRUE),
    (1, 3, TRUE),
    (1, 4, TRUE),
    (1, 5, TRUE),
    (1, 6, TRUE),
    (1, 7, TRUE),
    (1, 8, TRUE),
    (2, 1, TRUE),
    (2, 2, FALSE),
    (2, 3, FALSE),
    (2, 4, FALSE),
    (2, 5, TRUE),
    (2, 6, FALSE),
    (2, 7, FALSE),
    (2, 8, FALSE),
    (3, 1, FALSE),
    (3, 2, TRUE),
    (3, 3, TRUE),
    (3, 4, TRUE),
    (3, 5, FALSE),
    (3, 6, FALSE),
    (3, 7, FALSE),
    (3, 8, FALSE);
INSERT INTO user(
        username,
        firstname,
        lastname,
        password,
        role,
        email
    )
VALUES (
        "SYSTEM",
        "SYSTEM",
        "SYSTEM",
        "SYSTEM",
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "adminAcc",
        "AdminFirstname",
        "AdminLastname",
        "adminpassword",
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "crewAcc",
        "CrewFirstname",
        "CrewLastname",
        "crewpassword",
        2,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "reporterAcc",
        "ReporterFirstname",
        "ReporterLastname",
        "reporterpassword",
        3,
        "chanatip.ras@mail.kmutt.ac.th"
    ),
    (
        "tip",
        "TipFirstName",
        "TipLastName",
        "tip",
        1,
        "chanatip.ras@mail.kmutt.ac.th"
    );
INSERT INTO import_export_action(action_name, action_type)
VALUES ("IMPORT", 'ADD'),
    ("EXPORT", 'DELETE'),
    ("EXPIRED", 'DELETE'),
    ("DAMAGED", 'DELETE');
INSERT INTO product(
        product_id,
        product_name,
        company_name,
        location,
        detail,
        created_by
    )
VALUES (
        "a3KEeZbXBx",
        "Drinking Glass",
        "Magic Box Asia",
        1,
        "some detail",
        1
    ),
    (
        "xEBjTv2RhB",
        "Post it",
        "Magic Box Asia",
        2,
        "some detail",
        1
    ),
    (
        "7i8xzdx1OO",
        "Marker(Black color)",
        "Magic Box Asia",
        3,
        "some detail",
        1
    ),
    (
        "7YcgFL8zb9",
        "Paper(A4)",
        "Magic Box Asia",
        4,
        "some detail",
        1
    ),
    (
        "XmUwfOCzKv",
        "Coffee maker",
        "Magic Box Asia",
        5,
        "some detail",
        1
    ),
    (
        "Y3nSy3Wcsw",
        "U Beer",
        "Magic Box Asia",
        6,
        "some detail",
        1
    ),
    (
        "WWcQZYpEEw",
        "Microwave",
        "Magic Box Asia",
        7,
        "some detail",
        1
    ),
    (
        "BImPJwGAZE",
        "Ceramic Plate",
        "Magic Box Asia",
        8,
        "some detail",
        1
    ),
    (
        "4Eh8SiaaWK",
        "Curtain",
        "Magic Box Asia",
        9,
        "some detail",
        1
    ),
    (
        "Db6yY11WIj",
        "Calendar",
        "Magic Box Asia",
        10,
        "some detail",
        1
    );
INSERT INTO current_product_balance(product_id)
SELECT id
FROM product;