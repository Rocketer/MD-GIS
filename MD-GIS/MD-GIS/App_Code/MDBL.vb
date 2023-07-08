Imports System.Net
Imports System.Data
Imports System.Data.SqlClient
Imports System.Configuration.ConfigurationManager

Public Class MDBL

    Public ServiceURL As String = AppSettings("ServiceURL").ToString
    Public ConnectionString As String = ConfigurationManager.ConnectionStrings("ConnectionString").ConnectionString

    Public MQTT_HOST As String = ConfigurationManager.AppSettings("MQTT_HOST").ToString
    Public MQTT_SHIP_TOPIC As String = ConfigurationManager.AppSettings("MQTT_SHIP_TOPIC").ToString
    Public MQTT_WATCHDOG_TOPIC As String = ConfigurationManager.AppSettings("MQTT_WATCHDOG_TOPIC").ToString
    Public MQTT_CLIENT_ID As String = ConfigurationManager.AppSettings("MQTT_CLIENT_ID").ToString
    Public SERVER_URL As String = ConfigurationManager.AppSettings("SERVER_URL").ToString

    Public Class CommandResult
        Public Status As Boolean = False
        Public Message As String = ""
        Public Result As Object = Nothing
    End Class

    Public Sub ExecuteNonQuery(ByVal CommandText As String, Optional ByVal Conn As SqlConnection = Nothing, Optional ByVal ForceCloseConnection As Boolean = True)
        Dim Command As New SqlCommand
        If IsNothing(Conn) OrElse Conn.State <> ConnectionState.Open Then
            Conn = New SqlConnection(ConnectionString)
            Conn.Open()
        End If

        With Command
            .Connection = Conn
            .CommandText = CommandText
            .ExecuteNonQuery()
            .Dispose()
        End With

        If ForceCloseConnection Then
            Conn.Close()
            Conn.Dispose()
        End If
    End Sub

    Public Function IsShipHasPicture(ByVal mmsi As String) As Boolean
        Dim SQL As String = "SELECT hasPicture FROM TB_Ship_Picture WHERE mmsi='" & mmsi.Replace("'", "''") & "'"
        Dim DA As New SqlDataAdapter(SQL, ConnectionString)
        Dim DT As New DataTable
        DA.Fill(DT)
        If DT.Rows.Count > 0 AndAlso Not DT.Rows(0).Item("hasPicture") Then
            Return DT.Rows(0).Item("hasPicture")
        Else
            Return False
        End If
    End Function


    Public Function GetShipTypeName_MarineTraffic(ByVal ShipType As String) As String
        Select Case ShipType
            Case "Cargo"
                Return "Cargo Vessel"
            Case "Tanker"
                Return "Tankers"
            Case "Passenger"
                Return "Passenger Vessel"
            Case "HighSpeed"
                Return "High Speed Craft"
            Case "TugAndSpecial"
                Return "Tug And Special"
            Case "Fishing"
                Return "Fishing Boat"
            Case "Pleasure"
                Return "Pleasure Craft"
            Case "Navigation"
                Return "Navigation Aids"
            Case Else
                Return "Unspecify Ship"
        End Select
    End Function

    Public Function GetShipTypeCssClass(ByVal ShipTypeName As String)
        Select Case ShipTypeName
            Case "Cargo"
                Return "success"
            Case "Tanker"
                Return "danger"
            Case "Passenger"
                Return "primary"
            Case "HighSpeed"
                Return "warning"
            Case "TugAndSpecial"
                Return "info"
            Case "Fishing"
                Return "warning"
            Case "Pleasure"
                Return "primary"
            Case "Navigation"
                Return "warning"
            Case Else
                Return "default"
        End Select
    End Function

    Public Function VW_Get_NMEA_ObjectList() As DataTable
        Return VW_Get_NMEA_ObjectList("")
    End Function

    Public Function VW_Get_NMEA_ObjectList(ByVal mmsi As String) As DataTable
        Dim SQL As String = "SELECT * FROM VW_Get_NMEA_ObjectList" & vbLf
        If mmsi <> "" Then
            SQL &= "WHERE mmsi='" & mmsi.Replace("'", "''") & "'" & vbLf
        End If
        Dim DT As New DataTable
        Dim DA As New SqlDataAdapter(SQL, ConnectionString)
        DA.Fill(DT)
        Return DT
    End Function


    Public Function VW_Get_NMEA_History(ByVal mmsi As String) As DataTable
        Dim SQL As String = "SELECT * FROM VW_Get_NMEA_History" & vbLf
        SQL &= "WHERE mmsi='" & mmsi.Replace("'", "''") & "'" & vbLf
        SQL &= "ORDER BY UpdateTime" & vbLf
        Dim DT As New DataTable
        Dim DA As New SqlDataAdapter(SQL, ConnectionString)
        DA.Fill(DT)
        Return DT
    End Function

    Public Function sp_Clear_Ship_Info() As DataTable
        Dim SQL As String = "EXEC dbo.sp_Clear_Ship_Info" & vbLf
        Dim DT As New DataTable
        Dim DA As New SqlDataAdapter(SQL, ConnectionString)
        DA.Fill(DT)
        Return DT
    End Function

    Public Function sp_Clear_Ship_History() As DataTable
        Dim SQL As String = "EXEC dbo.sp_Clear_Ship_History" & vbLf
        Dim DT As New DataTable
        Dim DA As New SqlDataAdapter(SQL, ConnectionString)
        DA.Fill(DT)
        Return DT
    End Function

    Public Function sp_Clear_Ship_From_AIS() As DataTable
        Dim SQL As String = "EXEC dbo.sp_Clear_Ship_From_AIS" & vbLf
        Dim DT As New DataTable
        Dim DA As New SqlDataAdapter(SQL, ConnectionString)
        DA.Fill(DT)
        Return DT
    End Function

    Public Function GetShipFlagCode(ByVal MMSI As String) As String
        Try
            Dim SQL As String = "SELECT Flag FROM MS_Flag WHERE MID='" & Left(MMSI, 3) & "'"
            Dim DT As New DataTable
            Dim DA As New SqlDataAdapter(SQL, ConnectionString)
            DA.Fill(DT)
            Return DT.Rows(0).Item("Flag")
        Catch ex As Exception
            Return "Unknow"
        End Try

    End Function

End Class
