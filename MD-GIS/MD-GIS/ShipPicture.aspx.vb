Imports System.IO
Imports System.Drawing

Public Class ShipPicture
    Inherits System.Web.UI.Page

    Private ReadOnly Property MMSI As String
        Get
            If Not IsNothing(Request.QueryString("MMSI")) Then
                Return Request.QueryString("MMSI")
            Else
                Return ""
            End If
        End Get
    End Property


    Private ReadOnly Property Target As String
        Get
            If Not IsNothing(Request.QueryString("target")) Then
                Return Request.QueryString("target")
            Else
                Return ""
            End If
        End Get
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        RenderPNG()
    End Sub

    Private Sub RenderPNG()

        Dim Path As String = Server.MapPath("Picture/Ship") & "\MMSI"
        If Not File.Exists(Path) Then
            Response.Redirect("Picture/Flag/Unknown.png")
            Exit Sub
        End If
        Dim B As Byte() = ReadFile(Path)
        Dim C As New Converter

        Dim IMG As Image = Image.FromStream(C.ByteToStream(B))
        Select Case Target.ToUpper
            Case "infoWindow".ToUpper
                IMG = ScaleImage(IMG, 90, 90)
        End Select

        Response.AddHeader("Content-Type", "image/png")
        Response.BinaryWrite(C.ImageToByte(IMG))
    End Sub

End Class