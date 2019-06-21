# Realtime Multi-player Game

## 1. Overview

This Multiplayer Game uses C8's real time data stream network to manage network traffic between players.

This real time multiplayer game is a collaborative puzzle game that encourages you to work with your friends to collect the keys in clever ways.

## 2. Pre-requisite

The following need to be already available in the federation before staring the game.

```js
tenant: demo
password: xxxx
```

Login with `demo` tenant, `demo` user and create the following:


Now, in `_system` fabric create  a  collection - `occupancy` with the said data:

```js
collection - occupancy { one:0, two:0, three:0 }
```

> Note: To change the cluster url with which the game connects, goto `Config.js` file and change the following value:

```js
var cluster = "try.macrometa.io";
```

## 3. How to run locally

To run the game locally a server has to be started to serve the webpage.

If you have Mac OS or Linux (or have Python installed), open up your Terminal Application and type in:

```python
python -m SimpleHTTPServer 8000
```

If you are using Windows download <a href="https://www.apachefriends.org/index.html">XAMPP</a>.  There are some great tutorials out there on how to setup XAMPP on your machine.

Once you have your server up and running, go to ``http://localhost:8000/`` on your machine.

## 4. Building and deploying GUI

Go outside the current working directory, `tutorial-castleknight-game` in this case.

If using aws cli run `aws s3 cp tutorial-castleknight-game s3://<your-s3-bucket-name> --recursive` to recursively copy all files and folders inside the `tutorial-castleknight-game` folder to the S3 bucket.

The bucket needs to be public in order for the website to be visible.

A sample `bucket policy` is:

```js
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<your-s3-bucket-name>/*"
        }
    ]
}
```

Now goto the `Properties` tab in the aws console for this bucket and open `Static website hosting` option. Then select the option `Use this bucket to host a website` and provide `index.html` for both `Index document` and `Error document` text fields. Click on save and the website is now live!
