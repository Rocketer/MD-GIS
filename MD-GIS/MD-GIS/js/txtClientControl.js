function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function addCommasLimitPlace(nStr, maxplace) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = '';
    if (x.length > 1) {
        x2 = parseFloat('0.' + x[1]).toFixed(maxplace).replace('0.','').toString(); // Rounding จำนวนทศนิยม

        while (x2.substr(x2.length - 1, 1) == '0')
            x2 = x2.substr(0, x2.length - 1);

        if (parseFloat(x2) > 0) 
            x2 = '.' + x2;
        else 
            x2 = '';       
    }     
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) 
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    return x1 + x2;
}

function formatmoney(input,minvalue,maxvalue)
{
   var firstch = '';
   if(input!='')
   {
        switch(input.substr(0,1))
        {
            case "+":
            case "-":firstch=input.substr(0,1);
                    break;
        }
   }
  
   var tmp = parseFloat(replaceComma(input).replace('-','').replace('+',''));     
   if( tmp.toString().toUpperCase() == 'NAN' ) return ''; 
  
    //Check Min Max
    if((minvalue != '') && (tmp <minvalue)) tmp=minvalue;
    if((maxvalue != '') && (tmp >maxvalue)) tmp=maxvalue;
    
    return firstch + addCommas(Number(tmp).toFixed(2)); 
}

function formatinteger(input,minvalue,maxvalue,comma)
{
   var firstch = '';
   if(input!='')
   {
        switch(input.substr(0,1))
        {
            case "+":
            case "-":firstch=input.substr(0,1);
                    break;
        }
   }
   
   var tmp = parseFloat(replaceComma(input).replace('-','').replace('+',''));
   
   if( tmp.toString().toUpperCase() == 'NAN' ) return ''; 
    
    //Check Min Max
    if((minvalue != '') && (tmp <minvalue)) tmp=minvalue;
    if((maxvalue != '') && (tmp >maxvalue)) tmp=maxvalue;
    
    if (comma) {
        return firstch + addCommas(Number(tmp).toFixed(0));
    } else {
        return firstch + Number(tmp).toFixed(0);
    }    
}

function formatfloat(input,minvalue,maxvalue,decimalplace)
{
   var firstch = '';
   if(input!='')
   {
        switch(input.substr(0,1))
        {
            case "+":
            case "-":firstch=input.substr(0,1);
                    break;
        }
   }
  
   var tmp = parseFloat(replaceComma(input).replace('-','').replace('+',''));     
   if( tmp.toString().toUpperCase() == 'NAN' ) return ''; 
  
    //Check Min Max
    if((minvalue != '') && (tmp <minvalue)) tmp=minvalue;
    if((maxvalue != '') && (tmp >maxvalue)) tmp=maxvalue;
    
    return firstch + addCommas(Number(tmp).toFixed(decimalplace)); 
}

function formatnumericwithoutcomma(input, minvalue, maxvalue) {
   return formatnumeric(input, minvalue, maxvalue).replaceAll(',', '');
}

function formatnumeric(input, minvalue, maxvalue) {
    var firstch = '';
    if (input != '') {
        switch (input.substr(0, 1)) {
            case "+":
            case "-": firstch = input.substr(0, 1);
                break;
        }
    }

    var tmp = parseFloat(replaceComma(input).replace('-', '').replace('+', ''));
    if (tmp.toString().toUpperCase() == 'NAN') return '';

    //Check Min Max
    if ((minvalue != '') && (tmp < minvalue)) tmp = minvalue;
    if ((maxvalue != '') && (tmp > maxvalue)) tmp = maxvalue;

    return firstch + addCommas(Number(tmp));
}

function formatnumericLimitPlace(input, minvalue, maxvalue,maxplace){
    var firstch = '';
    if (input != '') {
        switch (input.substr(0, 1)) {
            case "+":
            case "-": firstch = input.substr(0, 1);
                break;
        }
    }
    
    var tmp = parseFloat(replaceComma(input).replace('-', '').replace('+', ''));
    if (tmp.toString().toUpperCase() == 'NAN') return '';
    
    //Check Min Max
    if ((minvalue != '') && (tmp < minvalue)) tmp = minvalue;
    if ((maxvalue != '') && (tmp > maxvalue)) tmp = maxvalue;
    //return firstch + addCommas(Number(tmp).toFixed(2));
    return firstch + addCommasLimitPlace(Number(tmp), maxplace);
}

function formatonlynumber(input)
{
   var result='';
   for(i=0;i<input.length;i++)
   {
        switch(input.toString().substr(i,1))
        {
            case "0" :
            case "1" :
            case "2" :
            case "3" :
            case "4" :
            case "5" :
            case "6" :
            case "7" :
            case "8" :
            case "9" : result += input.toString().substr(i,1);
                      break;
        }       
   }   
    return result; 
}


function replaceComma(input)
{
    while(input.toString().indexOf(",")>-1) input=input.replace(",","");
    return input    
}

function textAreaAutogrow() {
    $(document).ready(function () {
        $('textarea').css('overflow','hidden').css('resize','none').autogrow();
    });
}

