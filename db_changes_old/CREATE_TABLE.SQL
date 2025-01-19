-- Master table for USER type
CREATE TABLE M_USER_TYPE (
    USER_TYPE_SRNO INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-incrementing unique role type serial number
    USER_TYPE_NAME VARCHAR(255) NOT NULL,         -- Name of the role type
    USER_TYPE_DESC VARCHAR(255),                  -- Description of the role type
    DEL_FLAG BIT NOT NULL DEFAULT 0,              -- Flag indicating if the role type is marked for deletion (1 = Deleted, 0 = Not deleted)
    DEL_BY VARCHAR(255),                          -- User who marked the record for deletion
    DEL_AT DATETIME,                              -- Timestamp when the record was marked for deletion
    CREATED_BY VARCHAR(255) NOT NULL,             -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),        -- Timestamp when the record was created
    MODIFIED_BY VARCHAR(255),                     -- User who last modified the record
    MODIFIED_AT DATETIME                          -- Timestamp when the record was last modified
);

-- user Master
CREATE TABLE M_USER (
    USER_SRNO INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-incrementing unique user serial number
    USERNAME VARCHAR(255) NOT NULL,           -- Username of the user
    F_NAME VARCHAR(255),                      -- First name of the user
    L_NAME VARCHAR(255),                      -- Last name of the user
    USER_TYPE_SRNO INT FOREIGN KEY REFERENCES M_USER_TYPE(USER_TYPE_SRNO), -- Role type of the user
    PASSWORD VARCHAR(255) NOT NULL,           -- Password of the user
    EMAIL VARCHAR(255),                       -- Email address of the user
    CONTACT_NO VARCHAR(255),                  -- Contact number of the user
    IS_ACTIVE BIT NOT NULL,                   -- Flag indicating if the user is active (1 = Active, 0 = Inactive)
    DEL_FLAG BIT NOT NULL DEFAULT 0,          -- Flag indicating if the user is marked for deletion (1 = Deleted, 0 = Not deleted)
    DEL_BY INT , -- User who marked the record for deletion
    DEL_AT DATETIME,                          -- Timestamp when the record was marked for deletion
    CREATED_BY INT, -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),    -- Timestamp when the record was created
    MODIFIED_BY int, -- User who last modified the record
    MODIFIED_AT DATETIME                      -- Timestamp when the record was last modified
);





-- Master Tables
-- Master table for pipe Inventory status ('Available', 'Reserved', etc.)
CREATE TABLE M_STATUS (
    STATUS_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the inventory status with auto increment
    STATUS_NAME VARCHAR(50),                      -- Name of the inventory status
    STATUS_TYPE VARCHAR(50),                      -- TYPE of the inventory status
);

-- MASTER TABLE FOR OD
CREATE TABLE M_OD (
    OD_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the OD with auto increment
    OD NVARCHAR(50),                                   -- Outer Diameter of the product
    UOM NVARCHAR(50),                                  -- Unit of Measurement
    DEL_FLAG INT DEFAULT 0,                   -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                               -- User who marked it deleted
    DEL_AT DATETIME,                          -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                  -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),    -- Record creation timestamp
    MODIFIED_BY INT,                          -- User who last modified the record
    MODIFIED_AT DATETIME                     -- Timestamp of last modification
);

-- MASTER TABLE FOR THICKNESS

CREATE TABLE M_THICKNESS (
    THICKNESS_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the Thickness with auto increment
    THICKNESS NVARCHAR(50),                                   -- Thickness of the product
    UOM NVARCHAR(50),                                  -- Unit of Measurement
    DEL_FLAG INT DEFAULT 0,                          -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                                      -- User who marked it deleted
    DEL_AT DATETIME,                                 -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                         -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),           -- Record creation timestamp
    MODIFIED_BY INT,                                 -- User who last modified the record
    MODIFIED_AT DATETIME                            -- Timestamp of last modification
);

-- MASTER TABLE FOR GRADE
CREATE TABLE M_GRADE (
    GRADE_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the Grade with auto increment
    GRADE NVARCHAR(50),                           -- Grade of the product
    UOM NVARCHAR(50),                                  -- Unit of Measurement
    DEL_FLAG INT DEFAULT 0,                      -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                                  -- User who marked it deleted
    DEL_AT DATETIME,                             -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                     -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),       -- Record creation timestamp
    MODIFIED_BY INT,                             -- User who last modified the record
    MODIFIED_AT DATETIME                        -- Timestamp of last modification
);


-- Vendors Table
CREATE TABLE M_VENDORS (
    VENDOR_SRNO INT PRIMARY KEY IDENTITY, -- Unique identifier for each vendor
    VENDOR_NAME VARCHAR(255) NOT NULL, -- Vendor's name
    VENDOR_CONTACT_NO VARCHAR(255), -- Vendor's contact number
    VENDOR_ADD VARCHAR(255), -- Vendor's address
    VENDOR_EMAIL VARCHAR(255), -- Vendor's email address
    CREATED_AT DATETIME DEFAULT GETDATE(), -- Record creation timestamp
    CREATED_BY VARCHAR(255), -- Record created by user
    MODIFIED_AT DATETIME, -- Last modification timestamp
    MODIFIED_BY VARCHAR(255), -- Last modified by user
    DEL_FLAG BIT DEFAULT 0, -- Deletion flag (0 = active, 1 = deleted)
    DEL_AT DATETIME, -- Deleted timestamp
    DEL_BY VARCHAR(255), -- Deleted modified by user
);

-- Raw Materials Table
CREATE TABLE RAW_MATERIALS (
    MATERIAL_SRNO INT PRIMARY KEY IDENTITY, -- Unique identifier for each material
    VENDOR_SRNO INT FOREIGN KEY REFERENCES M_VENDORS(VENDOR_SRNO), -- Vendor source
    CHALLAN_NO VARCHAR(100) NOT NULL, -- Challan number for material receipt
    MATERIAL_GRADE_SRNO INT FOREIGN KEY REFERENCES M_GRADE(GRADE_SRNO), -- Material grade reference
    MATERIAL_THICKNESS_SRNO INT FOREIGN KEY REFERENCES M_THICKNESS(THICKNESS_SRNO), -- Material thickness reference
    MATERIAL_WIDTH VARCHAR(10), -- Material width reference
    MATERIAL_WEIGHT DECIMAL(10, 2) NOT NULL, -- Weight of the material
    RECEIVED_DATE DATETIME NOT NULL, -- Date the material was received
    MATERIAL_STATUS_SRNO INT FOREIGN KEY REFERENCES M_STATUS(STATUS_SRNO), -- Current status of the material
    CREATED_AT DATETIME DEFAULT GETDATE(), -- Record creation timestamp
    TEMP_FIELD1 VARCHAR(255), -- Temporary field for future use
    TEMP_FIELD2 VARCHAR(255), -- Temporary field for future use
    TEMP_FIELD3 VARCHAR(255), -- Temporary field for future use
    CREATED_BY VARCHAR(255), -- Record created by user
    MODIFIED_AT DATETIME, -- Last modification timestamp
    MODIFIED_BY VARCHAR(255), -- Last modified by user
    DEL_FLAG BIT DEFAULT 0, -- Deletion flag (0 = active, 1 = deleted)
    DEL_AT DATETIME, -- Deleted timestamp
    DEL_BY VARCHAR(255), -- Deleted modified by user
);

-- Slitting Processes Table
CREATE TABLE SLITTING_PROCESSES (
    SLITTING_SRNO INT PRIMARY KEY IDENTITY, -- Unique identifier for slitting process
    MATERIAL_SRNO INT FOREIGN KEY REFERENCES RAW_MATERIALS(MATERIAL_SRNO), -- Material being slit
    SLITTING_SRNO_FK INT , -- Material being slit
    VENDOR_SRNO INT FOREIGN KEY REFERENCES M_VENDORS(VENDOR_SRNO), -- rEFERENCE TO VENDOR
    SLITTING_LEVEL INT, -- Slitting level (e.g., 1, 2, 3)
    SLITTING_DATE DATETIME NOT NULL, -- Date of slitting
    SLITTING_GRADE_SRNO INT FOREIGN KEY REFERENCES M_GRADE(GRADE_SRNO), -- Material grade reference
    SLITTING_THICKNESS_SRNO INT FOREIGN KEY REFERENCES M_THICKNESS(THICKNESS_SRNO), -- Material thickness reference
    SLITTING_WIDTH VARCHAR(10), -- Material width reference
    SLITTING_WEIGHT DECIMAL(10, 2) NOT NULL, -- Weight of the material
    DC_NO VARCHAR(100), -- Delivery challan number post-slitting
    STATUS_SRNO INT FOREIGN KEY REFERENCES M_STATUS(STATUS_SRNO), -- Status of the process
    IS_SLITTED BIT DEFAULT 0, -- Flag indicating if the material has been slit
    TEMP_FIELD1 VARCHAR(255), -- Temporary field for future use
    TEMP_FIELD2 VARCHAR(255), -- Temporary field for future use
    TEMP_FIELD3 VARCHAR(255), -- Temporary field for future use
    CREATED_AT DATETIME DEFAULT GETDATE(), -- Record creation timestamp
    CREATED_BY VARCHAR(255), -- Record created by user
    MODIFIED_AT DATETIME, -- Last modification timestamp
    MODIFIED_BY VARCHAR(255), -- Last modified by user
    DEL_FLAG BIT DEFAULT 0, -- Deletion flag (0 = active, 1 = deleted)
    DEL_AT DATETIME, -- Deleted timestamp
    DEL_BY VARCHAR(255), -- Deleted modified by user
);


-- -- Alter M_USER Table
-- ALTER TABLE M_USER
-- ADD CONSTRAINT FK_USER_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
--     CONSTRAINT FK_USER_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
--     CONSTRAINT FK_USER_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);

-- Alter M_OD Table
-- Alter M_OD Table
ALTER TABLE M_OD ALTER COLUMN CREATED_BY INT NOT NULL;  -- Ensure it's INT and NOT NULL
ALTER TABLE M_OD ALTER COLUMN DEL_BY INT NULL;          -- Ensure it's INT and NULL
ALTER TABLE M_OD ALTER COLUMN MODIFIED_BY INT NULL;     -- Ensure itL's INT and NUL

ALTER TABLE M_OD
ADD CONSTRAINT FK_OD_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_OD_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_OD_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);

-- Alter M_THICKNESS Table
ALTER TABLE M_THICKNESS ALTER COLUMN CREATED_BY INT NOT NULL;
ALTER TABLE M_THICKNESS ALTER COLUMN DEL_BY INT NULL;
ALTER TABLE M_THICKNESS ALTER COLUMN MODIFIED_BY INT NULL;

ALTER TABLE M_THICKNESS
ADD CONSTRAINT FK_THICKNESS_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_THICKNESS_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_THICKNESS_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);

-- Alter M_GRADE Table
ALTER TABLE M_GRADE ALTER COLUMN CREATED_BY INT NOT NULL;
ALTER TABLE M_GRADE ALTER COLUMN DEL_BY INT NULL;
ALTER TABLE M_GRADE ALTER COLUMN MODIFIED_BY INT NULL;

ALTER TABLE M_GRADE
ADD CONSTRAINT FK_GRADE_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_GRADE_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_GRADE_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);

-- Alter M_VENDORS Table
ALTER TABLE M_VENDORS ALTER COLUMN CREATED_BY INT NOT NULL;
ALTER TABLE M_VENDORS ALTER COLUMN DEL_BY INT NULL;
ALTER TABLE M_VENDORS ALTER COLUMN MODIFIED_BY INT NULL;

ALTER TABLE M_VENDORS
ADD CONSTRAINT FK_VENDOR_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_VENDOR_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_VENDOR_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);

-- Alter RAW_MATERIALS Table
ALTER TABLE RAW_MATERIALS ALTER COLUMN CREATED_BY INT NOT NULL;
ALTER TABLE RAW_MATERIALS ALTER COLUMN DEL_BY INT NULL;
ALTER TABLE RAW_MATERIALS ALTER COLUMN MODIFIED_BY INT NULL;

ALTER TABLE RAW_MATERIALS
ADD CONSTRAINT FK_MATERIALS_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_MATERIALS_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_MATERIALS_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);

-- Alter SLITTING_PROCESSES Table
ALTER TABLE SLITTING_PROCESSES ALTER COLUMN CREATED_BY INT NOT NULL;
ALTER TABLE SLITTING_PROCESSES ALTER COLUMN DEL_BY INT NULL;
ALTER TABLE SLITTING_PROCESSES ALTER COLUMN MODIFIED_BY INT NULL;

ALTER TABLE SLITTING_PROCESSES
ADD CONSTRAINT FK_SLITTING_CREATED_BY FOREIGN KEY (CREATED_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_SLITTING_DEL_BY FOREIGN KEY (DEL_BY) REFERENCES M_USER(USER_SRNO),
    CONSTRAINT FK_SLITTING_MODIFIED_BY FOREIGN KEY (MODIFIED_BY) REFERENCES M_USER(USER_SRNO);
