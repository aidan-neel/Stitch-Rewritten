export function imageUrlToFormData(imageUrl) {
    // Create a function to load the image from the URL and convert it to a Blob.
    function loadImageToBlob(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error('Failed to load image'));
          }
        };
        xhr.open('GET', url);
        xhr.send();
      });
    }
  
    // Create a FormData object and append the Blob to it.
    const formData = new FormData();
  
    return loadImageToBlob(imageUrl)
      .then((imageBlob) => {
        formData.append('image', imageBlob, 'image.jpg'); // 'image' is the field name, 'image.jpg' is the filename
        return formData;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }