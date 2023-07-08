Imports Newtonsoft.Json

Public Class ShipInfo
    Inherits System.Web.UI.Page

    Dim BL As New MDBL

    Private ReadOnly Property Mode As String
        Get
            If Not IsNothing(Request.QueryString("Mode")) Then
                Return Request.QueryString("Mode")
            Else
                Return ""
            End If
        End Get
    End Property


    Private ReadOnly Property MMSI As String
        Get
            If Not IsNothing(Request.QueryString("MMSI")) Then
                Return Request.QueryString("MMSI")
            Else
                Return ""
            End If
        End Get
    End Property

    Private ReadOnly Property ShipType As String
        Get
            If Not IsNothing(Request.QueryString("S")) Then
                Return Request.QueryString("S")
            Else
                Return "Unspecific"
            End If
        End Get
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

        Select Case Mode.ToUpper
            Case "GetNmeaObjectList".ToUpper
                GetNmeaObjectList()
            Case "GetShipInfoWindowMini".ToUpper
                GetShipInfoWindowMini()
            Case "GetShipProfile".ToUpper
                GetShipProfile()
            Case "GetHistory".ToUpper
                GetHistory()
        End Select

    End Sub

    Private Sub GetNmeaObjectList()
        Dim URL As String = BL.ServiceURL & "GetNmeaObjectList"
        Dim JSONString As String = GetStringFromURL(URL)

        Dim Ships As List(Of Ship) = JsonConvert.DeserializeObject(Of List(Of Ship))(JSONString)
        JSONString = JsonConvert.SerializeObject(Ships)
        Response.Write(JSONString)
    End Sub

    Private Function GetNmeaObject() As Ship

        Dim URL As String = BL.ServiceURL & "GetNmeaObjectInfo/" & MMSI
        Dim NMEA_Data As String = GetStringFromURL(URL)
        If NMEA_Data.Length < 5 Then
            Return Nothing
        End If

        Dim Ship As Ship = JsonConvert.DeserializeObject(Of Ship)(NMEA_Data)
        Debug.Print(Ship.DataTime)

        If IsNothing(Ship.MMSI) Then
            Return Nothing
        Else
            Return Ship
        End If

    End Function

    Private Sub GetShipInfoWindowMini()

        Dim Ship As Ship = GetNmeaObject()
        If IsNothing(Ship) Then
            Response.Write("Data not found")
            Exit Sub
        End If
        Ship.OptimizeUI()

        Dim C As New Converter
        Dim Content As String = C.ByteToString(ReadFile(Server.MapPath("InfoWindowMini.html")), Converter.EncodeType._UTF8)

        With Ship.OptimizedUI
            Content = Content.Replace("<!--mmsi-->", .MMSI)
            Content = Content.Replace("<!--imoNumber-->", .IMONumber)
            Content = Content.Replace("<!--vesselName-->", .VesselName)
            'Content = Content.Replace("<!--updated-->", .Updated)
            Content = Content.Replace("<!--shipTypeName-->", .ShipTypeName)
            Content = Content.Replace("<!--speedOverGround-->", .SpeedOverGround)
            Content = Content.Replace("<!--navigationStatusName-->", .NavigationStatusName) '
            Content = Content.Replace("<!--origin-->", .Origin)
            Content = Content.Replace("<!--destination-->", .Destination)
            Content = Content.Replace("<!--mmsi-->", .MMSI)
            Content = Content.Replace("<!--vesselName-->", .VesselName)
            'Content = Content.Replace("<!--Updated-->", "<span id='last_updated'></span>")

            '-------- Update Flag------------
            If Not IsNothing(.Flag) AndAlso .Flag <> "" Then
                Content = Content.Replace("<!--flag-->", .Flag)
            Else
                Content = Content.Replace("<!--flag-->", "unknown")
            End If
            '-------- Update Picture --------
            If .HasPicture Then
                Content = Content.Replace("<!--ShipPicture-->", "<img src='ShipPicture.aspx?mmsi=" & .MMSI & "&target=infoWindow' />")
            Else
                Content = Content.Replace("<!--ShipPicture-->", "<i class='fa fa-ship'></i>")
            End If


            Content = Content.Replace("<!--shipTypeName-->", .ShipTypeName)
            Content = Content.Replace("<!--imoNumber-->", .IMONumber)
            Content = Content.Replace("<!--callSign-->", .CallSign)
            Content = Content.Replace("<!--speedOverGround-->", .SpeedOverGround)
            Content = Content.Replace("<!--courseOverGround-->", .CourseOverGround)
            Content = Content.Replace("<!--draught-->", .Draught)
            'Content = Content.Replace("<!--origin-->", .origin)
            'Content = Content.Replace("<!--destination-->", .destination)
            Content = Content.Replace("<!--shipTypeColor-->", .ShipTypeColor.ToLower)
            Content = Content.Replace("<!--shipTypeClassColor-->", (New MDBL).GetShipTypeCssClass(.ShipTypeName))
            Content = Content.Replace("<!--latitude-->", .Latitude)
            Content = Content.Replace("<!--longitude-->", .Longitude)

            '---- Report Updated Time()------------
            'Dim DivScript As String = "div_" & .MMSI
            'Content &= "<div id='" + DivScript + "' style='display:none;'></div>"
            'Content &= vbLf & "<script>" & vbLf
            'Content &= "document.getElementById('" & UpdatedSpan & "').innerHTML="
            'Content &= "reportNMEATime('" & .DataDate & "','" & .DataTime & "');"
            'Content &= "</script>" & vbLf

        End With

        Response.Write(Content)
    End Sub

    Private Sub GetShipProfile()
        Dim Ship As Ship = GetNmeaObject()
        Ship.OptimizeUI()
        Dim JSONString As String = JsonConvert.SerializeObject(Ship.OptimizedUI)
        Response.Write(JSONString)
    End Sub

    Private Sub GetHistory()
        Dim URL As String = BL.ServiceURL & "GetHistory/" & MMSI
        Dim NMEA_Data As String = GetStringFromURL(URL)
        Response.Write(NMEA_Data)
    End Sub

End Class