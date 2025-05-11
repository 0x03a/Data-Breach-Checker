document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('userCheckPasswordInput');
    const btn = document.getElementById('userCheckPasswordBtn');
    const alertDiv = document.getElementById('passwordCheckAlert');

    function showAlert(message, color) {
        alertDiv.textContent = message;
        alertDiv.style.color = color;
        alertDiv.style.fontWeight = 'bold';
        alertDiv.style.background = color === 'red' ? '#ffeaea' : '#eaffea';
        alertDiv.style.border = `1px solid ${color}`;
        alertDiv.style.padding = '0.75em 1em';
        alertDiv.style.borderRadius = '8px';
        alertDiv.style.textAlign = 'center';
    }

    btn.onclick = async function() {
        const password = input.value.trim();
        alertDiv.textContent = '';
        if (!password) {
            showAlert('Please enter a password.', 'red');
            return;
        }
        // Optional: local validation before sending
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordPattern.test(password)) {
            showAlert('Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.', 'red');
            return;
        }
        try {
            const res = await fetch('/admin/check-password-breach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok) {
                if (data.breached) {
                    showAlert(data.message, 'red');
                } else {
                    showAlert(data.message, 'green');
                }
            } else {
                showAlert(data.message || 'Server error.', 'red');
            }
        } catch (e) {
            showAlert('Server error.', 'red');
        }
    };
}); 