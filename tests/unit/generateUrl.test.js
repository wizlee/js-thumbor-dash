import { expect } from "chai";
import { generateUploadURL } from "../../src/url/generateUrl.js";


describe('generateUploadURL test', () => {
    it('should create an upload URL', () => {
        const url = generateUploadURL("localhost:8888");
        expect(url).to.equal("http://localhost:8888/image");
    });

    it('should not create wrong url', () => {
        const url = generateUploadURL("localhost:80");
        expect(url).to.not.equal("http://localhost:8888/image")
    });
});
