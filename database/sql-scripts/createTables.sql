CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    detail VARCHAR(512) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE action(
    id INT NOT NULL AUTO_INCREMENT,
    action_type VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE user_status(
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    detail VARCHAR(512),
    PRIMARY KEY(id)
);

CREATE TABLE product_status(
    id INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(255) NOT NULL,
    detail VARCHAR(512),
    PRIMARY KEY(id)
);

CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    status int NOT NULL,
    detail VARCHAR(512),
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
    PRIMARY KEY(id),
    FOREIGN KEY (status) REFERENCES product_status(id)
);

CREATE TABLE inventory_log(
    id INT NOT NULL AUTO_INCREMENT,
    reference_number INT NOT NULL,
    product_id INT NOT NULL,
    action_type INT NOT NULL,
    amount INT NOT NULL,
    timestamp TIMESTAMP,
    balance INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    responsable INT NOT NULL,
    detail VARCHAR(512),
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
    user_status(status_name, detail)
VALUES
    (
        "ACTIVE",
        "This user can use this application normally"
    ),
    (
        "DEACTIVE",
        "This user has no longer accessable"
    );

INSERT INTO
    product_status(status_name, detail)
VALUES
    (
        "AVAILABLE",
        "This product is still in system"
    ),
    (
        "NOT AVAILABLE",
        "This product no longer in this system"
    );

INSERT INTO
    role(role_name, detail)
VALUES
    ("ADMIN", "Permission for admin"),
    ("CREW", "Permission for crew"),
    ("REPORTER", "Permission for reporter");

INSERT INTO
    user(
        username,
        firstname,
        lastname,
        password,
        role,
        status
    )
VALUES
    (
        " adminAcc ",
        " AdminFirstname ",
        " AdminLastname ",
        " adminpassword ",
        1,
        1
    ),
    (
        " crewAcc ",
        " CrewFirstname ",
        " CrewLastname ",
        " crewpassword ",
        2,
        1
    ),
    (
        " reporterAcc ",
        " ReporterFirstname ",
        " ReporterLastname ",
        " reporterpassword ",
        3,
        1
    );

INSERT INTO
    action(action_type)
VALUES
    (" IMPORT "),
    (" EXPORT "),
    (" EXPIRED "),
    (" DAMAGED ");

INSERT INTO
    product(
        product_id,
        product_name,
        company_name,
        location,
        detail,
        status
    )
VALUES
    (
        " a3KEeZbXBx ",
        " Drinking Glass ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " xEBjTv2RhB ",
        " Post it ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " 7i8xzdx1OO ",
        " Marker(Black color) ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " 7YcgFL8zb9 ",
        " Paper(A4) ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " XmUwfOCzKv ",
        " Coffee maker ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " Y3nSy3Wcsw ",
        " U Beer ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " WWcQZYpEEw ",
        " Microwave ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " BImPJwGAZE ",
        " Ceramic Plate ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " 4Eh8SiaaWK ",
        " Curtain ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    ),
    (
        " Db6yY11WIj ",
        " Calendar ",
        " Magic Box Asia ",
        " Setthiwan 5th flr.",
        " some detail ",
        1
    );