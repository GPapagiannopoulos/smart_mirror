import type { CreateClientConfig} from "./client/client.gen.ts";

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: ""
})