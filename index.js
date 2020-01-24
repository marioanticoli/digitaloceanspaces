const aws = require('aws-sdk');
const fs = require('fs');

// Just for showing correct credentials; not necessary
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

const listFilesPromise = (bucket, prefix) => {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Contents);
    });
  })
}

const getFilePromise = (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Body);
    });
  })
}

const bucketName = "aris-sample-imr";
const pathToFile = "qr-s010/sensor_data/2019-11-01/lucint_imagery/";
const key = "qr-s010/sensor_data/2019-11-01/lucint_imagery/20191101T002245Z/LWIR_01/LWIR_01_19700109T064922Z_00000065.gray.tif";
let res;
async function main() {
  res = await listFilesPromise(bucketName, pathToFile)
  console.log(res);
  res = await getFilePromise(bucketName, key);
  console.log(res);
  fs.writeFile("./images/test.tif", res, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

main();