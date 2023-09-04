import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, FAVOURITISE } = COMIC_QUERY_KEYS

const favouritiseComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${FAVOURITISE}/${slug}`)
	return response.data
}

export const useFavouritiseComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => favouritiseComic(slug),
		onError: toaster.onQueryError,
	})
}
