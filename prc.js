var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var UAParser = require('ua-parser-js');
var LineByLineReader = require('line-by-line')
var count=1;

var urlencodedParser = bodyParser.urlencoded({ extended: true });



var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at %s:%s Port", host, port)
  
  });

  app.get('/form', function (req, res) {
    var html='';
    html +="<body bgcolor='#D3D3D3'>";
    html += "<form action='/insertData'  method='post' name='form1'>";
    html += "<h1> Tax Form (WS2018/19) </h1>"
    html += "<span style='color:blue'>Amount</span> :<input type= 'text' name='amount'><br><br>";
    html += "<span style='color:blue'>Tax(%):</span><input type='text' name='tax'> <br><br>";
    html += "<span style='color:blue'>Currency:</span><select name='currency'>"
    html+="<option value='dollar'>Dollar</option>"
    html+="<option value='euro'>Euro</option>"
    html+="<option value='pkr'>PKR</option>"
    
    html+="</select><br><br>";
   
    html += "<input type='submit' value='Calculate'> &nbsp;";
    html += "<INPUT type='reset'  value='reset'>";
    html += "</form>";



    html += "<form action='/getData'  method='post' name='form2'>";
    html += "<h1> Select any currency to get data from file </h1>"
    html += "<span style='color:blue'>Currency:</span><select name='currency'>"
    html+="<option value='dollar'>Dollar</option>"
    html+="<option value='euro'>Euro</option>"
    html+="<option value='pkr'>PKR</option>"
    
    html+="</select><br><br>";
    html += "<span style='color:blue'>Submit:</span><input type='submit' value='Submit'> &nbsp;";
    html += "</form>";
    html += "</body>";
    res.send(html);
  });
  // method to retrive the request to store the data in the file 
  app.post('/insertData', urlencodedParser, function (req, res){
   //this will get the name of the browser
    var parser = new UAParser();
    var ua = req.headers['user-agent'];
    var browserName = parser.setUA(ua).getBrowser().name;
    console.log(browserName)
    console.log(count);
    
    //tax calculation
    var tax1=(req.body.amount*req.body.tax)/100
    //console.log(tax1)
    
    
    //total amount calculation
    var amount1 = tax1 +parseInt(req.body.amount);
    //console.log(amount1)
     
   
   
    // the string to be placed in the file 
    var result = count +' '+ amount1 + ' ' + req.body.tax+'%' + ' ' +  req.body.currency + ' ' + new Date() + ' ' + browserName + '\n'
   
   
    // it will write the date to the file

    fs.appendFile('record.txt', result, function (err) {
        if (err) throw err;
        {
            console.log('Updated!');
            count++;
            console.log(count);
        }

        
      });










    // it will write the result to the browser
    var reply='';
    reply += "The total amount is " +amount1;
    reply += "&nbsp;&nbsp;"+ req.body.currency; 
    
    res.send(reply);
   });
   
   
   
   
   
   
   app.post('/getData',urlencodedParser,function(req,res){
       var result='';
    console.log("comning")

    lr = new LineByLineReader('record.txt');
    lr.on('error', function (err) {
        // 'err' contains error object
    });
    
    lr.on('line', function (line) {
        if(line.includes(req.body.currency)){
            result=result+line +"<br>";
        console.log(line)// 'line' contains the current line without the trailing newline character.
        }
    });
    
    lr.on('end', function () {
    
    
    
    res.send(result);
        // All lines are read, file is closed now.
    });
    





// var result;
// fs.readFile('record.txt', 'utf8', function(err, contents) {
//     //console.log(contents);

//     //console.log(contents.toString());
//      result = contents.toString();
//     console.log(result);
//     if(result.includes(req.body.currency)){
//         console.log(result.includes(req.body.currency))
//         console.log(result[2]);
//     }
// });




 
// console.log('after calling readFile');
   });