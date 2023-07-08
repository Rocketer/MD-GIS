
Imports System.Collections.Generic
Public Class Zone

    Public Enum ShapeType
        Polygon = 1
        Rectangle = 2
        Circle = 3
    End Enum

    Public Property Shape_Type As ShapeType
    Public Property Coordinates As String
    Public Property Radius As Object 'Double
    Public Property Stroke_Color As String
    Public Property Stroke_Opacity As Single
    Public Property Stroke_Weight As Single
    Public Property Fill_Color As String
    Public Property Fill_Opacity As Single

End Class
