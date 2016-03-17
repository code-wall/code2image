define({ "api": [  {    "type": "get",    "url": "/image",    "title": "Get an image representation of your code",    "name": "GetCodeImage",    "group": "Imagafiy",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "code",            "description": "<p>Mandatory code snippet encoded as a JSON string.</p>"          },          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "language",            "defaultValue": "javascript",            "description": "<p>Optional language for which the syntax highlighting will be used.</p>"          },          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "width",            "defaultValue": "1024",            "description": "<p>Optional width of the image to be generated.</p>"          }        ]      }    },    "examples": [      {        "title": "HTML:",        "content": "<img src='http://localhost:8080/image?code=\"function() {\\n\\tconsole.log(\\\"hello world\\\");\\n};\"'/>",        "type": "html"      },      {        "title": "Javascript:",        "content": "var myImage = document.getElementById('my-image');\nvar code = 'function() {\\n\\tconsole.log(\"hello world\");\\n};';\nvar url = 'http://localhost:8080/image?code=' + JSON.stringify(code);\nfetch(url).then(function(response) {\n    return response.blob();\n}).then(function(response) {\n    var objectURL = URL.createObjectURL(response);\n    myImage.src = objectURL;\n});",        "type": "javascript"      },      {        "title": "cURL:",        "content": "curl -G \"http://localhost:8080/image\" \\\n     --data-urlencode \"code=\\\"function() {\\\\n\\\\tconstole.log(\\\\\\\"hello world\\\\\\\");\\\\n}\\\"\" \\\n     -o mycode.png",        "type": "curl"      }    ],    "version": "0.0.0",    "filename": "api/api-handlers.js",    "groupTitle": "Imagafiy"  }] });
