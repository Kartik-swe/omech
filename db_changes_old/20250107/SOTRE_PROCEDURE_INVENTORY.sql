-- ================================
-- 1. Raw Material Management
-- ================================

-- Procedure: PL_GET_RAW_MATERIALS
-- Purpose: Fetches all raw materials available in the system.
-- When to Use: This is used to load a list of all raw materials for display on the page (e.g., inventory or management page).
CREATE PROCEDURE PL_GET_RAW_MATERIALS
AS
BEGIN
    SELECT 
        SRNO, 
        MATERIAL_GRADE, 
        QUANTITY_AVAILABLE, 
        CREATED_BY, 
        CREATED_AT, 
        MODIFIED_BY, 
        MODIFIED_AT,
        DEL_FLAG, 
        DEL_BY, 
        DEL_AT
    FROM RAW_MATERIALS
    WHERE DEL_FLAG = 0;
END;
GO

-- Procedure: IU_RAW_MATERIAL
-- Purpose: Inserts a new raw material or updates an existing one based on the IU_FLAG.
-- When to Use: This is used when adding or updating raw material information in the system.
CREATE PROCEDURE IU_RAW_MATERIAL
    @IU_FLAG INT,          -- 1 for Insert, 2 for Update
    @SRNO INT = NULL,      -- Only used for update
    @MATERIAL_GRADE VARCHAR(50),
    @QUANTITY_AVAILABLE INT,
    @CREATED_BY INT,
    @MODIFIED_BY INT
AS
BEGIN
    IF @IU_FLAG = 1
    BEGIN
        -- Insert new raw material
        INSERT INTO RAW_MATERIALS (MATERIAL_GRADE, QUANTITY_AVAILABLE, CREATED_BY, CREATED_AT)
        VALUES (@MATERIAL_GRADE, @QUANTITY_AVAILABLE, @CREATED_BY, GETDATE());
    END
    ELSE IF @IU_FLAG = 2
    BEGIN
        -- Update existing raw material
        UPDATE RAW_MATERIALS
        SET 
            MATERIAL_GRADE = @MATERIAL_GRADE,
            QUANTITY_AVAILABLE = @QUANTITY_AVAILABLE,
            MODIFIED_BY = @MODIFIED_BY,
            MODIFIED_AT = GETDATE()
        WHERE SRNO = @SRNO;
    END
END;
GO

-- Procedure: DEL_RAW_MATERIAL
-- Purpose: Soft deletes a raw material record by setting DEL_FLAG to 1.
-- When to Use: This is used when a raw material needs to be marked as deleted in the system.
CREATE PROCEDURE DEL_RAW_MATERIAL
    @SRNO INT,             -- Raw material SRNO to delete
    @DEL_BY INT            -- User who is deleting the record
AS
BEGIN
    UPDATE RAW_MATERIALS
    SET 
        DEL_FLAG = 1, 
        DEL_BY = @DEL_BY, 
        DEL_AT = GETDATE()
    WHERE SRNO = @SRNO;
END;
GO

-- Procedure: DISP_RAW_MATERIAL
-- Purpose: Fetches details of a specific raw material by SRNO for editing purposes.
-- When to Use: This is used when retrieving a single raw material's details for display on an edit form.
CREATE PROCEDURE DISP_RAW_MATERIAL
    @SRNO INT              -- Raw material SRNO to fetch details
AS
BEGIN
    SELECT 
        SRNO, 
        MATERIAL_GRADE, 
        QUANTITY_AVAILABLE, 
        CREATED_BY, 
        CREATED_AT, 
        MODIFIED_BY, 
        MODIFIED_AT,
        DEL_FLAG, 
        DEL_BY, 
        DEL_AT
    FROM RAW_MATERIALS
    WHERE SRNO = @SRNO AND DEL_FLAG = 0;
END;
GO

-- ================================
-- 2. Pipe Management
-- ================================

-- Procedure: PL_GET_PIPES
-- Purpose: Fetches all pipes for display on the page.
-- When to Use: This is used when displaying a list of pipes on a page for inventory or tracking.
CREATE PROCEDURE PL_GET_PIPES
AS
BEGIN
    SELECT 
        SRNO, 
        OD, 
        THICKNESS, 
        GRADE, 
        LENGTH, 
        STATUS, 
        CREATED_BY, 
        CREATED_AT, 
        MODIFIED_BY, 
        MODIFIED_AT,
        DEL_FLAG, 
        DEL_BY, 
        DEL_AT
    FROM PIPE
    WHERE DEL_FLAG = 0;
END;
GO

-- Procedure: IU_PIPE
-- Purpose: Inserts or updates pipe records based on the IU_FLAG.
-- When to Use: This is used when adding or updating pipe details in the system.
CREATE PROCEDURE IU_PIPE
    @IU_FLAG INT,          -- 1 for Insert, 2 for Update
    @SRNO INT = NULL,      -- Only used for update
    @OD INT,               -- Outer diameter
    @THICKNESS INT,        -- Thickness
    @GRADE VARCHAR(50),
    @LENGTH INT,           -- Full length of the pipe
    @STATUS VARCHAR(50),   -- 'Full-Length', 'Processed'
    @CREATED_BY INT,
    @MODIFIED_BY INT
AS
BEGIN
    IF @IU_FLAG = 1
    BEGIN
        -- Insert new pipe
        INSERT INTO PIPE (OD, THICKNESS, GRADE, LENGTH, STATUS, CREATED_BY, CREATED_AT)
        VALUES (@OD, @THICKNESS, @GRADE, @LENGTH, @STATUS, @CREATED_BY, GETDATE());
    END
    ELSE IF @IU_FLAG = 2
    BEGIN
        -- Update existing pipe
        UPDATE PIPE
        SET 
            OD = @OD,
            THICKNESS = @THICKNESS,
            GRADE = @GRADE,
            LENGTH = @LENGTH,
            STATUS = @STATUS,
            MODIFIED_BY = @MODIFIED_BY,
            MODIFIED_AT = GETDATE()
        WHERE SRNO = @SRNO;
    END
END;
GO

-- Procedure: DEL_PIPE
-- Purpose: Soft deletes a pipe by setting DEL_FLAG to 1.
-- When to Use: This is used when a pipe should be marked as deleted in the system.
CREATE PROCEDURE DEL_PIPE
    @SRNO INT,             -- Pipe SRNO to delete
    @DEL_BY INT            -- User who is deleting the record
AS
BEGIN
    UPDATE PIPE
    SET 
        DEL_FLAG = 1, 
        DEL_BY = @DEL_BY, 
        DEL_AT = GETDATE()
    WHERE SRNO = @SRNO;
END;
GO

-- Procedure: DISP_PIPE
-- Purpose: Fetches details of a specific pipe for display on the edit form.
-- When to Use: This is used when retrieving a specific pipe's details for editing purposes.
CREATE PROCEDURE DISP_PIPE
    @SRNO INT              -- Pipe SRNO to fetch details
AS
BEGIN
    SELECT 
        SRNO, 
        OD, 
        THICKNESS, 
        GRADE, 
        LENGTH, 
        STATUS, 
        CREATED_BY, 
        CREATED_AT, 
        MODIFIED_BY, 
        MODIFIED_AT,
        DEL_FLAG, 
        DEL_BY, 
        DEL_AT
    FROM PIPE
    WHERE SRNO = @SRNO AND DEL_FLAG = 0;
END;
GO

-- ================================
-- 3. Inventory Management
-- ================================

-- Procedure: PL_GET_INVENTORY
-- Purpose: Fetches all inventory records for page load.
-- When to Use: This is used to display inventory items (both full-length and cut pipes) on the page.
CREATE PROCEDURE PL_GET_INVENTORY
AS
BEGIN
    SELECT 
        SRNO, 
        MATERIAL_SRNO, 
        PIPE_SRNO, 
        QUANTITY, 
        TYPE, 
        STATUS, 
        CREATED_BY, 
        CREATED_AT, 
        MODIFIED_BY, 
        MODIFIED_AT,
        DEL_FLAG, 
        DEL_BY, 
        DEL_AT
    FROM INVENTORY
    WHERE DEL_FLAG = 0;
END;
GO

-- Procedure: IU_INVENTORY
-- Purpose: Inserts or updates an inventory record based on the IU_FLAG.
-- When to Use: This is used when adding or updating inventory details (full-length or cut pipes).
CREATE PROCEDURE IU_INVENTORY
    @IU_FLAG INT,          -- 1 for Insert, 2 for Update
    @SRNO INT = NULL,      -- Only used for update
    @MATERIAL_SRNO INT,
    @PIPE_SRNO INT,
    @QUANTITY INT,
    @TYPE VARCHAR(50),     -- 'Full-Length' or 'Cut'
    @STATUS VARCHAR(50),   -- 'Available', 'Reserved', etc.
    @CREATED_BY INT,
    @MODIFIED_BY INT
AS
BEGIN
    IF @IU_FLAG = 1
    BEGIN
        -- Insert new inventory record
        INSERT INTO INVENTORY (MATERIAL_SRNO, PIPE_SRNO, QUANTITY, TYPE, STATUS, CREATED_BY, CREATED_AT)
        VALUES (@MATERIAL_SRNO, @PIPE_SRNO, @QUANTITY, @TYPE, @STATUS, @CREATED_BY, GETDATE());
    END
    ELSE IF @IU_FLAG = 2
    BEGIN
        -- Update existing inventory record
        UPDATE INVENTORY
        SET 
            MATERIAL_SRNO = @MATERIAL_SRNO,
            PIPE_SRNO = @PIPE_SRNO,
            QUANTITY = @QUANTITY,
            TYPE = @TYPE,
            STATUS = @STATUS,
            MODIFIED_BY = @MODIFIED_BY,
            MODIFIED_AT = GETDATE()
        WHERE SRNO = @SRNO;
    END
END;
GO

-- Procedure: DEL_INVENTORY
-- Purpose: Soft deletes an inventory record by setting DEL_FLAG to 1.
-- When to Use: This is used when an inventory record needs to be marked as deleted.
CREATE PROCEDURE DEL_INVENTORY
    @SRNO INT,             -- Inventory SRNO to delete
    @DEL_BY INT            -- User who is deleting the record
AS
BEGIN
    UPDATE INVENTORY
    SET 
        DEL_FLAG = 1, 
        DEL_BY = @DEL_BY, 
        DEL_AT = GETDATE()
    WHERE SRNO = @SRNO;
END;
GO

-- ================================
-- 4. Laser Processing Operations
-- ================================

-- Procedure: PL_GET_LASER_PROCESSING
-- Purpose: Fetches laser processing records, including raw material and pipe details.
-- When to Use: This is used to view all laser processing activities and their details.
CREATE PROCEDURE PL_GET_LASER_PROCESSING
AS
BEGIN
    SELECT 
        RP.SRNO, 
        RP.PIPE_SRNO, 
        RP.OPERATION_TYPE, 
        RP.MACHINE_SRNO, 
        RP.CREATED_BY, 
        RP.CREATED_AT, 
        RP.MODIFIED_BY, 
        RP.MODIFIED_AT, 
        RP.DEL_FLAG, 
        RP.DEL_BY, 
        RP.DEL_AT,
        I.QUANTITY AS INVENTORY_QUANTITY,
        M.MATERIAL_GRADE AS RAW_MATERIAL_GRADE,
        P.OD AS PIPE_OD,
        P.THICKNESS AS PIPE_THICKNESS
    FROM LASER_PROCESSING RP
    JOIN INVENTORY I ON RP.PIPE_SRNO = I.PIPE_SRNO
    JOIN RAW_MATERIALS M ON I.MATERIAL_SRNO = M.SRNO
    JOIN PIPE P ON RP.PIPE_SRNO = P.SRNO
    WHERE RP.DEL_FLAG = 0 AND I.DEL_FLAG = 0 AND M.DEL_FLAG = 0 AND P.DEL_FLAG = 0;
END;
GO

-- Procedure: PL_GET_DAILY_PRODUCTION_REPORT
-- Purpose: Fetches the daily production report.
-- When to Use: This is used to generate a daily report based on production data, including raw materials and pipes processed on that day.
CREATE PROCEDURE PL_GET_DAILY_PRODUCTION_REPORT
    @DATE DATE          -- Date for which the report is to be generated
AS
BEGIN
    SELECT 
        RP.SRNO, 
        RP.PIPE_SRNO, 
        RP.OPERATION_TYPE, 
        RP.MACHINE_SRNO, 
        RP.CREATED_BY, 
        RP.CREATED_AT, 
        RP.MODIFIED_BY, 
        RP.MODIFIED_AT, 
        RP.DEL_FLAG, 
        RP.DEL_BY, 
        RP.DEL_AT,
        I.QUANTITY AS INVENTORY_QUANTITY,
        M.MATERIAL_GRADE AS RAW_MATERIAL_GRADE,
        P.OD AS PIPE_OD,
        P.THICKNESS AS PIPE_THICKNESS
    FROM LASER_PROCESSING RP
    JOIN INVENTORY I ON RP.PIPE_SRNO = I.PIPE_SRNO
    JOIN RAW_MATERIALS M ON I.MATERIAL_SRNO = M.SRNO
    JOIN PIPE P ON RP.PIPE_SRNO = P.SRNO
    WHERE RP.CREATED_AT >= @DATE AND RP.CREATED_AT < DATEADD(DAY, 1, @DATE)
        AND RP.DEL_FLAG = 0
        AND I.DEL_FLAG = 0
        AND M.DEL_FLAG = 0
        AND P.DEL_FLAG = 0;
END;
GO

-- Procedure: PL_GET_MONTHLY_PRODUCTION_REPORT
-- Purpose: Fetches the monthly production report.
-- When to Use: This is used to generate a monthly report based on production data, including raw materials and pipes processed during the month.
CREATE PROCEDURE PL_GET_MONTHLY_PRODUCTION_REPORT
    @MONTH INT,          -- Month for which the report is to be generated
    @YEAR INT            -- Year for which the report is to be generated
AS
BEGIN
    SELECT 
        RP.SRNO, 
        RP.PIPE_SRNO, 
        RP.OPERATION_TYPE, 
        RP.MACHINE_SRNO, 
        RP.CREATED_BY, 
        RP.CREATED_AT, 
        RP.MODIFIED_BY, 
        RP.MODIFIED_AT, 
        RP.DEL_FLAG, 
        RP.DEL_BY, 
        RP.DEL_AT,
        I.QUANTITY AS INVENTORY_QUANTITY,
        M.MATERIAL_GRADE AS RAW_MATERIAL_GRADE,
        P.OD AS PIPE_OD,
        P.THICKNESS AS PIPE_THICKNESS
    FROM LASER_PROCESSING RP
    JOIN INVENTORY I ON RP.PIPE_SRNO = I.PIPE_SRNO
    JOIN RAW_MATERIALS M ON I.MATERIAL_SRNO = M.SRNO
    JOIN PIPE P ON RP.PIPE_SRNO = P.SRNO
    WHERE MONTH(RP.CREATED_AT) = @MONTH 
        AND YEAR(RP.CREATED_AT) = @YEAR
        AND RP.DEL_FLAG = 0
        AND I.DEL_FLAG = 0
        AND M.DEL_FLAG = 0
        AND P.DEL_FLAG = 0;
END;
GO

-- ================================
-- 5. Maintenance and Repair
-- ================================

-- Procedure: PL_GET_REPAIR_REQUESTS
-- Purpose: Fetches all repair requests for the pipes.
-- When to Use: This is used to display a list of pipes that need repair, typically used in the maintenance department.
CREATE PROCEDURE PL_GET_REPAIR_REQUESTS
AS
BEGIN
    SELECT 
        SRNO, 
        PIPE_SRNO, 
        REPAIR_REASON, 
        REQUESTED_BY, 
        REQUESTED_AT, 
        REPAIR_STATUS, 
        CREATED_BY, 
        CREATED_AT, 
        MODIFIED_BY, 
        MODIFIED_AT,
        DEL_FLAG, 
        DEL_BY, 
        DEL_AT
    FROM REPAIR_REQUESTS
    WHERE DEL_FLAG = 0;  -- Only non-deleted repair requests
END;
GO

-- Procedure: IU_REPAIR_REQUEST
-- Purpose: Inserts or updates a repair request.
-- When to Use: This is used when a repair request needs to be added or updated for a pipe.
CREATE PROCEDURE IU_REPAIR_REQUEST
    @IU_FLAG INT,          -- 1 for Insert, 2 for Update
    @SRNO INT = NULL,      -- Only used for update
    @PIPE_SRNO INT,
    @REPAIR_REASON VARCHAR(500),
    @REPAIR_STATUS VARCHAR(50),   -- 'Pending', 'In Progress', 'Completed'
    @REQUESTED_BY INT,
    @CREATED_BY INT,
    @MODIFIED_BY INT
AS
BEGIN
    IF @IU_FLAG = 1
    BEGIN
        -- Insert new repair request
        INSERT INTO REPAIR_REQUESTS (PIPE_SRNO, REPAIR_REASON, REPAIR_STATUS, REQUESTED_BY, CREATED_BY, CREATED_AT)
        VALUES (@PIPE_SRNO, @REPAIR_REASON, @REPAIR_STATUS, @REQUESTED_BY, @CREATED_BY, GETDATE());
    END
    ELSE IF @IU_FLAG = 2
    BEGIN
        -- Update existing repair request
        UPDATE REPAIR_REQUESTS
        SET 
            REPAIR_REASON = @REPAIR_REASON,
            REPAIR_STATUS = @REPAIR_STATUS,
            MODIFIED_BY = @MODIFIED_BY,
            MODIFIED_AT = GETDATE()
        WHERE SRNO = @SRNO;
    END
END;
GO
