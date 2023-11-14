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

  export const clickOutside = (element: HTMLElement, callbackFunction: () => void) => {
    function onClick(event) {
        if (!element.contains(event.target)) {
            callbackFunction();
        }
    }
    
    setTimeout(() => {
        document.body.addEventListener('click', onClick);
    }, 0);
    
    return {
        update(newCallbackFunction) {
            callbackFunction = newCallbackFunction;
        },
        destroy() {
            document.body.removeEventListener('click', onClick);
        }
    }
}

export function timeAgo(timestamp) {
  const options = { hour: '2-digit', minute: '2-digit' };
  const currentDate = new Date();
  const date = new Date(timestamp);

  const timeDifference = currentDate - date;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 1) {
    // More than 24 hours ago, show the specific date
    let formattedDate = date.toLocaleDateString('en-US');
    formattedDate = formattedDate + ' at ' + date.toLocaleTimeString('en-US', options);
    return formattedDate;
  } else if(days == 1) {
    return 'Yesterday at ' + date.toLocaleTimeString('en-US', options);
  } else if (hours > 0) {
    // Less than 24 hours but more than 1 hour ago, show hours
    return hours + 'h ago';
  } else if (minutes > 0) {
    // Less than 1 hour but more than 1 minute ago, show minutes
    return minutes + 'm ago';
  } else if (seconds > 0) {
    // Less than 1 minute ago, show seconds
    return seconds + 's ago';
  } else {
    // Current time
    return 'now';
  }
}