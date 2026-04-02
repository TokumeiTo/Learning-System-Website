const getFullImageUrl = (url: string | undefined) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
};

export default getFullImageUrl;