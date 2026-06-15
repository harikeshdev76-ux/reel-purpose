import { Resend } from "resend";

// RESEND_API_KEY is empty in .env until Mike provides it. A non-empty
// placeholder keeps construction side-effect-free on import — sends will fail
// with an auth error until a valid key is set.
export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
