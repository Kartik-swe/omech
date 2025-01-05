-- Table for managing raw materials
CREATE TABLE RAW_MATERIALS (
    SRNO INT IDENTITY(1,1) PRIMARY KEY, -- Unique identifier for the raw material with auto increment
    MATERIAL_GRADE VARCHAR(50),         -- Grade of the raw material
    QUANTITY_AVAILABLE INT,             -- Quantity available in stock
    TEMP_FIELD1 VARCHAR(50),                   -- Temporary field for future use
    DEL_FLAG INT DEFAULT 0,             -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                         -- User who marked it deleted
    DEL_AT DATETIME,                    -- Timestamp of deletion
    CREATED_BY INT NOT NULL,            -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(), -- Record creation timestamp
    MODIFIED_BY INT,                    -- User who last modified the record
    MODIFIED_AT DATETIME                -- Timestamp of last modification
);

-- Table for managing product details with the parameter OD, thickness and grade-> master table for product
CREATE TABLE M_PRODUCT (
    PRODUCT_SRNO INT IDENTITY(1,1) PRIMARY KEY, -- Unique identifier for the product with auto increment
    PRODUCT_NAME VARCHAR(50) NOT NULL,                 -- Name of the product
    PRODUCT_OD INT NOT NULL,                            -- Outer Diameter of the product
    PRODUCT_THICKNESS INT NOT NULL,                     -- Thickness of the product
    PRODUCT_GRADE INT NOT NULL,                 -- Grade of the product
    TEMP_FIELD1 VARCHAR(50),                   -- Temporary field for future use
    TEMP_FIELD2 VARCHAR(50),                   -- Temporary field for future use
    TEMP_FIELD3 VARCHAR(50),                   -- Temporary field for future use
    DEL_FLAG INT DEFAULT 0,                    -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                                -- User who marked it deleted
    DEL_AT DATETIME,                           -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                   -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),     -- Record creation timestamp
    MODIFIED_BY INT,                           -- User who last modified the record
    MODIFIED_AT DATETIME                      -- Timestamp of last modification
);

-- Table for managing full-length pipes
CREATE TABLE PIPE (
    PIPE_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the pipe with auto increment
    PRODUCT_SRNO INT,                      -- Foreign Key to m_product
    MATERIAL_SRNO INT,                      -- Foreign Key to RAW_MATERIALS
    MACHINE_SRNO INT,                       -- Foreign Key to M_MACHINE
    STAFF_SRNO INT,                         -- Foreign Key to STAFF
    SHIFT_SRNO INT,                         -- Foreign Key to M_SHIFT   
    PIPE_GROUP VARCHAR(50),                 -- Grouping of pipes for processing
    PIPE_QUANTITY INT,                      -- Quantity of pipes   
    OD VARCHAR(50),                                 -- Outer Diameter of the pipe
    THICKNESS VARCHAR(50,                          -- Thickness of the pipe
    GRADE VARCHAR(50),                      -- Grade of the pipe material
    LENGTH INT,                             -- Full length of the pipe
    STATUS_SRNO VARCHAR(50),                -- Pipe status ('Full-Length', 'Processed', etc.)
    PIPE_TYPE VARCHAR(50),                  -- Type ('Full-Length', 'Cut')  
    TEMP_FIELD1 VARCHAR(50),                -- Temporary field for future use     
    TEMP_FIELD2 VARCHAR(50),                -- Temporary field for future use     
    TEMP_FIELD3 VARCHAR(50),                -- Temporary field for future use     
    TEMP_FIELD4 VARCHAR(50),                -- Temporary field for future use     
    CREATED_DATE DATETIME DEFAULT GETDATE(), -- Pipe creation date
    DEL_FLAG INT DEFAULT 0,                 -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                             -- User who marked it deleted
    DEL_AT DATETIME,                        -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),  -- Record creation timestamp
    MODIFIED_BY INT,                        -- User who last modified the record
    MODIFIED_AT DATETIME                   -- Timestamp of last modification
);


-- main Table for staff
CREATE TABLE STAFF (
    STAFF_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the staff with auto increment
    STAFF_NAME VARCHAR(50),                -- Name of the staff
    STAFF_TYPE VARCHAR(50),                -- Type of the staff
    STAFF_DESIGNATION VARCHAR(50),         -- Designation of the staff
    STAFF_SALARY INT,                      -- Salary of the staff
    STAFF_DOJ DATETIME,                    -- Date of joining
    STAFF_DOB DATETIME,                    -- Date of birth
    STAFF_ADDRESS VARCHAR(255),            -- Address of the staff
    STAFF_PHONE VARCHAR(15),               -- Phone number of the staff
    STAFF_EMAIL VARCHAR(50),               -- Email of the staff
    STAFF_GENDER_SRNO VARCHAR(10  ),       -- foreign key OF M_GENDER
    DEL_FLAG INT DEFAULT 0,                 -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                             -- User who marked it deleted
    DEL_AT DATETIME,                        -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),  -- Record creation timestamp
    MODIFIED_BY INT,                        -- User who last modified the record
    MODIFIED_AT DATETIME                   -- Timestamp of last modification
);



-- Table for managing machines data -> master table for machines
CREATE TABLE M_MACHINE (
    MACHINE_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the machine with auto increment
    MACHINE_NAME VARCHAR(50),              -- Name of the machine
    MACHINE_TYPE VARCHAR(50),              -- Type of the machine
    MACHINE_CAPACITY INT,                  -- Capacity of the machine
    DEL_FLAG INT DEFAULT 0,                 -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                             -- User who marked it deleted
    DEL_AT DATETIME,                        -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),  -- Record creation timestamp
    MODIFIED_BY INT,                        -- User who last modified the record
    MODIFIED_AT DATETIME                   -- Timestamp of last modification
);

-- Master Table for gender
CREATE TABLE M_GENDER (
    GENDER_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the gender with auto increment
    GENDER_NAME VARCHAR(50),                      -- Name of the gender
);

-- Master table for staff shift
CREATE TABLE M_SHIFT (
    SHIFT_SRNO INT IDENTITY(1,1) PRIMARY KEY,    -- Unique identifier for the shift with auto increment
    SHIFT_NAME VARCHAR(50),                      -- Name of the shift
    SHIFT_START_TIME TIME,                       -- Start time of the shift
    SHIFT_END_TIME TIME,                         -- End time of the shift
    DEL_FLAG INT DEFAULT 0,                      -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                                  -- User who marked it deleted
    DEL_AT DATETIME,                             -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                     -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),       -- Record creation timestamp
    MODIFIED_BY INT,                             -- User who last modified the record
    MODIFIED_AT DATETIME                        -- Timestamp of last modification
);

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
    DEL_FLAG INT DEFAULT 0,                      -- Soft delete flag (0 = active, 1 = deleted)
    DEL_BY INT,                                  -- User who marked it deleted
    DEL_AT DATETIME,                             -- Timestamp of deletion
    CREATED_BY INT NOT NULL,                     -- User who created the record
    CREATED_AT DATETIME DEFAULT GETDATE(),       -- Record creation timestamp
    MODIFIED_BY INT,                             -- User who last modified the record
    MODIFIED_AT DATETIME                        -- Timestamp of last modification
);



-- list of all master tables  M_MACHINE, M_SHIFT, M_STATUS, M_GENDER -> instert dummy data in these tables
-- Insert dummy data into M_MACHINE
INSERT INTO M_MACHINE (MACHINE_NAME, MACHINE_TYPE, MACHINE_CAPACITY, CREATED_BY)
VALUES 
('Tube Machine 1', 1, 100, 1),
('Laser Machine 1', 2, 50, 1),
('Tube Machine 2', 1, 120, 2);

-- Insert dummy data into M_GENDER
INSERT INTO M_GENDER (GENDER_NAME)
VALUES 
('Male'),
('Female'),
('Other');

-- Insert dummy data into M_SHIFT
INSERT INTO M_SHIFT (SHIFT_NAME, SHIFT_START_TIME, SHIFT_END_TIME, CREATED_BY)
VALUES 
('Morning', '06:00:00', '14:00:00', 1),
('Evening', '14:00:00', '22:00:00', 2),
('Night', '22:00:00', '06:00:00', 1);

-- Insert dummy data into M_STATUS
INSERT INTO M_STATUS (STATUS_NAME, STATUS_TYPE)
VALUES 
('Available', 'status'),
('Reserved', 'status'),
('In Process', 'status'),
('Full Length', 'Pipe'),
('Processed', 'Pipe');

--------------------------------------------------

-- SP for insert or update pipe
CREATE PROCEDURE IU_PIPES 
    @IU_FLAG CHAR(1),                 -- 'I' for Insert, 'U' for Update
    @PIPE_SRNO INT = NULL,         -- Pipe SRNO for update, NULL for insert
    @PRODUCT_NAME VARCHAR(50),     -- Name of the product
    @OD INT,                       -- Outer Diameter
    @THICKNESS INT,                -- Thickness
    @GRADE VARCHAR(50),            -- Grade
    @MATERIAL_SRNO INT,            -- Material SRNO
    @MACHINE_SRNO INT,             -- Machine SRNO
    @STAFF_SRNO INT,               -- Staff SRNO
    @SHIFT_SRNO INT,               -- Shift SRNO
    @PIPE_GROUP VARCHAR(50),       -- Grouping of pipes
    @PIPE_QUANTITY INT,            -- Quantity of pipes
    @LENGTH INT,                   -- Full length of the pipe
    @STATUS_SRNO VARCHAR(50),      -- Pipe status
    @PIPE_TYPE VARCHAR(50),        -- Pipe type
    @CREATED_BY INT,               -- User who created/modified the record
    @MODIFIED_BY INT = NULL        -- User who modified the record
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PRODUCT_SRNO INT;

    -- Check if product exists
    SELECT @PRODUCT_SRNO = PRODUCT_SRNO
    FROM M_PRODUCT
    WHERE PRODUCT_OD = @OD AND PRODUCT_THICKNESS = @THICKNESS AND PRODUCT_GRADE = @GRADE AND DEL_FLAG = 0;

    -- If product doesn't exist, create a new one
    IF @PRODUCT_SRNO IS NULL
    BEGIN
        INSERT INTO M_PRODUCT (PRODUCT_NAME, PRODUCT_OD, PRODUCT_THICKNESS, PRODUCT_GRADE, CREATED_BY, CREATED_AT)
        VALUES (@PRODUCT_NAME, @OD, @THICKNESS, @GRADE, @CREATED_BY, GETDATE());

        SET @PRODUCT_SRNO = SCOPE_IDENTITY(); -- Get the newly created Product_SRNO
    END

    -- Perform Insert or Update based on FLAG
    IF @IU_FLAG = 'I'
    BEGIN
        -- Insert new pipe record
        INSERT INTO PIPE (PRODUCT_SRNO, MATERIAL_SRNO, MACHINE_SRNO, STAFF_SRNO, SHIFT_SRNO, PIPE_GROUP, PIPE_QUANTITY, OD, THICKNESS, GRADE, LENGTH, STATUS_SRNO, PIPE_TYPE, CREATED_BY, CREATED_AT)
        VALUES (@PRODUCT_SRNO, @MATERIAL_SRNO, @MACHINE_SRNO, @STAFF_SRNO, @SHIFT_SRNO, @PIPE_GROUP, @PIPE_QUANTITY, @OD, @THICKNESS, @GRADE, @LENGTH, @STATUS_SRNO, @PIPE_TYPE, @CREATED_BY, GETDATE());
    END
    ELSE IF @IU_FLAG = 'U'
    BEGIN
        -- Update existing pipe record
        UPDATE PIPE
        SET PRODUCT_SRNO = @PRODUCT_SRNO,
            MATERIAL_SRNO = @MATERIAL_SRNO,
            MACHINE_SRNO = @MACHINE_SRNO,
            STAFF_SRNO = @STAFF_SRNO,
            SHIFT_SRNO = @SHIFT_SRNO,
            PIPE_GROUP = @PIPE_GROUP,
            PIPE_QUANTITY = @PIPE_QUANTITY,
            OD = @OD,
            THICKNESS = @THICKNESS,
            GRADE = @GRADE,
            LENGTH = @LENGTH,
            STATUS_SRNO = @STATUS_SRNO,
            PIPE_TYPE = @PIPE_TYPE,
            MODIFIED_BY = @MODIFIED_BY,
            MODIFIED_AT = GETDATE()
        WHERE PIPE_SRNO = @PIPE_SRNO;
    END
END;
GO
--------------------------------------------------