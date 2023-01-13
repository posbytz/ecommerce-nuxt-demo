import AWS from 'aws-sdk';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const method = getMethod(event);
    const body = method === 'GET' ? undefined : await readBody(event);

    AWS.config.update({
        accessKeyId: config.awsAccessKey,
        secretAccessKey: config.awsAccessSecret,
        region: 'ap-south-1',
        signatureVersion: 'v4',
    });

    if (method == 'POST') {
        
        const { image, imageName, imageType, reviewId } = body;
        let buffer = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        let file_name = imageName.replace(/\s/g, '');
        let photoBucket = new AWS.S3({})

        async function upload() {
            const params = {
                Bucket: config.awsBucketName,
                Body: buffer,
                Key: `reviews/${reviewId}/${file_name}`,
                ContentType: imageType
            }
            let data;

            try {
                data = await promiseUpload(params);
            } catch (err) {
                console.error(err);
                return "";
            }

            return data.Location;
        }

        function promiseUpload(params) {
            return new Promise(function (resolve, reject) {
                photoBucket.upload(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
        
        return await upload();
    }
})