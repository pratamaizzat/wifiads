import * as React from 'react'
import { toast } from 'react-hot-toast';
import { env } from "~/env.mjs";
import MainLayout from "~/layout/main";
import { api } from '~/utils/api';

export default function ManageNotif() {
  const [content, setContent] = React.useState("")
  const [segment, setSegment] = React.useState("")

  const { mutate: sendNotif, isLoading: sendingNotif } = api.manageNotif.sendNotif.useMutation({
    onSuccess: (data) => {
      if(data.id) {
        toast.success('Success send notification')
      } else {
        toast.error(JSON.stringify(data.errors))
      }
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendNotif({content, segment})
  }

  return (
    <section>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">App ID</span>
          </label>
          <input disabled value={env.NEXT_PUBLIC_ONESIGNAL_APP_ID} type="text" placeholder="Type here" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">Segment</span>
          </label>
          <select onChange={(e) => setSegment(e.target.value)} defaultValue="" className="select select-bordered">
            <option disabled value="">Pick one</option>
            <option value="Active Users">Active Users</option>
            <option value="Inactive Users">Inactive Users</option>
            <option value="Active Subscriptions">Active Subscriptions</option>
            <option value="Inactive Subscriptions">Inactive Subscriptions</option>
          </select>
        </div>
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">Content</span>
          </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="textarea textarea-bordered h-24" placeholder="Content"></textarea>
        </div>

        <button type='submit' className={`btn btn-primary ${sendingNotif ? 'loading' : ''}`}>Send</button>
      </form>
    </section>
  );
}

ManageNotif.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout title="Manage Notification">{page}</MainLayout>;
};
