const Loading = ({ w }: { w: number }) => {
  return (
      <div className='animate-spin '>
          <div className={`w-${w} h-${w} p-3 border-4 border-white border-b-orange-800  rounded-full`}></div>
      </div>
  )
}

export default Loading
