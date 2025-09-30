export default function PopUp({ children }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white p-10 max-w-xl w-full relative m-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}