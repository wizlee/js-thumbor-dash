import axios from 'axios';
import Dash from 'dash';
import {generateRequestUrl} from '../url/url.js';

/**
 * Retrieves an image from the thumbor_dash server
    * @param {ThumbnailClientOptions} options
 */
export async function retrieveImage(options) {
  // TODO funtion should return an image - not image url
  return createRequestUrl(options)
      .then((requestUrl) => {
        return fetchImage(requestUrl);
      })
      .catch((err) => console.error(err));
}

/**
 * Creates an thumbor_dash image retrieval URL
 * @param {*} options - document data
 */
async function createRequestUrl(options) {
  return createImageUrl(options)
      .then((avatarUrl) => {
        const params = {
          width: options.width,
          height: options.height,
          requesterId: options.requesterId,
          contractId: options.contractId,
          documentType: options.documentType,
          field: avatarUrl,
          ownerId: options.ownerId,
          updatedAt: options.updatedAt,
          requesterPubKey: options.requesterPubKey,
        };

        const requestUrl = generateRequestUrl(options.masternode, params);
        return requestUrl;
      })
      .catch((err) => console.error(err));
}

/**
 * Creates a valid image url
 * @param {*} options - document data
 */
async function createImageUrl(options) {
  return retrieveDocument(options)
      .then((thumbnailDoc) => {
        const imageUrl = thumbnailDoc.field;
        return imageUrl;
      })
      .catch((err) => console.error(err));
}

/**
 * Retrieves an existing image document from thumbor_dash server
 * @param {*} options - document data
 */
async function retrieveDocument(options) {
  const clientOpts = {
    network: options.network ? options.network : 'testnet',
    apps: {
      thumbnailContract: {
        contractId: options.contractId,
      },
    },
  };
  const client = new Dash.Client(clientOpts);

  const getDocuments = async () => {
    return client.platform.documents.get(
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
  };

  return getDocuments()
      .then((docs) => {
        const doc = docs[0].toJSON();
        return doc;
      })
      .catch((e) => console.error('Something went wrong:\n', e))
      .finally(() => client.disconnect());
}

/**
 * Dowloads a network image, given a url
 * @param {*} url - image url
 */
async function fetchImage(url) {
  return await axios.get(url)
      .then((res) => {
        return res;
      })
      .catch((err) => console.err);
}
