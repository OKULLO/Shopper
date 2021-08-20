/**
* Nyumba  Utilities
*
*/
const path = require('path')
const fs = require('fs-extra')
const self = {}

// ----------------------------------------------------------------------
self.removeMeta = function (obj) {
    for (var prop in obj) {
        if (prop === 'path') {
            delete obj[prop]
        } else if (typeof obj[prop] === 'object') {
            this.removeMeta(obj[prop])
        }
    }
}

// ----------------------------------------------------------------------c
/**
* Log facility
*/
self.Logger = require('simple-node-logger').createSimpleLogger({
    logFilePath: path.resolve(__dirname, '../logs', 'http.log'),
    dateFormat: 'YYYY.MM.DD'
})


self.logPrefix = (val) => {
    return `[${val}]`.padEnd(17, ' ')
}

/**
* Get HTTP Non-Secure Port
*/
self.getHttpPort = () => {
    if (process.env.hasOwnProperty('HTTP_PORT')) {
        return process.env.HTTP_PORT
    }
    else {
        return (process.env.TERM_PROGRAM ? 9080 : 80)
    }
}

/**
* Get HTTPS Secure Port
*/
self.getHttpsPort = () => {
    if (process.env.hasOwnProperty('HTTPS_PORT')) {
        return process.env.HTTPS_PORT
    }
    else {
        return (process.env.TERM_PROGRAM ? 9443 : 443)
    }
}



/**
* Extract IP address from request object
*/
self.getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}


/**
 * send emails
*/

self.sendEmail = async options => {

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};


module.exports = self
