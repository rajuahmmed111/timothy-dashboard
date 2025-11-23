
import PendingVerification from '../../../components/dashboard/PendingVerification'
import CommunicationSupport from '../../../components/dashboard/CommunicationSupport'

const CommAndverification = ({isLoading, overviewData}) => {
  return (
    <div className='flex flex-col md:flex-row justify-center items-center gap-6  mx-auto  rounded-2xl'>
        <CommunicationSupport supportData={overviewData?.data?.Supports}></CommunicationSupport>
        <PendingVerification isLoading={isLoading} overviewData={overviewData}></PendingVerification>
    </div>
  )
}

export default CommAndverification