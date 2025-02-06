let users = []; 

// search

document.getElementById('searchBox').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    displayUsers(searchText); 
});

function fetchUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            users = data;  
            displayUsers(); 
        });
}

// users list

function displayUsers(searchText = '') {
    const filteredUsers = searchText ? users.filter(user => user.name.toLowerCase().includes(searchText)) : users;
    const userGrid = document.getElementById('userGrid');
    userGrid.innerHTML = filteredUsers.map(user => `
        <div class="userCard">
            <img src="img/placeholder.svg" alt="User Image">
            <h2>${user.name}</h2>
            <p>${user.username}</p>
            <a href="mailto:${user.email}">${user.email}</a>
            <button class="popup-button" onclick="showUserInfo('${user.id}')">More Info</button>
            <button class="edit-button" onclick="editUser('${user.id}')">Edit</button>
            <button class="delete-button" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
    `).join('');
}

// full info in modal

function showUserInfo(userId) {
    const user = users.find(user => user.id.toString() === userId.toString());
    if (!user) return;
    const userInfoModal = document.getElementById('userInfoModal');
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
                <h2>${user.name}</h2>
                <p>Username: ${user.username}</p>
                <p>Email: <a href="mailto:${user.email}"> ${user.email}</a></p>
                <p>Address:
                <a href="https://www.google.com/maps/" target="_blank"> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</a></p>
                <p>Phone: <a href="tel:${user.phone}"> ${user.phone}</a></p>
                <p>Website: <a href="https://${user.website}" target="_blank"> ${user.website}</a></p>
                <p>Company: ${user.company.name}</p>
                <p>Catch Phrase: "${user.company.catchPhrase}"</p>
                <p>Phrase: "${user.company.bs}"</p>

                <div class="modal-map-container">
                    <h3>Geolocation:</h3>
                    <p>${user.address.geo.lat} , ${user.address.geo.lng}</p>
                    <iframe src="https://maps.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}&hl=en;z=6&amp;output=embed"></iframe>
                </div>
            `;
            userInfoModal.style.display = "block";
}

// delete user

function deleteUser(userId) {
    userId = userId.toString(); 
    users = users.filter(user => user.id.toString() !== userId);  
    displayUsers();  
}

// edit user

function editUser(userId = '') {
    const user = users.find(user => user.id.toString() === userId.toString()) || {
        id: '',
        name: '',
        username: '',
        email: '',
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
                lat: '',
                lng: ''
            }
        },
        phone: '',
        website: '',
        company: {
            name: '',
            catchPhrase: '',
            bs: ''
        }
    };
    
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserUsername').value = user.username;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserStreet').value = user.address.street;
    document.getElementById('editUserSuite').value = user.address.suite;
    document.getElementById('editUserCity').value = user.address.city;
    document.getElementById('editUserZipcode').value = user.address.zipcode;
    document.getElementById('editUserLat').value = user.address.geo.lat;
    document.getElementById('editUserLng').value = user.address.geo.lng;
    document.getElementById('editUserPhone').value = user.phone;
    document.getElementById('editUserWebsite').value = user.website;
    document.getElementById('editUserCompany').value = user.company.name;
    document.getElementById('editUserCatchPhrase').value = user.company.catchPhrase;
    document.getElementById('editUserBs').value = user.company.bs;
    document.getElementById('userEditModal').style.display = "block";
}

//save after edit

function saveOrUpdateUser() {
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value;
    const username = document.getElementById('editUserUsername').value;
    const email = document.getElementById('editUserEmail').value;
    const street = document.getElementById('editUserStreet').value;
    const suite = document.getElementById('editUserSuite').value;
    const city = document.getElementById('editUserCity').value;
    const zipcode = document.getElementById('editUserZipcode').value;
    const lat = document.getElementById('editUserLat').value;
    const lng = document.getElementById('editUserLng').value;
    const phone = document.getElementById('editUserPhone').value;
    const website = document.getElementById('editUserWebsite').value;
    const companyName = document.getElementById('editUserCompany').value;
    const catchPhrase = document.getElementById('editUserCatchPhrase').value;
    const bs = document.getElementById('editUserBs').value;

    const updatedUser = {
        id,
        name,
        username,
        email,
        address: {
            street,
            suite,
            city,
            zipcode,
            geo: {
                lat,
                lng
            }
        },
        phone,
        website,
        company: {
            name: companyName,
            catchPhrase,
            bs
        }
    };

    if (id) {
        const index = users.findIndex(user => user.id.toString() === id.toString());
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
        }
    } else {
        updatedUser.id = Math.max(0, ...users.map(user => parseInt(user.id, 10))) + 1; // new ID for new user
        users.push(updatedUser);
    }

    displayUsers();
    document.getElementById('userEditModal').style.display = "none";
}

// close on X
document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        this.closest('.modal').style.display = "none";
    });
});

// close on click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(event) {
        if (event.target === this) {
            this.style.display = "none";
        }
    });
});




fetchUsers('');
