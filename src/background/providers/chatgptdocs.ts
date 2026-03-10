import axios from "axios";
import FormData from "form-data";

const API_FOR_NOW = "sec_DUW4TJG3DfCY9GK5Gfz9wvKT5E3RGIIi"

export async function uploadToPdfDoc(files) {
    try {
        const formData = new FormData();
        formData.append("file", files);
        const options = {
            headers: {
                "x-api-key": API_FOR_NOW,
            },
        };
        const response = await axios.post(
            "https://api.chatpdf.com/v1/sources/add-file",
            formData,
            options
        );
        console.log("Source ID:", response.data.sourceId);
        return response.data.sourceId;
    } catch (error) {
        console.log(error);
        return "error"
    }
}

export async function chatToPdfDoc(sourceId , messages) {
    try {
        console.log("Source ID:", sourceId)
        console.log("Messages:", messages)

        const body = {
            sourceId: sourceId,
            messages: serialize(messages),
        };

        console.log({body})
            
        const options = {
            headers: {
                "x-api-key": API_FOR_NOW,
            },
        };

        const response = await axios.post(
            "https://api.chatpdf.com/v1/chats/message",
            body,
            options
        );

        return response.data.content;

    } catch (error) {
        console.log(error);
        return "error"
    }
}

function serialize(messages) {
    return messages.map((msg) => {
        if (msg.sender === "user") {
            return {
                role: "user",
                content: msg.message,
            };
        } else {
            return {
                role: "assistant",
                content: msg.message,
            };
        }
    });
}

// function deserialize(messages) {
//     return messages.map((msg) => {
//         if (msg.role === "user") {
//             return {
//                 sender: "user",
//                 message: msg.content,
//             };
//         } else {
//             return {
//                 sender: "assistant",
//                 message: msg.content,
//             };
//         }
//     });
// }
