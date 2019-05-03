 const reader = new FileReader();
            document
                .getElementById('upload-button')
                .addEventListener('click', () => {
                    document.getElementById('line1').innerHTML = '';
                    const image = document.getElementById('image').files[0];
                    reader.onload = event => {
                        const imageByte = event.target.result;
                        const url = new URL(
                            'https://vision.googleapis.com/v1/images:annotate'
                        );
                        url.search = new URLSearchParams({
                            key: '' // The secret key for google cloud
                        });
                        const requestData = JSON.stringify({
                            requests: [
                                {
                                    image: {
                                        content: imageByte.split(',')[1]
                                    },
                                    features: [
                                        {
                                            type: 'LOGO_DETECTION'
                                        }
                                    ]
                                }
                            ]
                        });
                        fetch(url, {
                            method: 'POST',
                            body: requestData
                        })
                            .then(response => response.json())
                            .then(data => {
                                let resultJson = document.getElementById(
                                    'line1'
                                );
                                let resultLabel = document.getElementById(
                                    'result-label'
                                );
                                resultJson.textContent += JSON.stringify(data);
                                resultLabel.textContent +=
                                    data.responses[0].logoAnnotations[0].description;
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    };
                    reader.readAsDataURL(image);
                });