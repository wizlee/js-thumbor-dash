import Dash from 'dash';
import fetch from 'node-fetch';
import {generateRequestUrl} from '../url/url.js';
// import terminalImage from 'terminal-image';

/**
 * Retrieves an image from the thumbor_dash server
 * @param {*} masternode - server address [ip:port]
 * @param {*} params - document data
 */
export async function retrieveImage(masternode, params) {
  // TODO funtion should return an image - not image url
  return createRequestUrl(masternode, params)
      .then((requestUrl) => {
        return fetchImage(requestUrl);
      })
      .catch((err) => console.error(err));
}

/**
 * Creates an thumbor_dash image retrieval URL
 * @param {*} masternode - server address [ip:port]
 * @param {*} params - document data
 */
async function createRequestUrl(masternode, params) {
  return createImageUrl(params)
      .then((avatarUrl) => {
        const data = {
          width: params.width,
          height: params.height,
          requesterId: params.requesterId,
          contractId: params.contractId,
          documentType: params.documentType,
          field: avatarUrl,
          ownerId: params.ownerId,
          updatedAt: params.updatedAt,
          requesterPubKey: params.requesterPubKey,
        };

        const requestUrl = generateRequestUrl(masternode, data);
        return requestUrl;
      })
      .catch((err) => console.error(err));
}

/**
 * Creates a valid image url
 * @param {*} params - document data
 */
async function createImageUrl(params) {
  return retrieveDocument(params)
      .then((thumbnailDoc) => {
        const imageUrl = thumbnailDoc.field;
        return imageUrl;
      })
      .catch((err) => console.error(err));
}

/**
 * Retrieves an existing image document from thumbor_dash server
 * @param {*} params - document data
 */
async function retrieveDocument(params) {
  const clientOpts = {
    apps: {
      thumbnailContract: {
        contractId: params.contractId,
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
            ['ownerId', '==', params.ownerId],
            ['$updatedAt', '>=', params.updatedAt],
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
  return fetch(url)
      .then((res) => {
        return res;
      })
      .catch((err) => console.err);
}


retrieveImage('localhost:8888', {
  'width': 1200,
  'height': 800,
  'requesterId': '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93',
  'field': 'http://localhost:8888/image/2b6c18d3e8b14e5d8b8165f09d3f9742/image.jpg',
  'ownerId': '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93',
  'contractId': 'Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr',
  'documentType': 'thumbnailField',
  'resizeValues': [1, 1, 1200, 800],
  'updatedAt': 1651914389215,
  'requesterPubKey': 'AzkvyH6Czn09/3THMdOFW89VSkBBrJgpk+T6GYCY3HJa',
});
