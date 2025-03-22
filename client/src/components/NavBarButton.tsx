function NavBarButton(props: any) {
    const {isSidebarOpen, onClickHandler, LayoutDashboard} = props
    
  return (
    <div>
        <button
            onClick={onClickHandler}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
            <LayoutDashboard size={24} />
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
        </button>
    </div>
  )
}

export default NavBarButton;