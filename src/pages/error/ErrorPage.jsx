import Container from "../../components/global/Container"

const ErrorPage = () => {
  return (
    <>
      <Container>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="aura aura-rainbow duration-2000 items-center">
            <div className="card bg-base-100">
              <div className="card-body">
                <p className="text-9xl">404</p>
                <p>You found a path we haven’t built yet.</p>
              </div>
            </div>
          </div>    
        </div>
      </Container>
    </>
  )
}

export default ErrorPage