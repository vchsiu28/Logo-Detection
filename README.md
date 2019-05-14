# Logo-Detection
DAP Project-Logo Detection

You find a nice handbag and wonder what its brand is. This web app is here for you! Just upload the image to see its logo/brand name and where to purchase/find it.

## Usage

1. Make sure node.js and npm are [installed](https://treehouse.github.io/installation-guides/mac/node-mac.html).
2. Save the google cloud service account credential file as secret.json and store in the root folder.
3. Run `npm install` to install required packages.
4. Config file is not included here, and you may email us fot it.
5. Make sure [run.sh](../blob/master/run.sh) is executable by `chmod +x run.sh` and then use `./run.sh` to start the web app.
6. The web page is statically hosted on <http://localhost:8888/demo.html> by default.

This is the page you see. Sign up with your email and click on the activation link you received. Then sign in to use our product. 
![login](https://github.com/vchsiu28/Logo-Detection/blob/master/img/login.png)

Click "Choose File" and choose the image file from your browser. Click "Upload", wait for 2-3 seconds and results will be updated underneath the image. 
![login](https://github.com/vchsiu28/Logo-Detection/blob/master/img/default.png)

The default result is the logo of the image. 
![logo](https://github.com/vchsiu28/Logo-Detection/blob/master/img/logo.png)

If you want to learn more about the image, click on "More Options" button on the top left corner .
![logo](https://github.com/vchsiu28/Logo-Detection/blob/master/img/options.png)

Click on "Objects" button to see what object it is.
![object](https://github.com/vchsiu28/Logo-Detection/blob/master/img/object.png)

"Web" button searches for the website of closest image to the uploaded image. 
![web](https://github.com/vchsiu28/Logo-Detection/blob/master/img/web.png)

Links are potential e-commerce sites where you can find/purchase the item.   
Fetch response are stored in our user history database for user analytics. 

Click on "My page" to see your search history.
![history](https://github.com/vchsiu28/Logo-Detection/blob/master/img/history.png)
You can see which categories you searched by frequency. 






