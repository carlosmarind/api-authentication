import { createCA, createCert } from "mkcert";

export const ca = await createCA({
    organization: "DCC CA",
    countryCode: "CL",
    state: "Santiago",
    locality: "Santiago",
    validity: 365
});

export const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["127.0.0.1", "localhost"],
    validity: 365
});

