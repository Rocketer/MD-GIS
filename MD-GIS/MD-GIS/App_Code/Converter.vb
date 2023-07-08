Imports System.IO
Imports System.Text
Imports System.Globalization
Imports System.Drawing
Imports System.Data

Public Class Converter
    Public Enum EncodeType
        _DEFAULT = 0
        _ASCII = 1
        _UNICODE = 2
        _UTF32 = 3
        _UTF7 = 4
        _UTF8 = 5
    End Enum

    Public Function StreamToByte(ByVal Stream As System.IO.Stream) As Byte() ' Convert Specify Stream To Byte
        Dim Result() As Byte
        ReDim Result(Stream.Length - 1)
        Stream.Read(Result, 0, Stream.Length)
        StreamToByte = Result.Clone
    End Function

    Public Function ByteToStream(ByVal Buffer() As Byte) As System.IO.MemoryStream ' Convert Byte To Stream
        ByteToStream = New System.IO.MemoryStream(Buffer)
    End Function

    Public Function StringToByte(ByVal Str As String, Optional ByVal Encoding As Integer = EncodeType._DEFAULT) As Byte()
        Select Case Encoding
            Case EncodeType._ASCII
                Return System.Text.Encoding.ASCII.GetBytes(Str)
            Case EncodeType._UNICODE
                Return System.Text.Encoding.Unicode.GetBytes(Str)
            Case EncodeType._UTF32
                Return System.Text.Encoding.UTF32.GetBytes(Str)
            Case EncodeType._UTF7
                Return System.Text.Encoding.UTF7.GetBytes(Str)
            Case EncodeType._UTF8
                Return System.Text.Encoding.UTF8.GetBytes(Str)
            Case Else
                Return System.Text.Encoding.Default.GetBytes(Str)
        End Select
    End Function

    Public Function ByteToString(ByVal Buffer() As Byte, Optional ByVal Encoding As Integer = EncodeType._DEFAULT) As String
        System.Text.Encoding.Default.GetString(Buffer, 0, Buffer.Length)
        Select Case Encoding
            Case EncodeType._ASCII
                Return System.Text.Encoding.ASCII.GetString(Buffer, 0, Buffer.Length)
            Case EncodeType._UNICODE
                Return System.Text.Encoding.Unicode.GetString(Buffer, 0, Buffer.Length)
            Case EncodeType._UTF32
                Return System.Text.Encoding.UTF32.GetString(Buffer, 0, Buffer.Length)
            Case EncodeType._UTF7
                Return System.Text.Encoding.UTF7.GetString(Buffer, 0, Buffer.Length)
            Case EncodeType._UTF8
                Return System.Text.Encoding.UTF8.GetString(Buffer, 0, Buffer.Length)
            Case Else
                Return System.Text.Encoding.Default.GetString(Buffer, 0, Buffer.Length)
        End Select
    End Function

    Public Function BlobToImage(ByVal Blob As String) As Image
        Return Image.FromStream(BlobToStream(Blob))
    End Function

    Public Function BlobToByte(ByVal Blob As String) As Byte()
        Dim b64 As String = Blob.Replace(" ", "+")
        Return Convert.FromBase64String(b64)
    End Function

    Public Function BlobToStream(ByVal Blob As String) As Stream
        Return New System.IO.MemoryStream(BlobToByte(Blob))
    End Function

    Public Function ImageToBlob(ByVal Image As Image) As String
        Return Convert.ToBase64String(ImageToByte(Image))
    End Function

    Public Function ImageToByte(ByVal IMG As Drawing.Image) As Byte()
        Using ST As New MemoryStream()
            IMG.Save(ST, Imaging.ImageFormat.Png)
            Return ST.ToArray()
        End Using
    End Function

    Public Function XMLToDataset(ByVal XMLString As String) As DataSet
        Dim Reader As New StringReader(XMLString)
        Dim DS As New DataSet()
        DS.ReadXml(Reader)
        Return DS
    End Function

    Public Function XMLToDatatable(ByVal XMLString As String) As DataTable
        Dim Reader As New StringReader(XMLString)
        Dim DS As New DataSet()
        DS.ReadXml(Reader)
        Return DS.Tables(0)
    End Function

    Public Function DatasetToXML(ByVal DS As DataSet) As String
        Using Writer As New StringWriter()
            DS.WriteXml(Writer)
            Return Writer.ToString()
        End Using
    End Function

    Public Function DatatableToXML(ByVal DT As DataTable) As String
        Using Writer As New StringWriter()
            DT.WriteXml(Writer)
            Return Writer.ToString()
        End Using
    End Function

    Public Function ImageToStream(ByVal IMG As Drawing.Image) As Stream
        Using ST As New MemoryStream()
            IMG.Save(ST, Imaging.ImageFormat.Png)
            Return ST
        End Using
    End Function

    Public Function ToMonthNameEN(ByVal MonthID As Integer) As String
        Select Case MonthID
            Case 1 : Return "January"
            Case 2 : Return "February"
            Case 3 : Return "March"
            Case 4 : Return "April"
            Case 5 : Return "May"
            Case 6 : Return "June"
            Case 7 : Return "July"
            Case 8 : Return "August"
            Case 9 : Return "September"
            Case 10 : Return "October"
            Case 11 : Return "November"
            Case 12 : Return "December"
            Case Else : Return "Unknow"
        End Select
    End Function

    Public Function ToMonthEng(ByVal MonthID As Integer) As String
        Select Case MonthID
            Case 1
                Return "January"
            Case 2
                Return "February"
            Case 3
                Return "March"
            Case 4
                Return "April"
            Case 5
                Return "May"
            Case 6
                Return "June"
            Case 7
                Return "July"
            Case 8
                Return "August"
            Case 9
                Return "September"
            Case 10
                Return "October"
            Case 11
                Return "November"
            Case 12
                Return "December"
            Case Else
                Return ""
        End Select
    End Function

    Public Function StringToDate(ByVal InputString As String, ByVal Format As String) As DateTime
        Dim Provider As CultureInfo = CultureInfo.GetCultureInfo("en-US")
        System.Threading.Thread.CurrentThread.CurrentCulture = Provider
        Return DateTime.ParseExact(InputString, Format, Provider)
    End Function

    Public Function DateToString(ByVal InputDate As DateTime, ByVal Format As String) As String
        Dim Provider As CultureInfo = CultureInfo.GetCultureInfo("en-US")
        System.Threading.Thread.CurrentThread.CurrentCulture = Provider
        Return InputDate.ToString(Format)
    End Function

    Public Function DateToEpoch(ByVal InputDate As DateTime) As Long
        Dim Provider As CultureInfo = CultureInfo.GetCultureInfo("en-US")
        System.Threading.Thread.CurrentThread.CurrentCulture = Provider
        Return DateDiff(DateInterval.Second, New DateTime(1970, 1, 1), InputDate)
    End Function

End Class
