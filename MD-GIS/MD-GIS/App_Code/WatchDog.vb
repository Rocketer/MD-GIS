Imports System.Collections.Generic
Public Class WatchDog

    Public Enum ScheduleType
        Allday = 1
        Daily = 2
        Weekday = 3
        Unknow = 0
    End Enum

    Public Enum PeriodType
        Forever = 1
        Assign = 2
        Inactive = 3
        Unknow = 0
    End Enum

    Public Enum SpatialFilterType
        Enter_To = 1
        Exit_From = 2
        Be_Within = 3
        Be_Outside = 4
    End Enum

    Public Class ScheduleWeekday
        Public Property WeekDay As Integer 'Sun = 1, Sat =7
        Public Property SCH_From As String
        Public Property SCH_To As String
    End Class

    Public Class ScheduleDaily
        Public Property SCH_From As String
        Public Property SCH_To As String
    End Class

    Public Class ActivePeriod
        Public Property Period_From As String
        Public Property Period_To As String
    End Class

    '---------------- Tab 1----------------
    Public Property W_ID As Integer
    Public Property W_Name As String
    Public Property W_Desc As String
    Public Property Schedule_Type As ScheduleType
    Public Property Period_Type As PeriodType
    Public Property Schedule_Weekday As List(Of ScheduleWeekday)
    Public Property Schedule_Daily As List(Of ScheduleDaily)
    Public Property Active_Periods As List(Of ActivePeriod)
    '---------------- Tab 2----------------
    Public Property Property_Filters As List(Of PropertyFilter)
    '---------------- Tab 3----------------
    Public Property Zones As List(Of Zone)
    Public Property Spatial_Filter_Type As SpatialFilterType
    '---------------- Tab 4----------------
    Public Property Service_URL As String
    Public Property Post_Content As String
    Public Property Content_Type As String

    Public Property IsWorking As Boolean


End Class
