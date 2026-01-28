import "./loginPage.scss";
import {Form} from "./Loginform";
import {LoginFooter} from "./LoginFooter";
const LoginPage = () => {
  return (
    <div className="h-screen">
      <div className="login-bg">
        <div className="login-box">
          <div className="w-full">
            <div className="flex">
              <div className="flex-none">
                <div className="login-logo-box">
                  <img src="src/assets/images/login-logo-2x.png"></img>
                </div>
              </div>
              <div className="flex-none">
                <div className="login-div">
                  <div className="flex flex-col login-text">
                    Login
                  </div>
                  <div className="flex flex-col login-text-description">
                    <span className="desc1">Welcome to Banashree Foundation
                      <span className="desc2"> Admin portal, Please enter email and password to continue.</span></span>
                  </div>
                  <div className="flex flex-col login-form-div">
                    <Form/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginFooter/>
      </div>
    </div>
  )
}

export default LoginPage