var AWS = require('aws-sdk');

const send = (options, cb, config) => {
    const { from, replyTo, to, subject, text, html  } = options || {};
        var params = {
            Destination: { /* required */
                ToAddresses: [to]
            },
            Message: { /* required */
                Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: html
                },
                Text: {
                    Charset: "UTF-8",
                    Data: text
                }
                },
                Subject: {
                Charset: 'UTF-8',
                Data: subject
                }
                },
            Source: replyTo || config.replyTo, /* required */
            }
            console.log(params)
            var sendPromise = new AWS.SES({apiVersion: 'latest'})
            .sendEmail(params)
            .promise();

            // Handle promise's fulfilled/rejected states
            return sendPromise.then(
              function(data) {
                console.log(data.MessageId);
              }).catch(
                function(err) {
                console.error(err, err.stack);
            });
}

module.exports = {
    provider: 'amazon-ses',
    name: 'Amazon SES',
    auth: {
      from: {
        label: 'Default From',
        type: 'text',
      },
      replyTo: {
        label: 'Default Reply-To',
        type: 'text',
      },
      accessKey: {
        label: 'Amazon Access key ID',
        type: 'text',
      },
      secret: {
        label: 'Amazon Secret access key',
        type: 'text',
      },
      region: {
        label: 'Amazon Region',
        type: 'text',
      },
    },
  
    init: config => {
        const { region, accessKeyId, secretAccessKey} = config;
        AWS.config.update({
            region,
            accessKeyId,
            secretAccessKey,
        });
        return {
            send: (options, cb) => send(options, cb, config)
        }
    }
}