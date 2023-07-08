Public Class Ship

    Public Property DimensionToBow As Integer
    Public Property DimensionToStern As Integer
    Public Property DimensionToPort As Integer
    Public Property DimensionToStarboard As Integer
    Public Property ETA As String
    Public Property RepeatIndicator As Integer
    Public Property RateOfTurn As Double
    Public Property Draught As Double
    '------------ Old Data ---------------
    Public Property Id As String
    Public Property MMSI As String
    Public Property IMONumber As String
    Public Property VesselName As String
    Public Property AISversion As Integer
    Public Property CallSign As String
    Public Property DataDate As String
    Public Property DataTime As String

    Public Property Latitude As Double
    Public Property Longitude As Double
    Public Property LastLatitude As Double
    Public Property LastLongitude As Double

    Public Property SpeedOverGround As Double
    Public Property CourseOverGround As Double
    Public Property ShipTypeId As String
    Public Property ShipTypeName As String
    Public Property ShipTypeColor As String
    Public Property Flag As String
    Public Property Origin As String
    Public Property Destination As String
    Public Property NoOfSattelites As Integer
    Public Property Altitude As Double
    Public Property MagneticVariation As Double
    Public Property GPSIndicator
    Public Property GoeidalSeparation
    '------------ Old Data ---------------
    Public Property NavigationStatusId As String = ""
    Public Property NavigationStatusName As String = ""
    Public Property TrueHeading As Integer
    Public Property AISchannel As String

    Public Property IsBaseStation As Boolean = False
    Public Property baseStationMMSI As String = ""

    Public Property OptimizedUI As UI

    Public Class UI

        Public Property DimensionToBow As String
        Public Property DimensionToStern As String
        Public Property DimensionToPort As String
        Public Property DimensionToStarboard As String
        Public Property ETA As String
        Public Property RepeatIndicator As Integer
        Public Property RateOfTurn As String
        Public Property Draught As String
        Public Property Id As String
        Public Property MMSI As String
        Public Property IMONumber As String
        Public Property VesselName As String
        Public Property AISversion As String
        Public Property CallSign As String
        Public Property DataDate As String
        Public Property DataTime As String

        'Public Property Updated As String = ""
        Public Property Position As String

        Public Property Latitude As Double
        Public Property Longitude As Double
        Public Property LastLatitude As Double
        Public Property LastLongitude As Double

        Public Property SpeedOverGround As String = ""
        Public Property CourseOverGround As String = ""

        Public Property ShipTypeId As String = ""
        Public Property ShipTypeName As String = ""
        Public Property ShipTypeColor As String = ""

        Public Property Flag As String = ""
        Public Property FlagCode As String = "" '-------------- เพิ่มเข้ามาแก้ ----------------

        Public Property Origin As String = ""
        Public Property Destination As String = ""
        Public Property NoOfSattelites As String = ""
        Public Property Altitude As String = ""
        Public Property MagneticVariation As String = ""
        Public Property GPSIndicator As String = ""
        Public Property GoeidalSeparation As String = ""

        Public Property NavigationStatusId As String = ""
        Public Property NavigationStatusName As String = ""
        Public Property TrueHeading As String = ""
        Public Property AISchannel As String = ""

        Public Property IsBaseStation As Boolean = False
        Public Property baseStationMMSI As String = ""

        Public Property HasPicture As Boolean = False

    End Class

    Public Sub OptimizeUI()
        Dim UI As New UI
        Dim BL As New MDBL

        On Error Resume Next
        UI.MMSI = MMSI.ToString
        UI.VesselName = VesselName.ToString
        UI.DataDate = DataDate.ToString
        UI.DataTime = DataTime.ToString

        '------------------------------Updated----------------------------
        'UI.Updated = ""

        'If Not IsNothing(DataDate) AndAlso DataDate.Length = 6 Then
        '    Dim _date As DateTime = DateTime.ParseExact(DataDate, "ddMMyy", Globalization.CultureInfo.CurrentCulture)
        '    UI.Updated &= _date.ToString("dd MMM yyyy") & " "
        'End If
        'If Not IsNothing(DataTime) AndAlso DataTime.ToString.Split(".").Length > 0 Then
        '    Dim _time As String = DataTime.ToString.Split(".")(0)
        '    If _time.Length >= 6 Then
        '        UI.Updated &= _time.Substring(0, 2) & ":" & _time.Substring(2, 2)
        '    End If
        'End If
        'UI.Updated = Trim(UI.Updated)
        'If UI.Updated.Length > 6 Then
        '    Dim TMP As DateTime = DateTime.ParseExact(UI.Updated, "dd MMM yyyy hh:mm", Globalization.CultureInfo.CurrentCulture)
        '    UI.Updated &= vbLf & ReportFriendlyTime(DateDiff(DateInterval.Minute, TMP, Now))
        'End If

        UI.IMONumber = IMONumber.ToString
        UI.CallSign = CallSign.ToString

        UI.Latitude = Latitude
        UI.Longitude = Longitude
        UI.LastLatitude = LastLatitude
        UI.LastLongitude = LastLongitude

        UI.Position = Val(FormatNumber(Latitude, 5)) & vbLf & Val(FormatNumber(Longitude, 5))
        UI.ShipTypeId = ShipTypeId.ToString
        UI.ShipTypeName = ShipTypeName.ToString
        UI.ShipTypeColor = ShipTypeColor.ToString

        UI.Flag = Flag.ToString
        UI.FlagCode = BL.GetShipFlagCode(MMSI.ToString)

        UI.Origin = Origin.ToString
        UI.Destination = Destination.ToString

        If IsNumeric(SpeedOverGround) Then
            If Math.Ceiling(SpeedOverGround) > 1 Then
                UI.SpeedOverGround = SpeedOverGround & " knot(s)"
            Else
                UI.SpeedOverGround = SpeedOverGround & " knot"
            End If
        End If

        If IsNumeric(CourseOverGround) Then UI.CourseOverGround = CourseOverGround & "°"

        If IsNumeric(DimensionToBow) Then UI.DimensionToBow = DimensionToBow & " m."
        If IsNumeric(DimensionToStern) Then UI.DimensionToStern = DimensionToStern & " m."
        If IsNumeric(DimensionToPort) Then UI.DimensionToPort = DimensionToPort & " m."
        If IsNumeric(DimensionToStarboard) Then UI.DimensionToStarboard = DimensionToStarboard & " m."

        UI.ETA = ETAToString(ETA.ToString)
        UI.RepeatIndicator = RepeatIndicator.ToString
        UI.RateOfTurn = RateOfTurn.ToString
        UI.NoOfSattelites = NoOfSattelites.ToString
        UI.Altitude = Altitude.ToString
        UI.MagneticVariation = MagneticVariation.ToString
        UI.GPSIndicator = GPSIndicator.ToString
        UI.GoeidalSeparation = GoeidalSeparation.ToString
        UI.NavigationStatusId = NavigationStatusId.ToString
        UI.NavigationStatusName = NavigationStatusName.ToString
        UI.TrueHeading = TrueHeading.ToString
        UI.AISchannel = AISchannel.ToString
        If IsNumeric(Draught) Then UI.Draught = Draught & " m."

        UI.IsBaseStation = IsBaseStation
        UI.baseStationMMSI = baseStationMMSI.ToString

        '---------- Check Picture -----------
        UI.HasPicture = (New MDBL).IsShipHasPicture(UI.mmsi)

        OptimizedUI = UI
    End Sub



    Private Function ETAToString(ByVal ETA As String) As String
        'MMddHHmm
        Try
            Dim C As New Converter
            Dim D As DateTime = C.StringToDate(ETA, "MMddHHmm")
            Return D.ToString("dd-MMM HH:mm")
        Catch ex As Exception
            Return ETA
        End Try
    End Function

End Class
