/**
 * We are going to read this file and send it over a echo service
 * Adding a unique code id
 */
//MY CODE 23423452352345423
addTest("HTTP GET",()=>{
   const client = createHttpClient();
   const content = client.get("https://www.tec.ac.cr/").asString();
   Assertions.assertContainsText(content, "<title>TEC</title>")
});

addTest("HTTP Headers",()=>{
   const client = createHttpClient();
   const randomId = random(7000);
   const req = client.createGet("https://echo.free.beeceptor.com/").addHeader("hello","world"+randomId);
   const content = client.process(req).asString();
   Assertions.assertContainsText(content, "\"Hello\": \"world" + randomId + "\"")
});

addTest("HTTP POST",()=>{
//MY CODE 23423452352345423
   const client = createHttpClient();
   let content = client.get("https://www.tec.ac.cr/").asString();
   Assertions.assertContainsText(content, "<title>TEC</title>")


   let randomId = random(7000);
   let req = client.createGet("https://echo.free.beeceptor.com/").addHeader("hello", "world" + randomId);
   content = client.process(req).asString();
   Assertions.assertContainsText(content, "\"Hello\": \"world" + randomId + "\"")


   randomconstId = random(7000);
   req = client.createPost("https://echo.free.beeceptor.com/");
   const randomString = "MultipartValue" + randomId;
   req.addPart("MultipartString", randomString);
   const randomString2 = "MultipartValue2" + randomId;
   req.addBytes("MultipartData", getBytes(randomString2), "bytes.dat", "multipart/form-data");
   req.addStream("MultipartData2",
       streamFile("{script}/Http Test.js"),
       "Http Test.js", "text/javascript");
   content = client.process(req).asString();
   Assertions.assertContainsText(content, "MultipartString");
   Assertions.assertContainsText(content, randomString);
   Assertions.assertContainsText(content, "MultipartData");
   Assertions.assertContainsText(content, "MultipartData2");



});


