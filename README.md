# code 2 image api
 This API allows you to get a syntax highlighted image representation of your code.

	GET /image


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| code			| string			|  <p>Code snippet encoded as a JSON string. Only specify either code or id, not both.</p>							|
| id			| string			|  <p>An id of a codebin.it snippet. Only specify either code or id, not both.</p>							|
| language			| string			|  <p>Language for which the syntax highlighting will be used.</p>							|
| twitterFriendly			| string			|  <p>Whether the image should be cropped and resized to fit nicely as a twitter summary card https://dev.twitter.com/cards/types/summary-large-image</p>							|
| facebookFriendly			| string			|  <p>Whether the image should be cropped and resized to fit nicely as a facebook open graph image</p>							|

### Examples

HTML:

```
<img src='http://api.codebin.it/image?code="function() {\n\tconsole.log(\"hello world\");\n};"'/>
```
Javascript:

```
var myImage = document.getElementById('my-image');
var code = 'function() {\n\tconsole.log("hello world");\n};';
var url = 'http://api.codebin.it/image?code=' + JSON.stringify(code);
fetch(url).then(function(response) {
    return response.blob();
}).then(function(response) {
    var objectURL = URL.createObjectURL(response);
    myImage.src = objectURL;
});
```
cURL:

```
curl -G "http://api.codebin.it/image" \
     --data-urlencode "code=\"function() {\\n\\tconstole.log(\\\"hello world\\\");\\n}\"" \
     -o mycode.png
```


