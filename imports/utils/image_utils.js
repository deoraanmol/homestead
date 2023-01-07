export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const toBase64List = files => {
    let allResults = [];
    for (let i = 0; i < files.length; i++) {
        const img = files[i];
        if (typeof img === "string" && img.includes("base64")) {
            allResults.push(img);
        } else {
            const result = toBase64(img);
            allResults.push(result);
        }
    }
    return Promise.all(allResults);
}