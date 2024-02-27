
import * as React from 'react'
import toast from 'react-hot-toast';
import MainLayout from "~/layout/main";
import { api } from '~/utils/api';

export default function ManageHotspot() {

  const ctx = api.useContext()
  const { data: latestHotspot, isFetching: gettingLatestHotspot } = api.wifi.getLatestHotspot.useQuery(undefined, { refetchOnWindowFocus: false })

  const { mutate: updateLatestHotspot, isLoading: updatingHotspot } = api.wifi.updateLatestHotspot.useMutation({
    onSuccess: () => {
      setDuration("")
      setRedirectUrl("")
      void ctx.wifi.invalidate();
      toast.success("Success update hotspot!");
    },
    onError: () => {
      setDuration("")
      setRedirectUrl("")
      void ctx.wifi.invalidate();
      toast.error("error")
    }
  })

  const [duration, setDuration] = React.useState("")
  const [maxBytes, setMaxBytes] = React.useState("")
  const [upSpeed, setUpSpeed] = React.useState("")
  const [downSpeed, setDownSpeed] = React.useState("")
  const [redirectUrl, setRedirectUrl] = React.useState("")
  React.useEffect(() => {
    if (!gettingLatestHotspot && latestHotspot) {
      setDuration(latestHotspot.duration)
      setRedirectUrl(latestHotspot.redirectUrl)
      setUpSpeed(latestHotspot.upSpeed)
      setDownSpeed(latestHotspot.downSpeed)
      setMaxBytes(latestHotspot.maxBytes)
    }
  }, [gettingLatestHotspot, latestHotspot])

  const handleUpdateHotspot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateLatestHotspot({
      duration: +duration,
      upSpeed: +upSpeed,
      downSpeed: +downSpeed,
      maxBytes: +maxBytes,
      redirectUrl
    })
  }

  return (
    <section>
      <form onSubmit={handleUpdateHotspot} className='flex flex-col gap-4 max-w-[500px]'>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Session/Time duration in minute</span>
          </label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="session duration" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Max Upload Speed in Kilo Bytes (KB)</span>
          </label>
          <input type="number" value={upSpeed} onChange={(e) => setUpSpeed(e.target.value)} placeholder="Max upload size" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Max Download Speed in Kilo Bytes (KB)</span>
          </label>
          <input type="number" value={downSpeed} onChange={(e) => setDownSpeed(e.target.value)} placeholder="Max download size" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Max Used Quota in Mega Bytes (MB)</span>
          </label>
          <input type="number" value={maxBytes} onChange={(e) => setMaxBytes(e.target.value)} placeholder="Max used quota" className="input input-bordered w-full" />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Redirect Url</span>
          </label>
          <input type="text" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} placeholder="redirect after loggedin" className="input input-bordered w-full" />
        </div>
        <button type='submit' className="btn btn-active btn-primary">
          {updatingHotspot ? "loading..." : "Save"}
        </button>
      </form>
    </section>
  );
}

ManageHotspot.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout title="Manage Hotspot">{page}</MainLayout>;
};
