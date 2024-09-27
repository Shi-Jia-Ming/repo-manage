import {Body, getClient, Response} from "@tauri-apps/api/http";

export default class TranslateService {
    // TODO user select the origin and target language in translation, for now it is hardcoded from en to zh
    // TODO bug: the translation service is not working when the key is too long, need to fix this

    public static async translate(key: string): Promise<string> {
        // handle key, remove the special characters in the key
        const sanitizedKey = key.replace(/[\n\r]/g, '');

        console.log(key + " sanitized to " + sanitizedKey);

        const client = await getClient();
        const body: Body = Body.json({
            text: sanitizedKey,
            source_lang: "en",
            target_lang: "zh"
        });

        const response: Response<{
            alternatives: string[],
            code: number,
            data: string,
            id: number,
            method: string,
            source_lang: string,
            target_lang: string
        }> = await client.post<{
            alternatives: string[],
            code: number,
            data: string,
            id: number,
            method: string,
            source_lang: string,
            target_lang: string
        }>("http://47.121.201.169:39770/v1/translate", body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer qpalzm102938!"
            }
        });

        console.debug(body, response);

        return response.data.alternatives[0] as string;
    }
}