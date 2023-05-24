export const cleanDocument = (document) => {
    delete document._etag;
    delete document._rid;
    delete document._self;
    delete document._ts;
    delete document._attachments;
    return document;
}