
function uploadImg(canvas) {
    const imgDataUrl = canvas.toDataURL('image/jpg');
    console.log(imgDataUrl);
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        renderShareButton(imgDataUrl, encodedUploadedImgUrl, uploadedImgUrl);
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(url, onSuccess) {
    const fromData = new FormData();
    fromData.append('img', url);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: fromData
    })
        .then(res => res.text())
        .then((url) => {
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}