import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import { withRouter } from 'react-router-dom'
import { auth, provider } from '../firebase'
const KEY_USER_DATA = 'user_data'
class Login extends Component {

    state = {
        email: '',
        password: '',
        user: null
    }

    loginFacebook = () => {
        auth.signInWithPopup(provider).then(({ user }) => {
            this.setState({ user })
            localStorage.setItem(
                KEY_USER_DATA,
                JSON.stringify({
                    isLoggedIn: true,
                    email: user.email
                })
            );
            this.props.history.replace("/movies")

        })
    }
    
    logoutFacebook = () => {
        auth.signOut().then(() => {
            this.setState({ user: null }) 
        })
    }

    navigateToMainPage = () => {
        const { history } = this.props;
        history.push('/movies');
    }

    componentDidMount() {
        const jsonStr = localStorage.getItem(KEY_USER_DATA);
        const isLoggedIn = jsonStr && JSON.parse(jsonStr).isLoggedIn;
        if (isLoggedIn) {
           this.navigateToMainPage();
        }
    }

    onEmailChange = (event) => {
        const email = event.target.value
        this.setState({ email })
    }
    onPasswordChange = (event) => {
        const password = event.target.value
        this.setState({ password })
    }


    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword(password) {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return re.test(String(password));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

        });
    }

    render() {
        return (
            <div className='LoginPage'>
                <h2>Login</h2>
                <Form>

                    <Form.Item >
                        <Input
                            prefix={<Icon type="user" />}
                            type="email"
                            placeholder="Email"
                            onChange={this.onEmailChange}
                        />
                    </Form.Item>

                    <Form.Item >
                        <Input
                            prefix={<Icon type="key" />}
                            type="password"
                            placeholder="Password"
                            onChange={this.onPasswordChange}
                        />
                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={
                            () => {
                                const isValid = this.validateEmail(this.state.email)
                                const isValidPassword = this.validatePassword(this.state.password)
                                // 1. length >= 8
                                // 2. upper > 0
                                // 3. lower > 0
                                // 4. number

                                if (isValid && isValidPassword) {
                                    const { history } = this.props
                                    localStorage.setItem(
                                        KEY_USER_DATA,
                                        JSON.stringify({
                                            isLoggedIn: true,
                                            email: this.state.email
                                        })
                                    );
                                    this.loginFacebook();

                                } else {
                                    //TODO: handele email is invalid
                                    message.error('Email or Password invalid', 1);
                                }


                            }//ใส่ function เพื่อรอให้กดก่อน ไม่งั้นมันจะ render เลย
                        }>Submit</Button>
                        <br/>
                        <br/>
                        <Button icon="facebook" onClick={this.loginFacebook}>Login with Facebook</Button>
                    </Form.Item>

                </Form>
            </div>

        )

    }

}
export default withRouter(Login)