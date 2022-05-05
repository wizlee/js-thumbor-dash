/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import fs from 'fs';
import path from 'path';
import {uploadImage} from '../../src/methods/upload.js';
import {retrieveImage} from '../../src/methods/retrieve.js';
import {updateImage} from '../../src/methods/update.js';

const __dirname = path.resolve();

describe('integration tests', async function() {
  // eslint-disable-next-line no-invalid-this
  this.timeout(6000000);

  const document = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../js-thumbor-dash/tests/data/document.json')));
  const image = fs.readFileSync(path.resolve(__dirname, document.imagePath));
  const masternode = document.masternode;

  it('should upload image', async () => {
    const response = await uploadImage(image, masternode, document);
  });

  it('should retrieve image', async () => {
    const response = await retrieveImage(masternode, document);
  });

  it('should update image', async () => {
    const response = await updateImage(image, masternode, document);
  });
});
