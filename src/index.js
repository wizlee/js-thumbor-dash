import {retrieveImage} from './handlers/retrieve.js';
import {updateImage} from './handlers/update.js';
import {uploadImage} from './handlers/upload.js';


// eslint-disable-next-line require-jsdoc
export class ThumbnailClient {
  /**
    * @param {Buffer} image - image binary data
    * @param {string} masternode - server address [ip:port]
    * @param {ThumbnailClientOptions} options - document data
    */

  // eslint-disable-next-line require-jsdoc
  constructor(image, masternode, options = {}) {
    this.image = image;
    this.masternode = masternode;
    this.options = options;
  }

  // eslint-disable-next-line require-jsdoc
  async upload() {
    return await uploadImage(this.image, this.masternode, this.options);
  }

  // eslint-disable-next-line require-jsdoc
  async update() {
    return await updateImage(this.image, this.masternode, this.options);
  }

  // eslint-disable-next-line require-jsdoc
  async retrieve() {
    return await retrieveImage(this.masternode, this.options);
  }
}
