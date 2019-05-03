exports.postImagePred = (req, res, next) => {
    const image = req.body.image;
    const client = req.app.locals.googleClient;
    const request = {
        image: {
            content: image
        },
        features: [
            { type: 'LABEL_DETECTION', maxResults: 3 },
            { type: 'LOGO_DETECTION', maxResults: 3 },
            { type: 'WEB_DETECTION', maxResults: 3 }
        ]
    };
    client
        .annotateImage(request)
        .then(arr => {
            const rawResponse = arr[0];
            const labelResponse = rawResponse.labelAnnotations.map(
                item => item.description
            );
            const logoResponse = rawResponse.logoAnnotations.map(
                item => item.description
            );
            const webResponse = rawResponse.webDetection.visuallySimilarImages.map(
                item => item.url
            )
            res.status(200).json({
                label: labelResponse,
                logo: logoResponse,
                web: webResponse
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ // IMPORTANT!!! For debug only
                message: err.message
            });
        });
};
