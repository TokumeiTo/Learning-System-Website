import api from "../hooks/useApi";
import type { TranslationRequest, TranslationResponse } from "../types/translation";

/**
 * Sends text to the .NET backend for translation.
 * The backend handles the IT-context logic and the external API call.
 */
export const translateText = async (data: TranslationRequest): Promise<TranslationResponse> => {
    // This matches the [HttpPost("translate")] route in your TranslationController
    const res = await api.post<TranslationResponse>("/api/translation/translate", data);
    return res.data;
};