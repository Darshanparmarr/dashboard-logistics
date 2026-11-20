
const Container = ({children, className}) => {
  return (
    <div className={` px-5 sm:px-25 ${className}`}>
          {children}
    </div>
  )
}

export default Container