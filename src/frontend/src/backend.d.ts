import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface Session {
    id: bigint;
    messages: Array<Message>;
    createdAt: Time;
    updatedAt: Time;
}
export type Time = bigint;
export interface backendInterface {
    deleteSession(id: bigint): Promise<void>;
    getAllSessions(): Promise<Array<Session>>;
    getAllSessionsSortedById(): Promise<Array<Session>>;
    getSession(id: bigint): Promise<Session>;
    saveSession(id: bigint, messages: Array<Message>): Promise<void>;
    updateSession(id: bigint, messages: Array<Message>): Promise<void>;
}
