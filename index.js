const aws = require('aws-sdk');


aws.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  else {
    console.log("Access key:", aws.config.credentials.accessKeyId);
    console.log("Secret access key:", aws.config.credentials.secretAccessKey);
  }
});

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');

const s3 = new aws.S3({
  endpoint: spacesEndpoint
});


function getBuckets(bucket, prefix) {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log("ERROR");
    }
    data.Contents.forEach((el) => {
      if (el.Size != 0) {
        console.log(el.Key, el.LastModified);
      }
    });
  });
}

const bucketName = "aris-sample-imr";
const pathToFile = 'qr-s010/sensor_data/2019-11-01/lucint_imagery/';
getBuckets(bucketName, pathToFile);