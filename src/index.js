import {retrieveImage} from './handlers/retrieve.js';
import {updateImage} from './handlers/update.js';
import {uploadImage} from './handlers/upload.js';


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
