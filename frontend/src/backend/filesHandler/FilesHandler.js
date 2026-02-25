import axios from "axios";
import urlBase from '../const';

export class FilesHandler {
    async downloadFile(fileId) {
        try {
            const response = await axios.get(
                `${urlBase}/downloadFile/${fileId}`,
                {
                    responseType: "blob",
                }
            );

            return response;

        } catch (error) {
            throw error.response?.data || { message: "Download failed" };
        }
    }
}