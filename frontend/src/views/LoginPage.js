const submitLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === ""){
        alert("Please enter email");
        return;
    }
    if (password === ""){
        alert("Please enter password");
        return;
    }
    
    
    fetch('http://34.28.230.12/api/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}

const LoginPage = () =>{
    
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={submitLogin}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default LoginPage;