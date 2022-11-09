import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRequestUrl } from '../../src/url/url.js';
import { ThumbnailClient } from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const document = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'qa.json')));
const document = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'qa-updateImg.json')));

// const imgBuf = fs.readFileSync(path.resolve(__dirname, 'feature_detection_original.jpg')); // from https://github.com/thumbor/thumbor/raw/master/docs/images/feature_detection_original.jpg
const imgBuf = fs.readFileSync(path.resolve(__dirname, 'chip.jpg')); // from https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg
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
  requesterId: document.requesterId,
  image: imgBuf, // Image is a Buffer type
  resizeValues: document.resizeValues, // Image resize constraints
  width: document.width,
  height: document.height,
  // resizeValues: [minWidth, minHeight, maxWidth, maxHeight], // Image resize constraints
  updatedAt: document.updatedAt,
  requesterPubKey: document.requesterPubKey,
};

const client = new ThumbnailClient(options);

// urlTest();
// await uploadTest();
// await retrieveTest();
await updateTest();
process.exit();

function urlTest() {
  const url = generateRequestUrl(document.thumbor_host, document);
  console.log(url);
}

async function uploadTest() {
  try {
    const platformDoc = await client.upload();
    console.log(platformDoc);
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

async function updateTest() {
  try {
    const platformDoc = await client.update();
    console.log(platformDoc);
  } catch (err) {
    console.error(err);
  }
}