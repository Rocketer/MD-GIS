Imports System.Drawing
Imports System.IO

Public Class ShipIcon
    Inherits System.Web.UI.Page

    Private ReadOnly Property ShipType As String
        Get
            If Not IsNothing(Request.QueryString("S")) Then
                Return Request.QueryString("S")
            Else
                Return "Unspecific"
            End If
        End Get
    End Property

    Private ReadOnly Property Width As Integer
        Get
            If IsNumeric(Request.QueryString("W")) Then
                Return CInt(Request.QueryString("W"))
            Else
                Return 30
            End If
        End Get
    End Property

    Private ReadOnly Property Height As Integer
        Get
            If IsNumeric(Request.QueryString("H")) Then
                Return CInt(Request.QueryString("H"))
            Else
                Return 30
            End If
        End Get
    End Property

    Private ReadOnly Property Degree As Integer
        Get
            If IsNumeric(Request.QueryString("D")) Then
                Return CInt(Request.QueryString("D"))
            Else
                Return -1
            End If
        End Get
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        RenderPNG()
    End Sub

    Private Sub RenderSVG()
        Dim Content As String = "<svg xmlns=""http://www.w3.org/2000/svg"" xmlns:xlink = ""http://www.w3.org/1999/xlink"""
        Content &= "width =""" & Width & "px"" "
        Content &= "height =""" & Height & "px"" "
        If Degree <> 0 Then
            Content &= "transform =""rotate(" & Degree & ")"" "
        End If
        Content &= ">" & vbLf
        Dim URL As String = ""
        Select Case ShipType.ToUpper
            Case "Cargo".ToUpper
                URL = "Cargo_S_240.png"
            Case "Tanker".ToUpper
                URL = "Tank_S_240.png"
            Case "Passenger".ToUpper
                URL = "Passenger_S_240.png"
            Case "HighSpeed".ToUpper
                URL = "HighSpeed_S_240.png"
            Case "TugAndSpecial".ToUpper
                URL = "Special_S_240.png"
            Case "Fishing".ToUpper
                URL = "Fishing_S_240.png"
            Case "Pleasure".ToUpper
                URL = "Pleasure_S_240.png"
            Case "Navigation".ToUpper
                URL = "Navigation_S_240.png"
            Case Else '"Unspecific"
                URL = "Unspec_S_240.png"

        End Select
        Content &= "<image xlink:href=""images/ShipIcon/" & URL & """/>" & vbLf
        Content &= "</svg>"
        Response.Write(Content)
    End Sub

    Private Sub RenderPNG()

        Dim C As New Converter
        Dim Path As String = "Images/ShipIcon/PNG/" & ShipType & "_"
        If Degree = -1 Then
            'Path &= "C_240.png"
            Path &= "C_240.png"
        Else
            'Path &= "S_240.png"
            Path &= "S_240.png"
        End If
        Dim ImagePath As String = Server.MapPath(Path)
        Dim F As FileStream = File.Open(ImagePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)
        Dim Img As Image = Image.FromStream(F)
        F.Close()

        Img = RotateImage(Img, Degree)
        Dim B As Byte() = C.ImageToByte(Img)

        Response.AddHeader("Content-Type", "image/png")
        Response.BinaryWrite(B)
    End Sub

    Private Function RotateImage(ByRef Image As Image, ByVal Angle As Double) As Image
        Dim returnBitmap As Bitmap = New Bitmap(Image.Width, Image.Height)
        Dim graphics As Graphics = Graphics.FromImage(returnBitmap)
        graphics.TranslateTransform(Image.Width / 2, Image.Height / 2)
        graphics.RotateTransform(Angle)
        graphics.TranslateTransform(-Image.Width / 2, -Image.Height / 2)
        graphics.DrawImage(Image, New Point(0, 0))
        Return returnBitmap
    End Function

End Class