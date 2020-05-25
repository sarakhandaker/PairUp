import React, { Component } from 'react'

export class Login extends Component {
    render() {
        return (
        <div className="container login-container">
            <div class="row">
                <div class="col-md-6 login-form-1">
                    <h3>Login!</h3>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Your Email *" value="" />
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" placeholder="Your Password *" value="" />
                        </div>
                        <div class="form-group">
                            <input type="submit" class="btnSubmit" value="Login" />
                        </div>
                </div>
                <div class="col-md-6 login-form-2">
                    <h3>Signup!</h3>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Your Email *" value="" />
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Your Country" value="" />
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" placeholder="Your Password *" value="" />
                        </div>
                        <div class="form-group">
                            <input type="submit" class="btnSubmit" value="Signup" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login