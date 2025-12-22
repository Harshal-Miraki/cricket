export const imagekitConfig = {
    publicKey: "public_dOmYYJbcTwdhF5i4lqzs4uGlSxw=",
    urlEndpoint: "https://ik.imagekit.io/1s1zyxkfn",
};

// Function to upload image to ImageKit via their upload API
export async function uploadToImageKit(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `payment_${Date.now()}_${file.name}`);
    formData.append("publicKey", imagekitConfig.publicKey);
    formData.append("folder", "/tournament-payments");

    // For client-side uploads without authentication endpoint,
    // we'll use a base64 approach with the upload API
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const base64 = (reader.result as string).split(",")[1];

                // Use ImageKit upload API
                const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        file: base64,
                        fileName: `payment_${Date.now()}_${file.name}`,
                        publicKey: imagekitConfig.publicKey,
                        folder: "/tournament-payments",
                    }),
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }

                const data = await response.json();
                resolve(data.url);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

// Simple function to generate a data URL for preview (used for local preview before upload)
export function getImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}
