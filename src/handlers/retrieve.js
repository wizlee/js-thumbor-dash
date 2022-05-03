import fetch from 'node-fetch';
import Dash from 'dash';
import { generateRequestUrl } from '../url/url.js';

/**
 * Retrieves an image from the thumbor_dash server
 * @param {*} server - server address [ip:port]
 * @param {*} params - document data 
 */
export async function retrieveImage(masternode, params) {
    return createRequestUrl(masternode, params)
        .then((response) => {
            return response;
        })
        .catch((err) => console.error(err));
}

async function createRequestUrl(masternode, params) {
    return createImageUrl(params)
        .then((avatarUrl) => {
            const data = {
                width: params.width,
                height: params.height,
                requesterId: params.requesterId,
                contractId: params.contractId ? params.contractId : "Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr",
                documentType: params.documentType ? params.documentType : "thumbnailField",
                field: avatarUrl,
                ownerId: params.ownerId,
                updatedAt: params.updatedAt,
                requesterPubKey: params.requesterPubKey
            };

            const requestUrl = generateRequestUrl(masternode, data);
            return requestUrl;
        })
        .catch((err) => console.error(err));
}

async function createImageUrl(params) {

    return retrieveDocument(params)
        .then((thumbnailDoc) => {
            const imageUrl = thumbnailDoc.field;
            return imageUrl;
        })
        .catch((err) => console.error(err));

}

async function retrieveDocument(params) {
    const clientOpts = {
        apps: {
            thumbnailContract: {
                contractId: params.contractId ? params.contractId : "Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr",
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
