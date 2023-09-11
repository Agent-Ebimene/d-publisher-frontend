import { CAROUSEL_QUERY_KEYS } from 'api/carousel/carouselKeys'
import { useToaster } from 'providers/ToastProvider'
import { CarouselSlide, UpdateCarouselSlideData } from 'models/carousel/carouselSlide'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CAROUSEL, SLIDES, UPDATE } = CAROUSEL_QUERY_KEYS

const updateCarouselSlide = async (id: string | number, request: UpdateCarouselSlideData): Promise<CarouselSlide> => {
	const response = await http.patch<CarouselSlide>(`${CAROUSEL}/${SLIDES}/${UPDATE}/${id}`, { request })
	return response.data
}

export const useUpdateCarouselSlide = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: UpdateCarouselSlideData) => updateCarouselSlide(id, request),
		onSuccess: () => {
			toaster.add('Carousel slide udpated! 🎉', 'success')
		},
		onError: toaster.onQueryError,
	})
}
