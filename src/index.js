import {retrieveImage} from './methods/retrieve.js';
import {updateImage} from './methods/update.js';
import {uploadImage} from './methods/upload.js';


// eslint-disable-next-line require-jsdoc
export class ThumbnailClient {
  /**
    * @param {ThumbnailClientOptions} options
    */
  // eslint-disable-next-line require-jsdoc
  constructor(options = {}) {
    this.options = options;
  }

  // eslint-disable-next-line require-jsdoc
  async upload() {
    return await uploadImage(this.options);
  }

  // eslint-disable-next-line require-jsdoc
  async update() {
    return await updateImage(this.options);
  }

  // eslint-disable-next-line require-jsdoc
  async retrieve() {
    return await retrieveImage(this.options);
  }
}
