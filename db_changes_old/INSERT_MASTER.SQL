
-- INSERT DATA IN ABOVE TABLES
INSERT INTO M_USER_TYPE (USER_TYPE_NAME, USER_TYPE_DESC, CREATED_BY) VALUES ('Admin', 'Administrator', 'Admin');
INSERT INTO M_USER_TYPE (USER_TYPE_NAME, USER_TYPE_DESC, CREATED_BY) VALUES ('Manager', 'Manager', 'Admin');
INSERT INTO M_USER_TYPE (USER_TYPE_NAME, USER_TYPE_DESC, CREATED_BY) VALUES ('Technician', 'Technician', 'Admin');

-- INSERT DATA IN ABOVE TABLES FOR USER - 4 REOCRDS
INSERT INTO M_USER (USERNAME, F_NAME, L_NAME, USER_TYPE_SRNO, PASSWORD, EMAIL, CONTACT_NO, IS_ACTIVE, CREATED_BY)
VALUES ('jdoe', 'John', 'Doe', 1, 'password123', 'jdoe@example.com', '1234567890', 1, 1);

INSERT INTO M_USER (USERNAME, F_NAME, L_NAME, USER_TYPE_SRNO, PASSWORD, EMAIL, CONTACT_NO, IS_ACTIVE, CREATED_BY)
VALUES ('asmith', 'Alice', 'Smith', 2, 'password123', 'asmith@example.com', '0987654321', 1, 1);

INSERT INTO M_USER (USERNAME, F_NAME, L_NAME, USER_TYPE_SRNO, PASSWORD, EMAIL, CONTACT_NO, IS_ACTIVE, CREATED_BY)
VALUES ('bwhite', 'Bob', 'White', 3, 'password123', 'bwhite@example.com', '1122334455', 1, 1);

INSERT INTO M_USER (USERNAME, F_NAME, L_NAME, USER_TYPE_SRNO, PASSWORD, EMAIL, CONTACT_NO, IS_ACTIVE, CREATED_BY)
VALUES ('cgreen', 'Charlie', 'Green', 3, 'password123', 'cgreen@example.com', '5566778899', 1, 1);


-- INSERT DUMMY DATA IN ALL MASTER TABLES
-- Insert dummy data into M_STATUS
INSERT INTO M_STATUS (STATUS_NAME, STATUS_TYPE) VALUES 
('Available', 'Inventory'),
('Reserved', 'Inventory'),
('In Use', 'Inventory');

-- Insert dummy data into M_OD
INSERT INTO M_OD (OD, UOM, CREATED_BY) VALUES 
('10', 'mm', 1),
('20', 'mm', 1),
('30', 'mm', 1);

-- Insert dummy data into M_THICKNESS
INSERT INTO M_THICKNESS (THICKNESS, UOM, CREATED_BY) VALUES 
('1.0', 'mm', 1),
('2.0', 'mm', 1),
('3.0', 'mm', 1);

-- Insert dummy data into M_GRADE
INSERT INTO M_GRADE (GRADE, CREATED_BY) VALUES 
('401', 1),
('402', 1),
('403', 1);

-- Insert dummy data into M_VENDORS
INSERT INTO M_VENDORS (VENDOR_NAME, VENDOR_CONTACT_NO, VENDOR_ADD, VENDOR_EMAIL, CREATED_BY) VALUES 
('Vendor 1', '1234567890', 'Address 1', 'vendor1@example.com', 1),
('Vendor 2', '0987654321', 'Address 2', 'vendor2@example.com', 1),
('Vendor 3', '1122334455', 'Address 3', 'vendor3@example.com', 1);

