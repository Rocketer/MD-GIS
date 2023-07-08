Imports System.Data.SqlClient
Imports Newtonsoft.Json
Imports uPLibrary.Networking.M2Mqtt
Imports uPLibrary.Networking.M2Mqtt.Messages

Public Class API
    Implements System.Web.IHttpHandler

    Dim Context As HttpContext = HttpContext.Current
    Dim C As New Converter
    Dim BL As New MDBL

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

    Private ReadOnly Property Mode As String
        Get
            If Not IsNothing(Context.Request.QueryString("Mode")) Then
                Return Context.Request.QueryString("Mode")
            Else
                Return ""
            End If
        End Get
    End Property

    Private ReadOnly Property W_ID As Integer
        Get
            If Not IsNothing(Context.Request.QueryString("W_ID")) Then
                Return CInt(Context.Request.QueryString("W_ID"))
            Else
                Return -1
            End If
        End Get
    End Property

    Private ReadOnly Property MMSI As String
        Get
            If Not IsNothing(Context.Request.QueryString("MMSI")) AndAlso Context.Request.QueryString("MMSI") <> "" Then
                Return Context.Request.QueryString("MMSI")
            Else
                Return ""
            End If
        End Get
    End Property

    Private ReadOnly Property JsonInput As String
        Get

            If Not IsNothing(Context.Request.InputStream()) AndAlso Context.Request.InputStream().Length > 5 Then
                Return C.ByteToString(C.StreamToByte(Context.Request.InputStream()), Converter.EncodeType._UTF8)
            Else
                Return ""
            End If
        End Get
    End Property

    'Public Class ShipFlag
    '    Public Property MMSI As String = ""
    '    Public Property Flag As String = ""
    'End Class

    Public Class ShipPicture
        Public Property MMSI As String = ""
        Public Property Base64 As String = ""
    End Class

    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        context.Response.ContentType = "text/plain"

        Select Case Mode.ToUpper
            'Case "UpdateShipFlag".ToUpper

            '    Dim Obj As ShipFlag = Nothing
            '    Dim Result As MDBL.CommandResult
            '    Try
            '        Obj = JsonConvert.DeserializeObject(Of ShipFlag)(JsonInput)
            '        If IsNothing(Obj) Then
            '            Err.Raise(999,, "Invalid request format")
            '        End If
            '        Result = UpdateShipFlag(Obj)
            '    Catch ex As Exception
            '        Result = New MDBL.CommandResult
            '        Result.Message = ex.Message
            '    End Try

            '    context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "GetShipDetectedNow".ToUpper

                Dim Result As MDBL.CommandResult
                Try
                    Result = GetShipDetectedNow(W_ID, MMSI)
                Catch ex As Exception
                    Result = New MDBL.CommandResult
                    Result.Message = ex.Message
                End Try
                context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "UpdateShipPicture".ToUpper

                Dim Obj As ShipPicture = Nothing
                Dim Result As MDBL.CommandResult
                Try
                    Obj = JsonConvert.DeserializeObject(Of ShipPicture)(JsonInput)
                    If IsNothing(Obj) Then
                        Err.Raise(999,, "Invalid request format")
                    End If
                    Result = UpdateShipPicture(Obj)
                Catch ex As Exception
                    Result = New MDBL.CommandResult
                    Result.Message = ex.Message
                End Try

                context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "SaveWatchdog".ToUpper

                Dim Obj As WatchDog = Nothing
                Dim Result As MDBL.CommandResult

                Try
                    Obj = JsonConvert.DeserializeObject(Of WatchDog)(JsonInput)
                    If IsNothing(Obj) Then Err.Raise(999, "Invalid setting format")
                Catch ex As Exception
                    Result = New MDBL.CommandResult
                    Result.Message = ex.Message
                    context.Response.Write(JsonConvert.SerializeObject(Result))
                    Exit Sub
                End Try

                Result = SaveWatchdog(Obj)

                context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "GetListWatchDog".ToUpper

                Dim Result As MDBL.CommandResult = GetListWatchDog()
                context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "GetWatchDog".ToUpper

                Dim Result As MDBL.CommandResult = GetWatchDog(W_ID)
                context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "GetWatchDogs".ToUpper

                Dim Result As MDBL.CommandResult = GetWatchDogs()
                context.Response.Write(JsonConvert.SerializeObject(Result))

            Case "DropWatchdog".ToUpper

                Dim Result As MDBL.CommandResult = DROP_Watchdog(W_ID)
                context.Response.Write(JsonConvert.SerializeObject(Result))

        End Select

    End Sub

    'Public Function UpdateShipFlag(ByVal ShipFlag As ShipFlag) As MDBL.CommandResult

    '    Dim Result As New MDBL.CommandResult

    '    If IsNothing(ShipFlag.MMSI) OrElse ShipFlag.MMSI = "" Then
    '        Result.Message = "Invalid MMSI Number"
    '        Return Result
    '    End If

    '    If IsNothing(ShipFlag.Flag) OrElse ShipFlag.Flag.Length <> 2 = "" Then
    '        Result.Message = "Invalid flag code"
    '        Return Result
    '    End If

    '    Try
    '        Dim SQL As String = "SELECT Flag FROM MS_Flag WHERE Flag='" & ShipFlag.Flag.Replace("'", "''") & "'"
    '        Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
    '        Dim DT As New DataTable
    '        DA.Fill(DT)

    '        If DT.Rows.Count = 0 Then
    '            Result.Message = "Invalid flag code"
    '            Return Result
    '        End If

    '        SQL = "SELECT * FROM TB_Ship_Flag WHERE mmsi='" & ShipFlag.MMSI.Replace("'", "''") & "'"
    '        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
    '        DT = New DataTable
    '        DA.Fill(DT)

    '        Dim DR As DataRow
    '        If DT.Rows.Count = 0 Then
    '            DR = DT.NewRow
    '            DR("mmsi") = ShipFlag.MMSI
    '            DT.Rows.Add(DR)
    '        Else
    '            DR = DT.Rows(0)
    '        End If

    '        DR("Flag") = ShipFlag.Flag

    '        Dim CMD As New SqlCommandBuilder(DA)
    '        DA.Update(DT)

    '        Result.Status = True
    '        Result.Message = "Saved successfully"

    '    Catch ex As Exception
    '        Result.Message = ex.Message
    '    End Try

    '    Return Result
    'End Function

    Public Function UpdateShipPicture(ByVal ShipPicture As ShipPicture) As MDBL.CommandResult
        Dim Result As New MDBL.CommandResult

        If IsNothing(ShipPicture.MMSI) OrElse ShipPicture.MMSI = "" Then
            Result.Message = "Invalid MMSI Number"
            Return Result
        End If

        If IsNothing(ShipPicture.Base64) OrElse ShipPicture.Base64 < 10 Then
            Result.Message = "Invalid Picture"
            Return Result
        End If


        Dim Image As Drawing.Image
        Try
            Image = C.BlobToImage(ShipPicture.Base64)
        Catch ex As Exception
            Result.Message = ex.Message
            Return Result
        End Try

        Try
            Dim SQL As String = "SELECT * FROM TB_Ship_Picture WHERE MMSI='" & ShipPicture.MMSI.Replace("'", "''") & "'"
            Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
            Dim DT As New DataTable
            DA.Fill(DT)

            Dim DR As DataRow
            If DT.Rows.Count = 0 Then
                DR = DT.NewRow
                DR("MMSI") = ShipPicture.MMSI
                DT.Rows.Add(DR)
            Else
                DR = DT.Rows(0)
            End If

            DR("HasPicture") = True

            Dim CMD As New SqlCommandBuilder(DA)
            DA.Update(DT)

            Result.Status = True
            Result.Message = "Saved successfully"

        Catch ex As Exception
            Result.Message = ex.Message
        End Try

        Return Result
    End Function

    Public Function SaveWatchdog(ByVal Watchdog As WatchDog) As MDBL.CommandResult

        Dim Result As New MDBL.CommandResult

        If Watchdog.W_Name = "" Then
            Result.Message = "Insert Watchdog Name"
            Return Result
        End If

        If Watchdog.Schedule_Type = WatchDog.ScheduleType.Unknow Then
            Result.Message = "Select schedule"
            Return Result
        End If

        If Watchdog.Period_Type = WatchDog.PeriodType.Unknow Then
            Result.Message = "Select Active Period"
            Return Result
        End If

        Dim UpdateMode As String = "" ' Send Message to Server after saved
        '------------------ Save TB_Watchdog ----------------
        Dim SQL As String = "SELECT * FROM TB_Watchdog WHERE W_ID=" & Watchdog.W_ID
        Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
        Dim DT As New DataTable
        DA.Fill(DT)

        Dim DR As DataRow
        If DT.Rows.Count > 0 Then
            DR = DT.Rows(0)
            UpdateMode = "Update"
        Else
            DR = DT.NewRow
            DT.Rows.Add(DR)
            Watchdog.W_ID = GetNewWatchdogID()
            UpdateMode = "Add"
            DR("IsWorking") = False
        End If

        With Watchdog
            DR("W_ID") = .W_ID
            DR("W_Name") = .W_Name
            DR("W_Desc") = .W_Desc
            DR("Schedule_Type") = .Schedule_Type
            DR("Period_Type") = .Period_Type
            DR("Spatial_Filter_Type") = .Spatial_Filter_Type
            DR("Service_URL") = .Service_URL
            DR("Post_Content") = .Post_Content
            DR("Content_Type") = .Content_Type
            DR("Update_Time") = Now
        End With

        Dim CMD As SqlCommandBuilder

        Try
            CMD = New SqlCommandBuilder(DA)
            DA.Update(DT)
        Catch ex As Exception
            Result.Message = ex.Message
            Return Result
        End Try

        '------------------ Save TB_Watchdog_ActivePeriod ----------------
        DROP_Active_Period(Watchdog.W_ID)
        SQL = "SELECT * FROM TB_Watchdog_Active_Period"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)
        For i As Integer = 0 To Watchdog.Active_Periods.Count - 1
            DR = DT.NewRow
            DR("W_ID") = Watchdog.W_ID
            DR("Period_ID") = i + 1
            Try
                DR("Period_From") = C.StringToDate(Watchdog.Active_Periods(i).Period_From, "dd MMM yyyy")
            Catch ex As Exception
                DR("Period_From") = DBNull.Value
            End Try
            Try
                DR("Period_To") = C.StringToDate(Watchdog.Active_Periods(i).Period_To, "dd MMM yyyy")
            Catch ex As Exception
                DR("Period_From") = DBNull.Value
            End Try
            DT.Rows.Add(DR)
        Next
        If Watchdog.Active_Periods.Count > 0 Then
            Try
                CMD = New SqlCommandBuilder(DA)
                DA.Update(DT)
            Catch ex As Exception
                Result.Message = ex.Message
                Return Result
            End Try
        End If

        '------------------ Save TB_Watchdog_Schedule_Daily ----------------
        DROP_Schedule_Daily(Watchdog.W_ID)
        SQL = "SELECT * FROM TB_Watchdog_Schedule_Daily"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)
        For i As Integer = 0 To Watchdog.Schedule_Daily.Count - 1
            DR = DT.NewRow
            DR("W_ID") = Watchdog.W_ID
            DR("SCH_ID") = i + 1
            DR("SCH_From") = ToTime7(Watchdog.Schedule_Daily(i).SCH_From)
            DR("SCH_To") = ToTime7(Watchdog.Schedule_Daily(i).SCH_To)
            DT.Rows.Add(DR)
        Next
        If Watchdog.Schedule_Daily.Count > 0 Then
            Try
                CMD = New SqlCommandBuilder(DA)
                DA.Update(DT)
            Catch ex As Exception
                Result.Message = ex.Message
                Return Result
            End Try
        End If

        '------------------ Save TB_Watchdog_Schedule_WeekDay ----------------
        DROP_Schedule_Weekday(Watchdog.W_ID)
        SQL = "SELECT * FROM TB_Watchdog_Schedule_WeekDay"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)
        For i As Integer = 0 To Watchdog.Schedule_Weekday.Count - 1
            DR = DT.NewRow
            DR("W_ID") = Watchdog.W_ID
            DR("SCH_ID") = i + 1
            DR("WeekDay") = Watchdog.Schedule_Weekday(i).WeekDay
            DR("SCH_From") = ToTime7(Watchdog.Schedule_Weekday(i).SCH_From)
            DR("SCH_To") = ToTime7(Watchdog.Schedule_Weekday(i).SCH_To)
            DT.Rows.Add(DR)
        Next
        If Watchdog.Schedule_Weekday.Count > 0 Then
            Try
                CMD = New SqlCommandBuilder(DA)
                DA.Update(DT)
            Catch ex As Exception
                Result.Message = ex.Message
                Return Result
            End Try
        End If

        '--------------------- Save TB_Watchdog_Property_Filter-----------
        DROP_Property_Filter(Watchdog.W_ID)
        SQL = "SELECT * FROM TB_Watchdog_Property_Filter"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)

        SQL = "SELECT * FROM TB_Watchdog_Property_Filter_Values"
        Dim VA As New SqlDataAdapter(SQL, BL.ConnectionString)
        Dim VT As New DataTable
        VA.Fill(VT)

        For i As Integer = 0 To Watchdog.Property_Filters.Count - 1
            DR = DT.NewRow
            DR("W_ID") = Watchdog.W_ID
            DR("Filter_ID") = i + 1
            DR("Property_ID") = Watchdog.Property_Filters(i).Property_ID
            DR("Oper_Name") = Watchdog.Property_Filters(i).Oper_Name
            DT.Rows.Add(DR)


            For v As Integer = 0 To Watchdog.Property_Filters(i).values.Count - 1
                Dim VR As DataRow = VT.NewRow
                VR("W_ID") = Watchdog.W_ID
                VR("Filter_ID") = i + 1
                VR("Value_ID") = v + 1
                VR("Value_1") = Watchdog.Property_Filters(i).values(v).Value_1
                VR("Value_2") = Watchdog.Property_Filters(i).values(v).Value_2
                VT.Rows.Add(VR)
            Next
        Next
        If Watchdog.Property_Filters.Count > 0 Then
            Try
                CMD = New SqlCommandBuilder(DA)
                DA.Update(DT)
            Catch ex As Exception
                Result.Message = ex.Message
                Return Result
            End Try
            Try
                CMD = New SqlCommandBuilder(VA)
                VA.Update(VT)
            Catch ex As Exception
                Result.Message = ex.Message
                Return Result
            End Try

        End If

        '--------------------- Save TB_Watchdog_Zone-----------
        DROP_Zone(Watchdog.W_ID)
        SQL = "SELECT W_ID,Zone_ID,Shape_Type,Coordinates,Radius" & vbLf
        SQL &= " ,Stroke_Color,Stroke_Opacity,Stroke_Weight,Fill_Color,Fill_Opacity" & vbLf
        SQL &= " FROM TB_Watchdog_Zone"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)


        For i As Integer = 0 To Watchdog.Zones.Count - 1
            DR = DT.NewRow
            DR("W_ID") = Watchdog.W_ID
            DR("Zone_ID") = i + 1
            DR("Shape_Type") = Watchdog.Zones(i).Shape_Type
            DR("Coordinates") = Watchdog.Zones(i).Coordinates
            If Not IsNothing(Watchdog.Zones(i).Radius) And Not IsDBNull(Watchdog.Zones(i).Radius) Then
                DR("Radius") = Watchdog.Zones(i).Radius
            End If
            DR("Stroke_Color") = Watchdog.Zones(i).Stroke_Color
            DR("Stroke_Opacity") = Watchdog.Zones(i).Stroke_Opacity
            DR("Stroke_Weight") = Watchdog.Zones(i).Stroke_Weight
            DR("Fill_Color") = Watchdog.Zones(i).Fill_Color
            DR("Fill_Opacity") = Watchdog.Zones(i).Fill_Opacity

            DT.Rows.Add(DR)
        Next
        If Watchdog.Zones.Count > 0 Then
            Try
                CMD = New SqlCommandBuilder(DA)
                DA.Update(DT)
            Catch ex As Exception
                Result.Message = ex.Message
                Return Result
            End Try
        End If
        ' Update Geography Data : GEODATA

        DT = Get_TB_Watchdog_Zone(Watchdog.W_ID)
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        For i As Integer = 0 To DT.Rows.Count - 1
            Try
                SQL = "UPDATE TB_Watchdog_Zone SET GEODATA = dbo.FN_Geography_From_Data(Shape_Type,Coordinates,Radius)" & vbNewLine
                SQL &= "WHERE W_ID=" & Watchdog.W_ID & " AND Zone_ID = " & DT.Rows(i).Item("Zone_ID")
                BL.ExecuteNonQuery(SQL, Conn, False)
            Catch ex As Exception
            End Try
        Next
        SQL = "DELETE FROM TB_Watchdog_Zone WHERE W_ID=" & Watchdog.W_ID & " AND GEODATA IS NULL"
        BL.ExecuteNonQuery(SQL, Conn, False)
        Conn.Close()
        Conn.Dispose()

        '----------------- Send MQTT Message
        Dim UpdatedChange As New ConfigChanged
        UpdatedChange.Mode = UpdateMode
        UpdatedChange.W_ID = Watchdog.W_ID
        UpdatedChange.ByClientID = BL.MQTT_CLIENT_ID
        BroadcastMessage(BL.MQTT_WATCHDOG_TOPIC, JsonConvert.SerializeObject(UpdatedChange))


        Result.Status = True
        Result.Message = "Save " & Watchdog.W_Name & " successfully"
        Result.Result = Watchdog.W_ID
        Return Result
    End Function


    Public Sub DROP_Property_Filter_Values(Optional ByVal W_ID As Integer = 0, Optional ByVal Property_ID As Integer = 0, Optional ByVal Value_ID As Integer = 0)

        Dim Filter As String = ""

        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If Property_ID <> 0 Then
            Filter &= " Property_ID = " & Property_ID & " AND "
        End If

        If Value_ID <> 0 Then
            Filter &= " Value_ID = " & Value_ID & " AND "
        End If
        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)

        Dim SQL As String = "DELETE FROM TB_Watchdog_Property_Filter_Values " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()

    End Sub

    Public Sub DROP_Property_Filter(Optional ByVal W_ID As Integer = 0, Optional ByVal Property_ID As Integer = 0)

        '--------- Drop Relative Constrain
        DROP_Property_Filter_Values(W_ID, Property_ID)


        Dim Filter As String = ""
        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If Property_ID <> 0 Then
            Filter &= " Property_ID = " & Property_ID & " AND "
        End If

        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)

        Dim SQL As String = "DELETE FROM TB_Watchdog_Property_Filter " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()

    End Sub

    Public Sub DROP_Zone(ByVal W_ID As Integer, Optional ByVal Zone_ID As Integer = 0)
        Dim Filter As String = ""

        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If Zone_ID <> 0 Then
            Filter &= " Zone_ID = " & Zone_ID & " AND "
        End If

        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)
        Dim SQL As String = "DELETE FROM TB_Watchdog_Zone " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()
    End Sub

    Public Sub DROP_Schedule_Weekday(ByVal W_ID As Integer, Optional ByVal SCH_ID As Integer = 0)

        Dim Filter As String = ""
        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If SCH_ID <> 0 Then
            Filter &= " SCH_ID = " & SCH_ID & " AND "
        End If

        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)

        Dim SQL As String = "DELETE FROM TB_Watchdog_Schedule_WeekDay " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()

    End Sub

    Public Sub DROP_Schedule_Daily(ByVal W_ID As Integer, Optional ByVal SCH_ID As Integer = 0)

        Dim Filter As String = ""
        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If SCH_ID <> 0 Then
            Filter &= " SCH_ID = " & SCH_ID & " AND "
        End If

        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)

        Dim SQL As String = "DELETE FROM TB_Watchdog_Schedule_Daily " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()

    End Sub

    Public Sub DROP_Active_Period(ByVal W_ID As Integer, Optional ByVal Period_ID As Integer = 0)

        Dim Filter As String = ""
        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If Period_ID <> 0 Then
            Filter &= " Period_ID = " & Period_ID & " AND "
        End If

        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)

        Dim SQL As String = "DELETE FROM TB_Watchdog_Active_Period " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()

    End Sub

    Public Function DROP_Watchdog(ByVal W_ID As Integer) As MDBL.CommandResult

        Dim Result As New MDBL.CommandResult

        DROP_Active_Period(W_ID)
        DROP_Schedule_Daily(W_ID)
        DROP_Schedule_Weekday(W_ID)
        DROP_Zone(W_ID)
        DROP_Property_Filter(W_ID)

        Dim Filter As String = ""
        If W_ID <> 0 Then
            Filter &= " W_ID = " & W_ID & " AND "
        End If

        If Filter <> "" Then Filter = " WHERE " & Filter.Substring(0, Filter.Length - 4)

        Dim SQL As String = "DELETE FROM TB_Watchdog " & Filter
        Dim Conn As New SqlConnection(BL.ConnectionString)
        Conn.Open()
        Dim Comm As New SqlCommand
        With Comm
            .Connection = Conn
            .CommandType = CommandType.Text
            .CommandText = SQL
            .ExecuteNonQuery()
            .Dispose()
        End With
        Conn.Close()
        Conn.Dispose()

        '----------------- Send MQTT Message ---------------
        Dim UpdatedChange As New ConfigChanged
        UpdatedChange.Mode = "Delete"
        UpdatedChange.W_ID = W_ID
        UpdatedChange.ByClientID = BL.MQTT_CLIENT_ID
        BroadcastMessage(BL.MQTT_WATCHDOG_TOPIC, JsonConvert.SerializeObject(UpdatedChange))

        Result.Status = True
        Result.Message = "Delete successfully"
        Return Result

    End Function

    Private Function GetNewWatchdogID()
        Dim SQL As String = "SELECT ISNULL(MAX(W_ID),0)+1 W_ID FROM TB_Watchdog "
        Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
        Dim DT As New DataTable
        DA.Fill(DT)
        Return DT.Rows(0).Item("W_ID")
    End Function

    Private Function ToTime7(ByVal Input As String) As Object 'TimeSpan
        Dim A As String() = Input.Split(" ")
        If A.Length <> 2 Then Return DBNull.Value
        Dim T As String() = A(0).Split(":")
        If T.Length <> 2 Then Return DBNull.Value
        If A(1).Length <> 2 Then Return DBNull.Value
        Dim H As Integer = CInt(T(0))
        Dim M As Integer = CInt(T(1))



        Dim Result As TimeSpan
        Select Case A(1)
            Case "AM"
                Result = New TimeSpan(H, M, 0)
            Case "PM"
                Result = New TimeSpan(H + 12, M, 0)
            Case Else
                Return DBNull.Value
        End Select

        Return Result

    End Function

    Private Function Time7ToString(ByVal T As TimeSpan) As String
        Dim H As Integer = T.Hours
        Dim M As Integer = T.Minutes
        If H >= 12 Then
            Return (H - 12) & ":" & M.ToString.PadLeft(2, "0") & " PM"
        Else
            Return H & ":" & M.ToString.PadLeft(2, "0") & " AM"
        End If
    End Function

    Public Function GetListWatchDog() As MDBL.CommandResult

        Dim Result As New MDBL.CommandResult

        Try
            Dim SQL As String = "SELECT * FROM VW_Watchdog"
            Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
            Dim DT As New DataTable
            DA.Fill(DT)
            Result.Message = "Query Success"
            Result.Result = DT
            Result.Status = True
            Return Result
        Catch ex As Exception
            Result.Message = ex.Message
            Return Result
        End Try

    End Function

    Public Function GetWatchDogs() As MDBL.CommandResult

        Dim Result As New MDBL.CommandResult
        Dim DT As DataTable
        Try
            DT = GetListWatchDog.Result
        Catch ex As Exception
            Result.Message = ex.Message
            Return Result
        End Try


        Dim Watchdogs As New List(Of WatchDog)
        If Not IsNothing(DT) Then
            For i As Integer = 0 To DT.Rows.Count - 1
                Try
                    Dim WatchDog As WatchDog = GetWatchDog(DT.Rows(i).Item("W_ID")).Result
                    Watchdogs.Add(WatchDog)
                Catch ex As Exception
                    Result.Message = ex.Message
                    Return Result
                End Try
            Next
        End If


        Result.Status = True
        Result.Result = Watchdogs
        Return Result

    End Function

    Public Function GetWatchDog(ByVal W_ID As Integer) As MDBL.CommandResult
        Dim Result As New MDBL.CommandResult

        Dim Watchdog As New WatchDog

        Dim SQL As String = "SELECT * FROM TB_Watchdog WHERE W_ID=" & W_ID
        Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
        Dim DT As New DataTable
        DA.Fill(DT)
        If DT.Rows.Count = 0 Then
            Result.Message = "Your selected item is not found"
            Return Result
        End If

        With Watchdog
            .W_ID = DT.Rows(0).Item("W_ID")
            .W_Name = DT.Rows(0).Item("W_Name")
            .W_Desc = DT.Rows(0).Item("W_Desc")
            .Schedule_Type = DT.Rows(0).Item("Schedule_Type")
            .Period_Type = DT.Rows(0).Item("Period_Type")
            .Spatial_Filter_Type = DT.Rows(0).Item("Spatial_Filter_Type")
            .Service_URL = DT.Rows(0).Item("Service_URL")
            .Post_Content = DT.Rows(0).Item("Post_Content")
            .Content_Type = DT.Rows(0).Item("Content_Type")
            .IsWorking = DT.Rows(0).Item("IsWorking")
        End With


        '---------------------Schedule_Weekday
        Watchdog.Schedule_Weekday = New List(Of WatchDog.ScheduleWeekday)
        SQL = "SELECT * FROM TB_Watchdog_Schedule_WeekDay WHERE W_ID=" & W_ID & " ORDER BY SCH_ID"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)
        For i As Integer = 0 To DT.Rows.Count - 1
            Dim SCH As New WatchDog.ScheduleWeekday
            SCH.WeekDay = DT.Rows(i).Item("WeekDay")
            If Not IsDBNull(DT.Rows(i).Item("SCH_From")) Then
                SCH.SCH_From = Time7ToString(DT.Rows(i).Item("SCH_From"))
            End If
            If Not IsDBNull(DT.Rows(i).Item("SCH_To")) Then
                SCH.SCH_To = Time7ToString(DT.Rows(i).Item("SCH_To"))
            End If

            Watchdog.Schedule_Weekday.Add(SCH)
        Next

        '---------------------Schedule_Daily
        Watchdog.Schedule_Daily = New List(Of WatchDog.ScheduleDaily)
        SQL = "SELECT * FROM TB_Watchdog_Schedule_Daily WHERE W_ID=" & W_ID & " ORDER BY SCH_ID"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)
        For i As Integer = 0 To DT.Rows.Count - 1
            Dim SCH As New WatchDog.ScheduleDaily
            If Not IsDBNull(DT.Rows(i).Item("SCH_From")) Then
                SCH.SCH_From = Time7ToString(DT.Rows(i).Item("SCH_From"))
            End If
            If Not IsDBNull(DT.Rows(i).Item("SCH_To")) Then
                SCH.SCH_To = Time7ToString(DT.Rows(i).Item("SCH_To"))
            End If
            Watchdog.Schedule_Daily.Add(SCH)
        Next

        '---------------------Active_Periods
        Watchdog.Active_Periods = New List(Of WatchDog.ActivePeriod)
        SQL = "SELECT * FROM TB_Watchdog_Active_Period WHERE W_ID=" & W_ID & " ORDER BY Period_ID"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        DT = New DataTable
        DA.Fill(DT)
        For i As Integer = 0 To DT.Rows.Count - 1
            Dim Period As New WatchDog.ActivePeriod
            If Not IsDBNull(DT.Rows(i).Item("Period_From")) Then
                Period.Period_From = C.DateToString(DT.Rows(i).Item("Period_From"), "dd MMM yyyy")
            End If
            If Not IsDBNull(DT.Rows(i).Item("Period_To")) Then
                Period.Period_To = C.DateToString(DT.Rows(i).Item("Period_To"), "dd MMM yyyy")
            End If
            Watchdog.Active_Periods.Add(Period)
        Next

        '---------------------Property_Filters
        Watchdog.Property_Filters = New List(Of PropertyFilter)
        SQL = "SELECT * FROM TB_Watchdog_Property_Filter WHERE W_ID=" & W_ID & " ORDER BY Filter_ID"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        Dim Prop As New DataTable
        DA.Fill(Prop)

        SQL = "SELECT * FROM TB_Watchdog_Property_Filter_Values WHERE W_ID=" & W_ID & " ORDER BY Filter_ID,Value_ID"
        DA = New SqlDataAdapter(SQL, BL.ConnectionString)
        Dim values As New DataTable
        DA.Fill(values)

        For p As Integer = 0 To Prop.Rows.Count - 1
            Dim Filter As New PropertyFilter
            Filter.Property_ID = Prop.Rows(p).Item("Property_ID")
            Filter.Oper_Name = Prop.Rows(p).Item("Oper_Name").ToString

            values.DefaultView.RowFilter = "Filter_ID=" & Prop.Rows(p).Item("Filter_ID")
            Filter.values = New List(Of PropertyFilter.Value)
            For v As Integer = 0 To values.DefaultView.Count - 1
                Dim Value As New PropertyFilter.Value
                Value.Value_1 = values.DefaultView(v).Item("Value_1").ToString
                Value.Value_2 = values.DefaultView(v).Item("Value_2").ToString
                Filter.values.Add(Value)
            Next

            Watchdog.Property_Filters.Add(Filter)
        Next

        '---------------------Zones
        Watchdog.Zones = New List(Of Zone)
        DT = Get_TB_Watchdog_Zone(W_ID)

        For i As Integer = 0 To DT.Rows.Count - 1
            Dim Zone As New Zone

            Zone.Shape_Type = DT.Rows(i).Item("Shape_Type")
            Zone.Coordinates = DT.Rows(i).Item("Coordinates")
            If Not IsDBNull(DT.Rows(i).Item("Radius")) Then
                Zone.Radius = DT.Rows(i).Item("Radius")
            Else
                Zone.Radius = Nothing
            End If
            Zone.Stroke_Color = DT.Rows(i).Item("Stroke_Color")
            Zone.Stroke_Opacity = DT.Rows(i).Item("Stroke_Opacity")
            Zone.Stroke_Weight = DT.Rows(i).Item("Stroke_Weight")
            Zone.Fill_Color = DT.Rows(i).Item("Fill_Color")
            Zone.Fill_Opacity = DT.Rows(i).Item("Fill_Opacity")
            Watchdog.Zones.Add(Zone)
        Next


        Result.Status = True
        Result.Result = Watchdog
        Return Result
    End Function

    Public Function Get_TB_Watchdog_Zone(Optional ByVal W_ID As Integer = 0) As DataTable

        Dim Sql As String = "SELECT Zone_ID,Shape_Type,Coordinates,Radius,Stroke_Color" & vbLf
        Sql &= ",Stroke_Opacity,Stroke_Weight,Fill_Color,Fill_Opacity" & vbLf
        Sql &= "FROM TB_Watchdog_Zone" & vbLf
        If W_ID <> 0 Then
            Sql &= " WHERE W_ID=" & W_ID & vbLf
        End If
        Sql &= " ORDER BY W_ID,Zone_ID"
        Dim DA As New SqlDataAdapter(Sql, BL.ConnectionString)
        Dim DT As New DataTable
        DA.Fill(DT)
        Return DT
    End Function

    Public Function GetShipDetectedNow(Optional ByVal W_ID As Integer = -1, Optional ByVal MMSI As String = "") As MDBL.CommandResult

        Dim Result As New MDBL.CommandResult

        Dim SQL As String = "SELECT DISTINCT MMSI,IMONumber,VesselName,ShipTypeName,Flag,NavigationStatusName,TrueHeading,MinuteLong" & vbLf
        SQL &= " FROM VW_Ship_Detected_Now" & vbLf

        Dim Filter As String = ""
        If W_ID <> -1 Then
            Filter &= " W_ID=" & W_ID & " AND "
        End If
        If MMSI <> "" Then
            Filter &= " MMSI='" & MMSI.Replace("'", "''") & "' AND "
        End If
        If Filter <> "" Then
            SQL &= " WHERE " & Filter.Substring(0, Filter.Length - 4) & vbLf
        End If

        SQL &= " ORDER BY MinuteLong DESC" & vbLf

        Try
            Dim DA As New SqlDataAdapter(SQL, BL.ConnectionString)
            Dim DT As New DataTable
            DA.Fill(DT)
            Result.Message = "Query Success"
            Result.Result = DT
            Result.Status = True
            Return Result
        Catch ex As Exception
            Result.Message = ex.Message
            Return Result
        End Try

    End Function

    Private Sub BroadcastMessage(ByVal Topic As String, ByVal Message As String)
        Dim client As New MqttClient(BL.MQTT_HOST)
        client.Connect(BL.MQTT_CLIENT_ID)
        client.Publish(Topic, C.StringToByte(Message))
    End Sub

End Class