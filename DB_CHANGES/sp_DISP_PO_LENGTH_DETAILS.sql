USE [OMECH_PROD]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Trae AI
-- Create date: Current Date
-- Description: Retrieves length-wise details for PO material mapping
-- =============================================
CREATE PROCEDURE [dbo].[DISP_PO_LENGTH_DETAILS]
    @SCHEDULE_SRNOS NVARCHAR(MAX) = NULL,
    @GRADE_SRNO INT = NULL,
    @THICKNESS_SRNO INT = NULL,
    @OD_SRNO INT = NULL,
    @LENGTH FLOAT = NULL,
    @USER_SRNO INT = NULL,
    @IS_LENGTH_MODAL BIT = 0
AS
BEGIN
    -- Create a temporary table to hold the schedule serial numbers
    DECLARE @TempScheduleSrnos TABLE (SCHEDULE_SRNO INT);
    
    -- Parse the comma-separated list of SCHEDULE_SRNOS
    IF @SCHEDULE_SRNOS IS NOT NULL
    BEGIN
        INSERT INTO @TempScheduleSrnos (SCHEDULE_SRNO)
        SELECT value FROM STRING_SPLIT(@SCHEDULE_SRNOS, ',');
    END
    
    -- Get length-specific details
    SELECT 
        SD.SCHEDULE_DT_SRNO,
        SM.SCHEDULE_SRNO,
        SM.PARTY_NAME,
        SM.PO_NUMBER,
        SM.SCHEDULE_DATE,
        G.GRADE,
        T.THICKNESS,
        O.OD,
        SD.LENGTH,
        SD.QUANTITY AS PIPE_QTY,
        CASE 
            WHEN SM.ITEM_TYPE IN ('COIL', 'SHEET') THEN ISNULL(SD.WEIGHT_KG, 0) 
            ELSE ISNULL(SD.WEIGHT_PER_QTY, 0) * SD.QUANTITY 
        END AS WEIGHT,
        SM.ITEM_TYPE,
        S.STATUS_NAME,
        SD.STATUS_SRNO
    FROM SCHEDULE_DETAIL SD
    INNER JOIN SCHEDULE_MASTER SM ON SD.SCHEDULE_SRNO = SM.SCHEDULE_SRNO
    INNER JOIN M_GRADE G ON SD.GRADE_SRNO = G.GRADE_SRNO
    INNER JOIN M_THICKNESS T ON SD.THICKNESS_SRNO = T.THICKNESS_SRNO
    LEFT JOIN M_OD O ON SD.OD_SRNO = O.OD_SRNO
    LEFT JOIN M_STATUS S ON SD.STATUS_SRNO = S.STATUS_SRNO
    WHERE 
        SD.DEL_FLAG = 0 AND SM.DEL_FLAG = 0
        AND SD.STATUS_SRNO = 11 -- Pending status
        AND (@SCHEDULE_SRNOS IS NULL OR SM.SCHEDULE_SRNO IN (SELECT SCHEDULE_SRNO FROM @TempScheduleSrnos))
        AND (@GRADE_SRNO IS NULL OR SD.GRADE_SRNO = @GRADE_SRNO)
        AND (@THICKNESS_SRNO IS NULL OR SD.THICKNESS_SRNO = @THICKNESS_SRNO)
        AND (@OD_SRNO IS NULL OR SD.OD_SRNO = @OD_SRNO)
        AND (@LENGTH IS NULL OR SD.LENGTH = @LENGTH)
    ORDER BY 
        SD.LENGTH, SM.PARTY_NAME, SM.PO_NUMBER;
END