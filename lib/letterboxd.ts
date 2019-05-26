import axios, { AxiosInstance } from 'axios';
import { URL } from 'url';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import qs from 'qs';

const LETTERBOXD_ORIGIN = 'https://letterboxd.com';

const getCsrfCookieFromJar = (jar: CookieJar): string => {
    const cookies = jar.getCookiesSync(LETTERBOXD_ORIGIN);
    const csrfCookie = cookies.find(cookie => cookie.key.indexOf('csrf') !== -1);
    if(!csrfCookie){
        throw new Error('No csrf-cookie found.');
    }
    return csrfCookie.value;
}

const getDefaultAxiosClient = (jar: CookieJar = new CookieJar()): AxiosInstance => {
    const client = axios.create({
        jar,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    axiosCookieJarSupport(client);
    return client;
}

const getSlugByIndexId = async (index: string, id: string): Promise<string> => {
    const response = await axios.head(`${LETTERBOXD_ORIGIN}/${index}/${id}/`, {
        maxRedirects: 0,
        validateStatus: status => status === 302
    });

    return response.headers.location.replace(/^\/film\//, '');
};

export const getSlugByIndexIds = async (imdbId?: string, tmdbId?: string): Promise<string> => {
    if(tmdbId){
        try {
            return await getSlugByIndexId('tmdb', tmdbId);
        } catch (e){ }
    }
    if(imdbId){
        try {
            return await getSlugByIndexId('imdb', imdbId);
        } catch (e){ }
    }
    throw new Error(`Letterbox movie with IMDB-ID ${imdbId}/TMDB-ID ${tmdbId} not found.`);
};

export const toggleWatched = async (filmSlug: string, isWatched: boolean, jar: CookieJar): Promise<void> => {
    const client = getDefaultAxiosClient(jar);
    const action = isWatched ? 'mark-as-watched' : 'mark-as-not-watched';

    const response = await client.post(`${LETTERBOXD_ORIGIN}/film/${filmSlug}/${action}/`, qs.stringify({
        __csrf: getCsrfCookieFromJar(jar)
    }));

    if(response.data.result !== true){
        throw new Error(response.data);
    }
};

export const getAuthenticatedJar = async (username: string, password: string): Promise<CookieJar> => {
    const client = getDefaultAxiosClient();
    const cookieJar = <CookieJar>client.defaults.jar;

    // Pre-flight
    await client.head(LETTERBOXD_ORIGIN);

    const login = await client.post(`${LETTERBOXD_ORIGIN}/user/login.do`, qs.stringify({
        __csrf: getCsrfCookieFromJar(cookieJar),
        username,
        password
    }));

    if(login.data.result !== 'success'){
        throw new Error(login.data.messages.join('\n'));
    }

    return cookieJar;
};
