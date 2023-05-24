import { CosmosDocument } from "../types";

export function cleanDocument<T extends CosmosDocument>(document: T, property?: string): T {
    delete document._etag;
    delete document._rid;
    delete document._self;
    delete document._ts;
    delete document._attachments;
    if (property) {
        delete document[property];
    }
    return document;
}