Imports System.Data
Imports System.Security.Cryptography
Imports System.IO
Imports System.Net

Module ModuleGlobal

#Region "Script"
    Public Sub ImplementJavaMoneyText(ByRef Obj As WebControls.TextBox, Optional ByVal MaxValue As Double = Double.MaxValue, Optional ByVal Align As String = "Right")
        Obj.Attributes("OnChange") &= "this.value=formatmoney(this.value,'0','" & MaxValue & "');"
        Obj.Style.Item("Text-Align") = Align
    End Sub

    Public Sub ImplementJavaIntegerText(ByRef Obj As WebControls.TextBox, ByVal IncludeComma As Boolean, Optional ByVal MaxValue As Long = Long.MaxValue, Optional ByVal Align As String = "Right")
        Obj.Attributes("OnChange") &= "this.value=formatinteger(this.value,0," & MaxValue & "," & IncludeComma.ToString.ToLower & ");"
        Obj.Style.Item("Text-Align") = Align
    End Sub

    Public Sub ImplementJavaOnlyNumberText(ByRef Obj As WebControls.TextBox, Optional ByVal Align As String = "Right")
        Obj.Attributes("OnChange") &= "this.value=formatonlynumber(this.value);"
        Obj.Style.Item("Text-Align") = Align
    End Sub

    Public Sub ImplementJavaNumericText(ByRef Obj As WebControls.TextBox, Optional ByVal Align As String = "Right")
        Obj.Attributes("OnChange") &= "this.value=formatnumeric(this.value,'-999999999999','999999999999');"
        Obj.Style.Item("Text-Align") = Align
    End Sub

    Public Sub ImplementJavaNumericText(ByRef Obj As WebControls.TextBox, ByVal MaxDecimalPlace As Integer, ByVal Align As String)
        Obj.Attributes("OnChange") &= "this.value=formatnumericLimitPlace(this.value,'-999999999999','999999999999'," & MaxDecimalPlace & ");"
        Obj.Style.Item("Text-Align") = Align
    End Sub

    Public Sub ImplementJavaFloatText(ByRef Obj As WebControls.TextBox, ByVal DecimalPlace As UInteger, Optional ByVal Align As String = "Right")
        Obj.Attributes("OnChange") &= "this.value=formatfloat(this.value,'-999999999999','999999999999'," & DecimalPlace & ");"
        Obj.Style.Item("Text-Align") = Align
    End Sub

    Public Sub ImplementJavaResizeTextboxByContent(ByRef Obj As WebControls.TextBox, ByVal OneCharacterWidth As Integer)
        Obj.Attributes("onKeyUp") &= GetJavaResizeTextboxByContent(Obj, OneCharacterWidth)
        Obj.Attributes("OnChange") &= GetJavaResizeTextboxByContent(Obj, OneCharacterWidth)
    End Sub

    Public Sub ImplementJavaResizeDropdonwByContent(ByRef Obj As WebControls.DropDownList, ByVal OneCharacterWidth As Integer)
        Obj.Attributes("OnChange") &= GetJavaResizeDropdonwByContent(Obj, OneCharacterWidth)
    End Sub

    Public Function GetJavaResizeTextboxByContent(ByRef Obj As WebControls.TextBox, ByVal OneCharacterWidth As Integer) As String
        Return "resizeTextboxByContent('" & Obj.ClientID & "'," & OneCharacterWidth & ");"
    End Function
    Public Function GetJavaResizeDropdonwByContent(ByRef Obj As WebControls.DropDownList, ByVal OneCharacterWidth As Integer) As String
        Return "resizeDropdownByContent('" & Obj.ClientID & "'," & OneCharacterWidth & ");"
    End Function

    Public Function FormatNumericText(ByVal Value As Double, Optional ByVal IncludedComma As Boolean = True) As String
        Dim Crop As String = Value.ToString
        Dim DecPlace As Integer = 0
        Dim SpltPath As String() = Crop.Split(".")
        If SpltPath.Length > 1 Then
            DecPlace = Len(SpltPath(1))
        End If
        Return FormatNumber(Value, DecPlace,,, IncludedComma)
    End Function

    Public Function FormatNumericTextLimitPlace(ByVal Value As Double, ByVal IncludedComma As Boolean, ByVal MaxDecimalPlace As Integer) As String
        Dim Crop As String = Value.ToString
        Dim DecPlace As Integer = 0
        Dim SpltPath As String() = Crop.Split(".")
        If SpltPath.Length > 1 Then
            DecPlace = Len(SpltPath(1))
            If DecPlace > MaxDecimalPlace Then DecPlace = MaxDecimalPlace
        End If
        Return FormatNumber(Value, DecPlace,,, IncludedComma)
    End Function

    Public Sub Redirect(ByVal Page As Page, ByVal URL As String)
        ScriptManager.RegisterStartupScript(Page, GetType(String), "Redirect", "window.location.href='" & URL & "';", True)
    End Sub

    Public Sub Alert(ByVal Page As Page, ByVal Message As String)
        ScriptManager.RegisterStartupScript(Page, GetType(String), "Alert", "alert('" & Message.Replace("'", "\""") & "');", True)
    End Sub

    Public Sub CloseWindow(ByVal Page As Page)
        ScriptManager.RegisterStartupScript(Page, GetType(String), "CloseWindow", "window.close();", True)
    End Sub

    Public Sub CloseTopWindow(ByVal Page As Page)
        ScriptManager.RegisterStartupScript(Page, GetType(String), "CloseWindow", "top.close();", True)
    End Sub

    Public Sub ShowDialogEditSVG(ByVal Page As Page, ByVal UNIQUE_POPUP_ID As String, ByVal OKButton As String, Optional ByVal DisplayTitle As Boolean = True, Optional ByVal DisplayType As Boolean = True, Optional ByVal DisplayDesc As Boolean = True, Optional ByVal DisplayTag As Boolean = True, Optional ByVal _ReadOnly As Boolean = False)
        Dim Script As String = "ShowDialogEditSVG('" & UNIQUE_POPUP_ID.Replace("'", "\'") & "','" & OKButton & "','" & DisplayTitle.ToString & "','" & DisplayType.ToString & "','" & DisplayDesc.ToString & "','" & DisplayTag & "','" & _ReadOnly & "','" & Now.ToOADate.ToString.Replace(".", "") & "');"
        ScriptManager.RegisterStartupScript(Page, GetType(String), UNIQUE_POPUP_ID, Script, True)
    End Sub

    Public Sub ShowDialogEditDoc(ByVal Page As Page, ByVal UNIQUE_POPUP_ID As String, ByVal OKButton As String, Optional ByVal DisplayTitle As Boolean = True, Optional ByVal DisplayType As Boolean = True, Optional ByVal DisplayDesc As Boolean = True, Optional ByVal DisplayTag As Boolean = True, Optional ByVal _ReadOnly As Boolean = False)
        Dim Script As String = "ShowDialogEditDoc('" & UNIQUE_POPUP_ID.Replace("'", "\'") & "','" & OKButton & "','" & DisplayTitle.ToString & "','" & DisplayType.ToString & "','" & DisplayDesc.ToString & "','" & DisplayTag & "','" & _ReadOnly & "','" & Now.ToOADate.ToString.Replace(".", "") & "');"
        ScriptManager.RegisterStartupScript(Page, GetType(String), UNIQUE_POPUP_ID, Script, True)
    End Sub

    Public Enum ToastrMode
        Success = 1
        Warning = 2
        Danger = 3
        Info = 4
        Confirm = 5
    End Enum

    Public Enum ToastrPositon
        TopLeft = 1
        Top = 2
        TopRight = 3
        BottomLeft = 4
        Bottom = 5
        BottomRight = 6
    End Enum

    Public Sub Message_Toastr(ByVal Message As String, ByVal Mode As ToaStrMode, ByVal Position As ToaStrPositon, ByVal Page As Page, Optional ByVal TimeOut_MS As Integer = 5000)
        Dim _mode As String = ""

        Select Case Mode
            Case ToastrMode.Success
                _mode = "success"
            Case ToastrMode.Warning
                _mode = "warning"
            Case ToastrMode.Danger
                _mode = "error"
            Case ToastrMode.Info
                _mode = "information"
            Case ToastrMode.Confirm
                _mode = "confirm"
        End Select

        Dim _position As String = ""
        Select Case Position
            Case ToastrPositon.TopLeft
                _position = "topLeft"
            Case ToastrPositon.Top
                _position = "top"
            Case ToastrPositon.TopRight
                _position = "topRight"
            Case ToastrPositon.BottomLeft
                _position = "bottomLeft"
            Case ToastrPositon.Bottom
                _position = "bottom"
            Case ToastrPositon.BottomRight
                _position = "bottomRight"

        End Select

        Message = Message.Replace("'", "\'").Replace("""", "\""").Replace(vbLf, "<br/>")

        Dim Script = "$('#toastrMessage').val(""" & Message & """);" & vbLf
        Script &= "$('#toastrType').val(""" & _mode & """);" & vbLf
        Script &= "$('#toastrPosition').val(""" & _position & """);" & vbLf
        Script &= "$('#toastrTimeout').val(""" & TimeOut_MS & """);" & vbLf
        Script &= " $('.showToastr').click();" & vbLf

        ScriptManager.RegisterStartupScript(Page, GetType(String), "toastr_msg", Script, True)
    End Sub

#End Region

#Region "DragDrop"

    Public Sub ImplementObjectDragable(ByRef Obj As UserControl, ByVal DragDataType As String, ByVal DragDataArg As String)
        Obj.Attributes("draggable") = "true"
        Obj.Attributes("ondragstart") = "dragged(event)"
        Obj.Attributes("dragdatatype") = DragDataType '---------- เก็บข้อมูลเกี่ยวกับ Source -----------
        Obj.Attributes("dragdataarg") = DragDataArg '---------- เก็บข้อมูลเสริม-----------
    End Sub

    Public Sub ImplementObjectDragable(ByRef Obj As HtmlControl, ByVal DragDataType As String, ByVal DragDataArg As String)
        Obj.Attributes("draggable") = "true"
        Obj.Attributes("ondragstart") = "dragged(event)"
        Obj.Attributes("dragdatatype") = DragDataType '---------- เก็บข้อมูลเกี่ยวกับ Source -----------
        Obj.Attributes("dragdataarg") = DragDataArg '---------- เก็บข้อมูลเสริม-----------
    End Sub

    Public Sub ImplementObjectDragable(ByRef Obj As WebControl, ByVal DragDataType As String, ByVal DragDataArg As String)
        Obj.Attributes("draggable") = "true"
        Obj.Attributes("ondragstart") = "dragged(event)"
        Obj.Attributes("dragdatatype") = DragDataType '---------- เก็บข้อมูลเกี่ยวกับ Source -----------
        Obj.Attributes("dragdataarg") = DragDataArg '---------- เก็บข้อมูลเสริม-----------
    End Sub

    '------- เลิกรับ Event --------
    Public Sub CeaseObjectDragable(ByRef Obj As UserControl)
        Obj.Attributes.Remove("draggable") '------Remove Event Listener
        Obj.Attributes.Remove("ondragstart") '------Remove Event Listener
        Obj.Attributes.Remove("dragdatatype") '---------- Remove Param
        Obj.Attributes.Remove("dragdataarg") '---------- Remove Param
    End Sub

    '------- เลิกรับ Event --------
    Public Sub CeaseObjectDragable(ByRef Obj As HtmlControl)
        Obj.Attributes.Remove("draggable") '------Remove Event Listener
        Obj.Attributes.Remove("ondragstart") '------Remove Event Listener
        Obj.Attributes.Remove("dragdatatype") '---------- Remove Param
        Obj.Attributes.Remove("dragdataarg") '---------- Remove Param
    End Sub

    '------- เลิกรับ Event --------
    Public Sub CeaseObjectDragable(ByRef Obj As WebControl)
        Obj.Attributes.Remove("draggable") '------Remove Event Listener
        Obj.Attributes.Remove("ondragstart") '------Remove Event Listener
        Obj.Attributes.Remove("dragdatatype") '---------- Remove Param
        Obj.Attributes.Remove("dragdataarg") '---------- Remove Param
    End Sub

    Public Sub ImplementObjectDropable(ByRef Obj As UserControl, ByVal DropDataType As String, ByVal dropdataarg As String)
        Obj.Attributes("ondragover") = "draggedOver(event)"
        Obj.Attributes("ondrop") = "dropped(event)"
        Obj.Attributes("dropdatatype") = DropDataType
        Obj.Attributes("dropdataarg") = dropdataarg
    End Sub

    Public Sub ImplementObjectDropable(ByRef Obj As HtmlControl, ByVal DropDataType As String, ByVal dropdataarg As String)
        Obj.Attributes("ondragover") = "draggedOver(event)"
        Obj.Attributes("ondrop") = "dropped(event)"
        Obj.Attributes("dropdatatype") = DropDataType
        Obj.Attributes("dropdataarg") = dropdataarg
    End Sub

    Public Sub ImplementObjectDropable(ByRef Obj As WebControl, ByVal DropDataType As String, ByVal dropdataarg As String)
        Obj.Attributes("ondragover") = "draggedOver(event)"
        Obj.Attributes("ondrop") = "dropped(event)"
        Obj.Attributes("dropdatatype") = DropDataType
        Obj.Attributes("dropdataarg") = dropdataarg
    End Sub

    '------- เลิกรับ Event --------
    Public Sub CeaseObjectDropable(ByRef Obj As UserControl)
        Obj.Attributes.Remove("ondragover") '------Remove Event Listener
        Obj.Attributes.Remove("ondrop") '------Remove Event Listener
        Obj.Attributes.Remove("dropdatatype") '------Remove Param
        Obj.Attributes.Remove("dropdataarg")  '------Remove Param
    End Sub


    '------- เลิกรับ Event --------
    Public Sub CeaseObjectDropable(ByRef Obj As HtmlControl)
        Obj.Attributes.Remove("ondragover") '------Remove Event Listener
        Obj.Attributes.Remove("ondrop") '------Remove Event Listener
        Obj.Attributes.Remove("dropdatatype") '------Remove Param
        Obj.Attributes.Remove("dropdataarg")  '------Remove Param
    End Sub

    '------- เลิกรับ Event --------
    Public Sub CeaseObjectDropable(ByRef Obj As WebControl)
        Obj.Attributes.Remove("ondragover") '------Remove Event Listener
        Obj.Attributes.Remove("ondrop") '------Remove Event Listener
        Obj.Attributes.Remove("dropdatatype") '------Remove Param
        Obj.Attributes.Remove("dropdataarg")  '------Remove Param
    End Sub

    Public Sub ConfigDragDropListener(ByVal ListenerButton As WebControl, ByVal TextDragDataType As TextBox, ByVal TextDragDataArg As TextBox, ByVal TextDropDataType As TextBox, ByVal Textdropdataarg As TextBox, ByRef Page As Page)
        Dim Script As String = ""
        If Not IsNothing(ListenerButton) Then Script &= "DropActionButton='" & ListenerButton.ClientID & "';" & vbLf
        If Not IsNothing(TextDragDataType) Then Script &= "DragTypeTextbox='" & TextDragDataType.ClientID & "';" & vbLf
        If Not IsNothing(TextDragDataArg) Then Script &= "DragArgTextbox='" & TextDragDataArg.ClientID & "';" & vbLf
        If Not IsNothing(TextDropDataType) Then Script &= "DropTypeTextbox='" & TextDropDataType.ClientID & "';" & vbLf
        If Not IsNothing(Textdropdataarg) Then Script &= "DropArgTextbox='" & Textdropdataarg.ClientID & "';" & vbLf
        ScriptManager.RegisterStartupScript(Page, GetType(String), "DragDropConfig", Script, True)
    End Sub

#End Region

    Public Function ReadFile(ByVal Path As String) As Byte()
        If IO.File.Exists(Path) Then
            Dim F As IO.Stream = IO.File.Open(Path, IO.FileMode.Open, IO.FileAccess.Read, IO.FileShare.ReadWrite)
            Dim C As New Converter
            Dim B As Byte() = C.StreamToByte(F)
            F.Close()
            Return B
        Else
            Return Nothing
        End If
    End Function

    Public Sub SaveFile(ByVal Path As String, ByVal B As Byte())
        If File.Exists(Path) Then
            DeleteFile(Path)
        End If

        'Make Parent Folder if not existed
        Dim p As String() = Path.Split("\")
        Array.Resize(p, p.Length - 1)
        Dim ParentFolder As String = String.Join("\", p)
        If Not Directory.Exists(ParentFolder) Then
            Directory.CreateDirectory(ParentFolder)
        End If

        Dim F As FileStream = File.Open(Path, FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite)
        F.Write(B, 0, B.Length)
        F.Close()
    End Sub

    Public Function GetStringFromURL(ByVal URL As String) As String
        Return New WebClient().DownloadString(URL)
    End Function

    Public Function OriginalFileName(ByVal FullPath As String) As String
        Return FullPath.Substring(FullPath.LastIndexOf("\") + 1)
    End Function

    Public Function OriginalFileType(ByVal FullPath As String) As String
        Return FullPath.Substring(FullPath.LastIndexOf(".") + 1)
    End Function

    Public Function GetIPAddress() As String
        Return HttpContext.Current.Request.UserHostAddress
    End Function

    Public Function GetCurrentPageName() As String
        Dim URL As String = ""
        Try
            URL = HttpContext.Current.Request.ServerVariables("URL")
            URL = URL.Substring(URL.LastIndexOf("/") + 1)
        Catch : End Try
        Return URL
    End Function

    Public Function GenerateNewUniqueID() As String
        Return Guid.NewGuid.ToString
    End Function

    Public Sub DeleteFile(ByVal Path As String)
        Dim TryTime As Integer = 0
        Dim MaxTry As Integer = 5
        While File.Exists(Path) And TryTime < MaxTry
            TryTime += 1
            Try
                My.Computer.FileSystem.DeleteFile(Path)
            Catch
                Threading.Thread.Sleep(300)
            End Try
        End While
    End Sub

    Public Sub DeleteDirectory(ByVal Path As String)
        My.Computer.FileSystem.DeleteDirectory(Path, FileIO.DeleteDirectoryOption.DeleteAllContents)
    End Sub

    Public Sub PushString(ByRef Arr As String(), ByVal NextString As String)
        Array.Resize(Arr, Arr.Length + 1)
        Arr(Arr.Length - 1) = NextString
    End Sub


    Public Sub PushInt(ByRef Arr As Integer(), ByVal NextInt As Integer)
        Array.Resize(Arr, Arr.Length + 1)
        Arr(Arr.Length - 1) = NextInt
    End Sub

    Public Function MD5(ByVal Input As String) As String
        Return String.Join("", System.Security.Cryptography.MD5.Create().ComputeHash(System.Text.Encoding.ASCII.GetBytes(Input)).Select(Function(x) x.ToString("x2")))
    End Function

    Public Function IsFormatGUID(ByVal Input As String) As Boolean
        Dim isGuid As Regex = New Regex("^(\{){0,1}[0-9a-fA-F]{8}\-" &
                     "[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-" &
                     "[0-9a-fA-F]{12}(\}){0,1}$", RegexOptions.Compiled)
        Return isGuid.IsMatch(Input)
    End Function


#Region "JSON"
    '---- Report Result in Collection Format -----------
    Public Function DataTableToJSON(ByVal DT As DataTable) As String
        Dim JS As New System.Web.Script.Serialization.JavaScriptSerializer()
        Dim rows As New List(Of Dictionary(Of String, Object))
        For i As Integer = 0 To DT.Rows.Count - 1
            Dim row As New Dictionary(Of String, Object)
            For j As Integer = 0 To DT.Columns.Count - 1
                row.Add(DT.Columns(j).ColumnName, DT.Rows(i).Item(j))
            Next
            rows.Add(row)
        Next
        Return JS.Serialize(rows)
    End Function

    '- -------- Remove [Collection] Format ------------
    Public Function SingleRowDataTableToJSON(ByVal DT As DataTable) As String
        Dim JSON As String = DataTableToJSON(DT)
        If JSON <> "" Then
            JSON = JSON.Substring(1, JSON.Length - 2)
        End If
        Return JSON
    End Function
#End Region

    Public Function GetJavascriptTimestamp(ByVal input As DateTime) As Long
        Dim Span As TimeSpan = New System.TimeSpan(System.DateTime.Parse("1/1/1970").Ticks)
        Dim T As DateTime = input.Subtract(Span)
        Return T.Ticks / 10000
    End Function

    Public Function ExistingCssClass(ByVal CurrentClass As String, ByVal SearchClass As String) As Boolean
        While CurrentClass.IndexOf("  ") > -1
            CurrentClass = CurrentClass.Replace("  ", " ")
        End While
        Return Array.IndexOf(Split(CurrentClass, " "), SearchClass) > -1
    End Function

    Public Function InsertTagCssClass(ByVal CurrentClass As String, ByVal ClassToInsert As String) As String
        Dim Result As String = (CurrentClass & " " & ClassToInsert)
        While Result.IndexOf("  ") > -1
            Result = Result.Replace("  ", " ")
        End While
        Return Result.Trim
    End Function

    Public Function RemoveTagCssClass(ByVal CurrentClass As String, ByVal ClassToRemove As String) As String
        Dim Result As String = CurrentClass
        While Result.IndexOf(ClassToRemove) > -1
            Result = Result.Replace(ClassToRemove, "")
        End While
        While Result.IndexOf("  ") > -1
            Result = Result.Replace("  ", " ")
        End While
        Return Result.Trim
    End Function

    Public Function ExcelContentType(ByVal ContentType As String) As Boolean
        Dim Result As Boolean = True
        Select Case ContentType
            Case "application/vnd.ms-excel"
            Case "application/msexcel"
            Case "application/x-msexcel"
            Case "application/x-ms-excel"
            Case "application/x-excel"
            Case "application/x-dos_ms_excel"
            Case "application/xls"
            Case "application/x-xls"
            Case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            Case Else
                Result = False
        End Select
        Return Result
    End Function

    Public Structure FileStructure
        Public ContentType As String
        Public FileName As String
        Public Content As Byte()
    End Structure

    Public Function ReportFriendlyTime(ByVal Minute As Integer) As String
        Select Case True
            Case Minute < 2
                Return "last minute"
            Case Minute < 60
                Return "last " & Minute & " minutes"
            Case Minute < 120
                Return "last hour"
            Case Minute < 2880
                Return "last " & Int(Minute / 60) & " hours"
            Case Minute < 44640
                Return "last " & Int(Minute / 1440) & " days"
                'Case Minute < 4017600
            Case Else
                Return "Last " & Int(Minute / 44640) & " months"
        End Select
    End Function


    Public Function postXMLData(ByVal URL As String, ByVal XMLString As String) As String
        Dim request As HttpWebRequest = DirectCast(WebRequest.Create(URL), HttpWebRequest)
        Dim bytes As Byte()
        bytes = System.Text.Encoding.UTF8.GetBytes(XMLString)
        request.ContentType = "text/xml"

        request.ContentLength = bytes.Length
        request.Method = "POST"
        Dim requestStream As Stream = request.GetRequestStream()
        requestStream.Write(bytes, 0, bytes.Length)
        requestStream.Close()
        Dim resp As HttpWebResponse
        Try
            resp = DirectCast(request.GetResponse(), HttpWebResponse)
            If resp.StatusCode = HttpStatusCode.OK Then
                Dim responseStream As Stream = resp.GetResponseStream()
                Dim responseStr As String = New StreamReader(responseStream).ReadToEnd()
                Return responseStr
            Else
                Return ""
            End If
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

#Region "Image"

    Public Function GetImageDimension(ByVal ImagePath As String) As Drawing.Size
        Dim C As New Converter
        Dim ST As Stream = C.ByteToStream(ReadFile(ImagePath))
        Dim img As Drawing.Image = Drawing.Image.FromStream(ST)
        Return New Drawing.Size(img.Width, img.Height)
    End Function

    Public Function ScaleImage(ByVal OldImage As Drawing.Image, ByVal TargetHeight As Integer, ByVal TargetWidth As Integer) As System.Drawing.Image
        Dim NewHeight As Integer = TargetHeight
        Dim NewWidth As Integer = NewHeight / OldImage.Height * OldImage.Width
        If NewWidth > TargetWidth Then
            NewWidth = TargetWidth
            NewHeight = NewWidth / OldImage.Width * OldImage.Height
        End If
        Return New Drawing.Bitmap(OldImage, NewWidth, NewHeight)
    End Function

#End Region



End Module
