import axios from 'axios';
import Dash from 'dash';
import {generateUploadURL} from '../url/url.js';
/**
 * Updates an image to the thumbor_dash server
 * @param {ThumbnailClientOptions} options
 */
export async function updateImage(options) {
  const uploadUrl = generateUploadURL(options.masternode);

  return await axios.post(uploadUrl, options.image)
      .then(async (response) => {
        const urlPrefix = uploadUrl.split('/image')[0];
        const urlSuffix = response.headers.location;
        const avatarUrl = urlPrefix + urlSuffix;

        try {
          return await updateDocument(avatarUrl, options);
        } catch (err) {
          return console.error(err);
        }
      },
      )
      .catch((err) => console.error(err));
}

/**
 * Updates image document on platform
 * @param {*} avatarUrl - thumbnail image url
 * @param {*} options - document data
 */
async function updateDocument(avatarUrl, options) {
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

  const updateThumbnailDocument = async function() {
    const [document] = await client.platform.documents.get(
        'thumbnailContract.thumbnailField',
        {
          limit: 1,
          where: [
            ['ownerId', '==', options.ownerId],
            ['$updatedAt', '>=', options.updatedAt],
          ],
          orderBy: [
            ['$updatedAt', 'desc'],
          ],
        },
    );

    const {platform} = client;
    const identity = await platform.identities.get(options.ownerId);

    // Update document
    document.set('field', avatarUrl);

    // Sign and submit the document replace transition
    return platform.documents.broadcast({replace: [document]}, identity);
  };

  return updateThumbnailDocument()
      .then((d) => console.log(d))
      .catch((e) => console.error('Something went wrong:\n', e))
      .finally(() => client.disconnect());
}
