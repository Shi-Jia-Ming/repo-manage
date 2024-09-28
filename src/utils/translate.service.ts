import {Body, getClient, Response} from "@tauri-apps/api/http";
import {appConfigDir} from "@tauri-apps/api/path";
import {invoke} from "@tauri-apps/api/tauri";

export default class TranslateService {
    // TODO user select the origin and target language in translation, for now it is hardcoded from en to zh
    // TODO bug: the translation service is not working when the key is too long, need to fix this
    private static translateUrl: string = "";
    private static translateToken: string = "";

    public static async translate(key: string): Promise<string> {
        // handle key, remove the special characters in the key
        const sanitizedKey = key.replace(/[\n\r]/g, '');

        const client = await getClient();
        const body: Body = Body.json({
            text: sanitizedKey,
            source_lang: "en",
            target_lang: "zh"
        });

        // check the translateUrl and token
        if (TranslateService.translateToken === "" || TranslateService.translateUrl === "") {
            const appConfigDirPath = await appConfigDir();
            const config: {
                service: {
                    translate_url: string,
                    translate_token: string
                }
            } = await invoke('get_configuration', {configDirPath: appConfigDirPath});
            TranslateService.translateToken = config.service.translate_token;
            TranslateService.translateUrl = config.service.translate_url;
        }

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
        }>(`${TranslateService.translateUrl}/v1/translate`, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TranslateService.translateToken}`
            }
        });

        console.debug(body, response);

        try {
            return response.data.alternatives[0] as string;
        } catch (e) {
            console.error(e);
            return "翻译失败";
        }
    }
}