import {createClient, ErrorResponse, Photos} from 'pexels';
import {ImageData} from '../types/ImageData'

const client = createClient('563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf')

export const fetchRandomImage = async (): Promise<ImageData | null> => {
    try {
        const page = Math.floor(Math.random() * 80) + 1
        const response: Photos | ErrorResponse = await client.photos.curated({
            page,
            per_page: 80
        })
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
                }
            } else {
                console.log('Недостаточно данных для создания изображения')
                return null
            }
        } else {
            console.log('Ошибка при получении изображения:', response)
            return null
        }
    } catch (error) {
        console.log('Ошибка при получении изображения:', error)
        return null
    }
}
