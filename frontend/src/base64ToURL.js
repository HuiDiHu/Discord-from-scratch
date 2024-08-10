const base64ToURL = (base64Str) => {
    const binaryString = window.atob(base64Str);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    return URL.createObjectURL( new Blob([bytes], { type: 'image/png' }) );
}

export default base64ToURL;