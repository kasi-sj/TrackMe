'use server'
export const getBackEndUrl = async () => {
    const url = process.env.BACKEND_URL;
    return url;
}