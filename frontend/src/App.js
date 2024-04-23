import './App.css';

function Register() {
    return (
        <div className='register'>
            <h2 className='register-header'>Register</h2>
            <form className='register-container'>
                <p>
                    <input type='text' placeholder='email' />
                </p>
                <p>
                    <input type='text' placeholder='Username' />
                </p>
                <p>
                    <input type='password' placeholder='Password' />
                </p>
                <p>
                    <input type='password' placeholder='Confirm Password' />
                </p>
                <p>
                    <input type='submit' value='Register' />
                </p>
            </form>
        </div>
    );
}

function Login() {
    return (
        <div className='login'>
            <h2 className='login-header'>Login</h2>
            <form className='login-container'>
                <p>
                    <input type='text' placeholder='email' />
                </p>
                <p>
                    <input type='password' placeholder='Password' />
                </p>
                <p>
                    <input type='submit' value='Login' />
                </p>
            </form>
        </div>
    );
}

function App() {
    return (
        <>
            {Register()}
            {Login()}
        </>
    );
}

export default App;
