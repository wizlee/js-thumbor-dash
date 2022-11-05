import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRequestUrl } from '../../src/url/url.js';
import { ThumbnailClient } from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const document = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'qa.json')));

const imgBuf = fs.readFileSync(path.resolve(__dirname, 'feature_detection_original.jpg'));
// const imgBuf = fs.readFileSync(path.resolve(__dirname, 'chip.jpg'));
// let minWidth = 80;
// let minHeight = 120;
// let maxWidth = 400;
// let maxHeight = 600;

const options = {
  network: 'testnet',
  masternode: document.thumbor_host, // Server address [ip:port]
  contractId: document.contractId,
  documentType: document.documentType,
  mnemonic: document.mnemonic, // Owner's wallet mnemonic
  ownerId: document.ownerId, // Owner's identity
  image: imgBuf, // Image is a Buffer type
  resizeValues: document.resizeValues, // Image resize constraints
  // resizeValues: [minWidth, minHeight, maxWidth, maxHeight], // Image resize constraints
};

const client = new ThumbnailClient(options);

// urlTest();
await uploadTest();
// await retrieveTest();


function urlTest() {
  const url = generateRequestUrl(document.thumbor_host, document);
  console.log(url);
}

async function uploadTest() {
  try {
    const result = await client.upload();
    console.log(result.toJSON());
  } catch (err) {
    console.error(err);
  }
}

async function retrieveTest() {
  try {
    const result = await client.retrieve();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
