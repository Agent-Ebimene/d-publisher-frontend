import React, { InputHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cloneDeep, remove } from 'lodash'
import clsx from 'clsx'

import ImageIcon from 'public/assets/vector-icons/image.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { convertFileToBlob } from 'utils/file'
import SkeletonImage from './SkeletonImage'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	id: string
	label?: string
	allowMultipleFiles?: boolean
	onUpload?: (uploadedFiles: UploadedFile[]) => void
	previewUrl?: string
}

type UploadedFile = { url: string; file: File }

const FileUpload = forwardRef<HTMLInputElement, Props>(
	(
		{
			id,
			label,
			allowMultipleFiles = false,
			previewUrl = '',
			onUpload = () => {},
			onClick = () => {},
			className = '',
			...props
		},
		ref
	) => {
		const componentRef = useRef<HTMLInputElement>(null)
		const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
			previewUrl ? [{ url: previewUrl, file: undefined as unknown as any }] : []
		)
		const [draggingFileOver, setDraggingFileOver] = useState<boolean>(false)

		const { getRootProps, getInputProps } = useDropzone({
			onDragEnter: () => {
				setDraggingFileOver(true)
			},
			onDragLeave: () => {
				setDraggingFileOver(false)
			},
			onDrop: async (files) => {
				setDraggingFileOver(false)

				if (!allowMultipleFiles && files.length > 1) return

				const uploads: UploadedFile[] = []

				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					const blob = await convertFileToBlob(file)

					const url = URL.createObjectURL(blob)

					uploads.push({ url, file })
				}

				setUploadedFiles(uploads)
			},
		})

		useImperativeHandle(ref, () => componentRef.current as HTMLInputElement)

		const handleClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			event.preventDefault()
			event.stopPropagation()
			onClick(event)
		}

		const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (!event.target) return

			const files = event.target.files || []

			if (!allowMultipleFiles && files.length > 1) return

			const uploads: UploadedFile[] = []

			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				const blob = await convertFileToBlob(file)

				const url = URL.createObjectURL(blob)

				uploads.push({ url, file })
			}

			setUploadedFiles(uploads)
			onUpload(uploads)
		}

		const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => {
			if (!componentRef.current) return
			event.preventDefault()
			event.stopPropagation()

			const deepClonedUploadedFiles = cloneDeep(uploadedFiles)

			remove(deepClonedUploadedFiles, (deepClonedUploadedFile) => deepClonedUploadedFile.url === uploadedFile.url)

			setUploadedFiles(deepClonedUploadedFiles)
			URL.revokeObjectURL(uploadedFile.url)
			componentRef.current.value = ''
		}

		useEffect(() => {
			if (previewUrl) {
				setUploadedFiles([{ url: previewUrl, file: undefined as unknown as File }])
			}
		}, [previewUrl])

		return (
			<label
				htmlFor={id}
				className={clsx('file-upload', className, {
					'file-upload--no-pointer': uploadedFiles.length > 0,
					'file-upload--dropping': draggingFileOver,
				})}
				{...getRootProps()}
			>
				{uploadedFiles.length > 0 && (
					<div className='preview-image-list'>
						{uploadedFiles.map((uploadedFile) => {
							return (
								<div
									key={uploadedFile.url}
									className={clsx('preview-image-wrapper', {
										'preview-image-wrapper--cover': uploadedFiles.length === 1,
									})}
								>
									{uploadedFile.file?.type.includes('pdf') ? (
										<embed src={uploadedFile.url} width='100%' height='100%' />
									) : (
										<SkeletonImage fill src={uploadedFile.url || previewUrl} alt='' className='preview-image' />
									)}
									<button className='close-button' onClick={(event) => handleRemoveFile(event, uploadedFile)}>
										<CloseIcon className='close-icon' />
									</button>
								</div>
							)
						})}
					</div>
				)}

				<input
					{...props}
					{...getInputProps}
					id={id}
					type='file'
					multiple={allowMultipleFiles}
					onChange={handleFileChange}
					onClick={handleClick}
					ref={componentRef}
					// disabled={uploadedFiles.length > 0}
				/>
				{uploadedFiles.length === 0 && (
					<>
						<ImageIcon className='image-icon' />
						<span className='label'>{label}</span>
					</>
				)}
			</label>
		)
	}
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
