import fileUtils from "./fileUtils";

export default class FileUploadAdapter {

  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          console.log(file)
          // 아래 reuqest, listner가 실제 서버 파일서버와 통신을 해야하지만, 지금은 없으므로 항상 editor로 정상 send되도록 한다.
          this._initRequest();
          this._initListeners(resolve, reject, file);
          console.log(fileUtils.isImage(file.name));
          console.log(fileUtils.isFileSizeLimit(file.size));
          this._sendRequest(file);
        })
    );
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    const BACKEND_TEST_URL = "http://localhost:8090/file/upload"
    xhr.open("POST", BACKEND_TEST_URL, true); 
    xhr.responseType = "json";
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData();

    data.append("file", file);

    // Send the request.
    this.xhr.send( data );
  }
}
