// TODO: REFACTOR!!!
import * as React from 'react'
import { toast } from 'react-hot-toast';
import MainLayout from "~/layout/main";
import { api } from "~/utils/api";

export default function ManagePortal() {

  const [file, setFile] = React.useState<File | null>(null)
  const [fileVideo, setFileVideo] = React.useState<File | null>(null)
  const [title, setTitle] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [isUpload, setIsUpload] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const fileInputVideoRef = React.useRef<HTMLInputElement>(null)
  const [fromUploadBanner, setFromUploadBanner] = React.useState(false)
  const [fromUploadPopup, setFromUploadPopup] = React.useState(false)

  
  const updateBanner = api.upload.createPresignUrlV2.useMutation({
    onSuccess: async ({url, key}) => {
      setIsUpload(true)
      setFromUploadBanner(true)

      await fetch(url, {
        method: 'PUT',
        body: file
      })

      updatePortal.mutate({
        key,
      })
    },
    onError: () => {
      setIsUpload(false)
      setFromUploadBanner(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = null as unknown as string
      }
      toast.error("Failed Upload Banner")
    }
  })

  const updatePopupVideo = api.upload.createPresignUrlV2.useMutation({
    onSuccess: async ({url, key}) => {
      setIsUpload(true)
      setFromUploadBanner(false)
      setFromUploadPopup(true)

      await fetch(url, {
        method: 'PUT',
        body: fileVideo
      })

      updatePortal.mutate({
        keyAds: key,
      })
    },
    onError: () => {
      setIsUpload(false)
      setFromUploadBanner(false)
      setFromUploadPopup(false)
      if (fileInputVideoRef.current) {
        fileInputVideoRef.current.value = null as unknown as string
      }
      toast.error("Failed Upload Popup")
    }
  })

  const updatePortal = api.managePortal.updatePortal.useMutation({
    onSuccess: () => {
      if(fromUploadBanner) {
        setFromUploadBanner(false)
        setFromUploadPopup(false)
        setIsUpload(false)
        setFile(null)
        toast.success('Success change Banner')

        if (fileInputRef.current) {
          fileInputRef.current.value = null as unknown as string
        }

        return
      }

      if(fromUploadPopup) {
        setFromUploadBanner(false)
        setFromUploadPopup(false)
        setIsUpload(false)
        setFile(null)
        setFileVideo(null)
        toast.success('Success change Popup')

        if (fileInputVideoRef.current) {
          fileInputVideoRef.current.value = null as unknown as string
        }

        return
      }

      toast.success('Success change portal')
      setMessage("")
      setTitle("")
    },
    onError: () => {
      if(fromUploadBanner || fromUploadPopup) {
        setFromUploadBanner(false)
        setFromUploadPopup(false)
        setIsUpload(false)
        setFile(null)
        setFileVideo(null)
        toast.error('Failed change Banner or Popup')

        if (fileInputRef.current) {
          fileInputRef.current.value = null as unknown as string
        }
        if (fileInputVideoRef.current) {
          fileInputVideoRef.current.value = null as unknown as string
        }

        return
      }

      toast.error('Error change portal')
      setMessage("")
      setTitle("")
    }
  })

  const handleUpdatePortal  = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updatePortal.mutate({
      message,
      title
    })
  }

  const handleUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] as File)
    updateBanner.mutate()
  }
  const handleUploadPopup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileVideo(e.target.files?.[0] as File)
    updatePopupVideo.mutate()
  }

  return (
    <section>
      <form onSubmit={handleUpdatePortal} className='flex flex-col gap-4 max-w-[500px]'>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Banner</span>
          </label>
          <input ref={fileInputRef} name='file' onChange={handleUploadBanner} type="file" className="file-input file-input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="file-input file-input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Message Logged</span>
          </label>
          <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" className="file-input file-input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Popup Video</span>
          </label>
          <input ref={fileInputVideoRef} name='file-video' onChange={handleUploadPopup} type="file" className="file-input file-input-bordered w-full" />
        </div>
        <button 
          className={`btn btn-primary ${updateBanner.isLoading || updatePortal.isLoading || isUpload ? 'loading': ''}`} 
          type='submit' 
        >
          Save
        </button>
      </form>
    </section>
  );
}

ManagePortal.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout title="Manage Portal">{page}</MainLayout>;
};
