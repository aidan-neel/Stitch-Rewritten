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
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Approximation
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years + 'yr';
  } else if (months > 0) {
    return months + 'mo';
  } else if (weeks > 0) {
    return weeks + 'w';
  } else if (days > 0) {
    return days + 'd';
  } else if (hours > 0) {
    return hours + 'h';
  } else if (minutes > 0) {
    return minutes + 'm';
  } else if (seconds > 0) {
    return seconds + 's';
  } else {
    return 'now';
  }
}
