import fileUtils from "./fileUtils";
import store from "@/store";
import api from '@/api';

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
          console.log(fileUtils.isImage(file.name));
          console.log(fileUtils.isFileSizeLimit(file.size));
          this._sendRequest(resolve, reject, file);
        })
    );
  }

  abort() {
    // Cancle the upload process.
  }

    // 서버로부터 응답을 받기까지 화면을 invalid or 프로그레스 바 등 필요.
  _sendRequest(resolve, reject, file) {
    // Prepare the form data.
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    const formData = new FormData();
    formData.append("file", file, file.name);

    api.multiPartPost('file/upload', formData)     
    .then((response) => {
      console.log(response)
      resolve({ default: response.data });
    }).catch((error) => {
      reject(response && response.error ? response.error.message : genericErrorText);
    })
  }
}
