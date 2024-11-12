import { CosmosDocument } from "../types";

export function cleanDocument<T extends CosmosDocument>(document: T, property?: string, excludeTs?: boolean): T {
    delete document._etag;
    delete document._rid;
    delete document._self;
    if(!excludeTs) {
        delete document._ts;
    }
    delete document._attachments;
    if (property) {
        delete document[property];
    }
    return document;
}