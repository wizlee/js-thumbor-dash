import { retrieveImage } from "./handlers/retrieve.js";
import { updateImage } from "./handlers/update.js";
import { uploadImage } from "./handlers/upload.js";


export class ThumbnailClient {
    /**
     * @param {Buffer} image - image binary data
     * @param {string} masternode - server address [ip:port]
     * @param {ThumbnailClientParams} params - document data 
     */

    constructor(image, masternode, params = {}) {
        this.image = image;
        this.masternode = masternode;
        this.params = params;
    }

    async upload() {
        return await uploadImage(this.image, this.masternode, this.params);
    }

    async update() {
        return await updateImage(this.image, this.masternode, this.params);
    }

    async retrieve() {
        return await retrieveImage(this.masternode, this.params);
    }
}