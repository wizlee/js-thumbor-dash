import Dash from 'dash';
import bs58 from 'bs58';
import {generateUploadURL} from '../url/url.js';
import axios from 'axios';
import {Buffer} from 'buffer';


/**
 * Uploads an image to the thumbor_dash server
    * @param {ThumbnailClientOptions} options
 */
export async function uploadImage(options) {
  const uploadUrl = generateUploadURL(options.masternode);

  return await axios.post(uploadUrl, options.image)
      .then(async (response) => {
        const urlPrefix = uploadUrl.split('/image')[0];
        const urlSuffix = response.headers.location;

        const avatarUrl = urlPrefix + urlSuffix;
        try {
          const docProperties = await createDocProperties(avatarUrl, options);
          return await submitDocument(docProperties, options);
        } catch (err) {
          return console.error(err);
        }
      },
      )
      .catch((err) => console.error(err));
}

/**
 * Creates thumbnail document properties
 * @param {*} avatarUrl - thumbnail image url
 * @param {*} options - document data [contractId, ownerId]
 */
export async function createDocProperties(avatarUrl, options) {
  if (typeof options.ownerId === 'undefined') {
    console.error('missing required data for ownerId');
    return;
  }

  const docProperties = {
    ownerId: Buffer.from(bs58.decode(options.ownerId)),
    contractId: options.contractId,
    documentType: options.documentType,
    field: avatarUrl,
    resizeValues: Array.from(options.resizeValues),
  };

  return docProperties;
}


/**
 * Submits thumbnail document to Platform
 * @param {*} docProperties - thumbnail image document properties
 * @param {*} options - document data
 */
async function submitDocument(docProperties, options) {
  const clientOpts = {
    network: options.network ? options.network : 'testnet',
    wallet: {
      mnemonic: options.mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
      },
    },
    apps: {
      thumbnailContract: {
        contractId: options.contractId,
      },
    },
  };

  const client = new Dash.Client(clientOpts);

  const submitThumbnailDocument = async () => {
    const {platform} = client;
    const identity = await platform.identities.get(options.ownerId);

    // Create the thumbnail document
    const thumbnailDocument = await platform.documents.create(
        'thumbnailContract.thumbnailField',
        identity,
        docProperties,
    );

    const documentBatch = {
      create: [thumbnailDocument], // Document(s) to create
      replace: [], // Document(s) to update
      delete: [], // Document(s) to delete
    };
    // Sign and submit the document(s)
    return platform.documents.broadcast(documentBatch, identity);
  };

  return submitThumbnailDocument()
      .then((d) => console.log(d))
      .catch((e) => console.error('Something went wrong:\n', e))
      .finally(() => client.disconnect());
}
