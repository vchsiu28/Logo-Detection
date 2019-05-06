# Logo-Detection
DAP Project-Logo Detection

You find a nice handbag and wonder what its brand is. This web app is here for you! Just upload the image to see its logo/brand name and where to purchase/find it.

## Usage

1. Make sure node.js and npm are [installed](https://treehouse.github.io/installation-guides/mac/node-mac.html).
2. Save the google cloud service account credential file as secret.json and store in the root folder.
3. Run `npm install` to install required packages.
4. Make sure [run.sh](../blob/master/run.sh) is executable by `chmod +x run.sh` and then use `./run.sh` to start the web app.
5. The web page is statically hosted on <http://localhost:8888/demo.html> by default.
![default](https://github.com/vchsiu28/Logo-Detection/tree/master/img/default.png)
Click "Choose File" and choose the image file from your browser. Click "Upload", wait for 2-3 seconds and results will be updated underneath the image.

![object](https://github.com/vchsiu28/Logo-Detection/tree/master/img/object.png)
If you want to check what it is, click on "Object" button.

![logo](https://github.com/vchsiu28/Logo-Detection/tree/master/img/logo.png)
Click on "Logo" button to see its logo/brand name.

![web](https://github.com/vchsiu28/Logo-Detection/tree/master/img/web.png)
"Web" button searches for websites associated with the uploaded image. 

Links are potential e-commerce sites where you can find/purchase the item.   
Fetch response are stored in our user history database for user analytics. 

## Progress
* Completed backend API for fetching image prediction result from google vision API and rendering the correct format to the front-end.
* Added an example use of the above API in the front-end.
* Completed front-end layout design.
* Added backend API for fetching and saving search records (all to the same dummy user though, will continue with this part later).






