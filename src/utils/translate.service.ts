import axios, {AxiosResponse} from "axios";
import {Body, getClient} from "@tauri-apps/api/http";

export default class TranslateService {
    // TODO user select the origin and target language in translation, for now it is hardcoded from en to zh

    public static async translate(key: string): string {
        // handle key, remove the special characters in the key
        const sanitizedKey = key.replace(/\n/g, '');

        console.log(key + " sanitized to " + sanitizedKey);

        const client = await getClient();
        const body: Body = Body.json({
            text: sanitizedKey,
            source_lang: "en",
            target_lang: "zh"
        });

        const response = await client.post("http://118.26.36.198:31188/v1/translate", body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer GIC7xLUKsmBLiwgE"
            }
        });

        console.log(body, response);

        return response.data.alternatives[0];
    }
}