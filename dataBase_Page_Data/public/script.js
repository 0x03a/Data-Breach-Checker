// --- Admin Page Logic ---
if (document.getElementById('userForm')) {
  const userForm = document.getElementById('userForm');
  const usersTable = document.getElementById('usersTable').querySelector('tbody');
  const importBtn = document.getElementById('importPasswords');
  let editingId = null;

  async function fetchUsers() {
    const res = await fetch('/admin/users');
    const users = await res.json();
    usersTable.innerHTML = '';
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.fullname}</td>
        <td>${user.email}</td>
        <td>${user.isAdmin ? 'Yes' : 'No'}</td>
        <td>
          <button onclick="editUser('${user._id}')">Edit</button>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
      usersTable.appendChild(tr);
    });
  }

  window.editUser = async (id) => {
    const res = await fetch(`/admin/users`);
    const users = await res.json();
    const user = users.find(u => u._id === id);
    if (user) {
      document.getElementById('userId').value = user._id;
      document.getElementById('fullname').value = user.fullname;
      document.getElementById('email').value = user.email;
      document.getElementById('isAdmin').checked = user.isAdmin;
      editingId = user._id;
    }
  };

  window.deleteUser = async (id) => {
    await fetch(`/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  userForm.onsubmit = async (e) => {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const isAdmin = document.getElementById('isAdmin').checked;
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const user = { fullname, email, password, isAdmin };
    if (editingId) {
      await fetch(`/admin/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      editingId = null;
    } else {
      await fetch('/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    }
    userForm.reset();
    fetchUsers();
  };

  importBtn.onclick = async () => {
    await fetch('/admin/import-passwords', { method: 'POST' });
    alert('Passwords imported!');
  };

  fetchUsers();
}

// --- Home Page Auth Logic ---
if (document.getElementById('loginBtn')) {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeMsg = document.getElementById('welcomeMsg');

  async function checkSession() {
    const token = sessionStorage.getItem('token');
    const res = await fetch('/auth/session', token ? { headers: { 'Authorization': 'Bearer ' + token } } : {});
    const data = await res.json();
    if (data.loggedIn) {
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      logoutBtn.style.display = '';
      welcomeMsg.textContent = `Welcome, ${data.user.fullname}`;
      if (data.user.isAdmin) {
        window.location.href = '/admin.html';
      }
    } else {
      loginBtn.style.display = '';
      signupBtn.style.display = '';
      logoutBtn.style.display = 'none';
      welcomeMsg.textContent = '';
    }
  }

  logoutBtn.onclick = async () => {
    const token = sessionStorage.getItem('token');
    await fetch('/auth/logout', { method: 'POST', headers: token ? { 'Authorization': 'Bearer ' + token } : {} });
    sessionStorage.removeItem('token');
    checkSession();
    window.location.href = '/';
  };

  checkSession();
} 