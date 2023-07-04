import {createClient} from 'pexels';
import {ImageData} from '../types/ImageData';

const client = createClient('563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf');

export const fetchRandomImage = async (): Promise<ImageData | null> => {
    try {
        const page = Math.floor(Math.random() * 80) + 1;
        const response = await client.photos.curated({page, per_page: 80});
        if ('photos' in response) {
            const photo = response.photos[0];
            const imageUrl = photo?.src?.landscape;
            const photographer = photo?.photographer;
            const photographerUrl = photo?.photographer_url;

            if (imageUrl && photographer && photographerUrl) {
                return {
                    imageUrl,
                    photographer,
                    photographerUrl,
                };
            } else {
                console.log('Недостаточно данных для создания изображения');
                return null;
            }
        } else {
            console.log('Ошибка при получении изображения:', response);
            return null;
        }
    } catch (error) {
        console.log('Ошибка при получении изображения:', error);
        return null;
    }
};

export const fetchImages = async (page: number) => {
    try {
        const response = await client.photos.curated({page, per_page: 6});
        if ('photos' in response) {
            return response.photos.map((photo) => ({
                imageUrl: photo.src.original,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
            }));
        } else {
            console.log('Ошибка при получении изображений:', response);
            return [];
        }
    } catch (error) {
        console.error('Ошибка при получении изображений:', error);
        return [];
    }
};

export const searchImages = async (query: string, page: number): Promise<ImageData[]> => {
    try {
        const response = await client.photos.search({ query, page, per_page: 20 });
        if ('photos' in response) {
            return response.photos.map((photo) => ({
                imageUrl: photo.src.original,
                photographer: photo.photographer,
                photographerUrl: photo.photographer_url,
            }));
        } else {
            console.log('Ошибка при получении изображений:', response);
            return [];
        }
    } catch (error) {
        console.error('Ошибка при получении изображений:', error);
        return [];
    }
};
