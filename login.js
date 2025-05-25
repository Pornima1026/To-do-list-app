// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginCard = document.querySelector('.login-card');
    const signupCard = document.getElementById('signupCard');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');

    // Function to show error message
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
        // Hide error after 5 seconds
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }

    // Function to clear errors
    function clearErrors() {
        loginError.classList.remove('show');
        signupError.classList.remove('show');
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error');
        });
    }

    // Show signup form
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearErrors();
        loginCard.style.display = 'none';
        signupCard.style.display = 'block';
    });

    // Show login form
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearErrors();
        signupCard.style.display = 'none';
        loginCard.style.display = 'block';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();

        // Basic validation
        if (!emailValue || !passwordValue) {
            showError(loginError, 'Please fill in all fields');
            if (!emailValue) email.classList.add('error');
            if (!passwordValue) password.classList.add('error');
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === emailValue && u.password === passwordValue);

        if (user) {
            // Store logged in user info
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Redirect to main page
            window.location.href = 'index.html';
        } else {
            showError(loginError, 'Invalid email or password');
            email.classList.add('error');
            password.classList.add('error');
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        const name = document.getElementById('name');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        const nameValue = name.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();

        // Basic validation
        if (!nameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
            showError(signupError, 'Please fill in all fields');
            if (!nameValue) name.classList.add('error');
            if (!emailValue) email.classList.add('error');
            if (!passwordValue) password.classList.add('error');
            if (!confirmPasswordValue) confirmPassword.classList.add('error');
            return;
        }

        // Validate passwords match
        if (passwordValue !== confirmPasswordValue) {
            showError(signupError, 'Passwords do not match');
            password.classList.add('error');
            confirmPassword.classList.add('error');
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.some(user => user.email === emailValue)) {
            showError(signupError, 'Email already registered');
            email.classList.add('error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: nameValue,
            email: emailValue,
            password: passwordValue
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Store logged in user info
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Redirect to main page
        window.location.href = 'index.html';
    });
}); 