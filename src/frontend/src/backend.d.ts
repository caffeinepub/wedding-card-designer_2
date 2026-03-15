import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Design {
    id: string;
    weddingDate: string;
    venue: string;
    templateId: string;
    createdAt: Time;
    partner2Name: string;
    rsvpDetails: string;
    updatedAt: Time;
    message: string;
    partner1Name: string;
    designName: string;
}
export type Time = bigint;
export interface backendInterface {
    deleteDesign(id: string): Promise<void>;
    getAllDesigns(): Promise<Array<Design>>;
    getAllDesignsSortedByName(): Promise<Array<Design>>;
    getDesign(id: string): Promise<Design>;
    saveDesign(partner1Name: string, partner2Name: string, weddingDate: string, venue: string, message: string, rsvpDetails: string, templateId: string, designName: string): Promise<string>;
    updateDesign(id: string, partner1Name: string, partner2Name: string, weddingDate: string, venue: string, message: string, rsvpDetails: string, templateId: string, designName: string): Promise<void>;
}
