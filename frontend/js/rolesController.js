const backendUrl = localStorage.getItem('backendUrl');
const adminRoleId = 4;

export async function checkAdmin() {
    try {
        const response = await fetch(`${backendUrl}/users/get/${userId}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch roles');
        }

        const data = await response.json();

        for (const role of data) {
            if (role.id === adminRoleId) {
                // don't show mod nav bar
                const navbar = document.getElementById('mod-vertical-navbar');
                if (navbar) {
                    navbar.hidden = false;
                }
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error fetching roles:', error);
        return false;
    }
}

export async function checkRoles() {
    try {
        const response = await fetch(`${backendUrl}/roles/get/${userId}/wallet`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        let privilegedUser = false;
        if (data.role && Array.isArray(data.role)) {
            data.role.forEach(element => {
                console.log(element);
                if (element.wallet && element.wallet.length > 0) {
                    privilegedUser = true;
                }
            });
        }

        return { privilegedUser, data: data|| [] }; // Возвращаем объект с нужной структурой
    } catch (error) {
        console.error('Error fetching roles:', error);
        return { privilegedUser: false, data: [] }; // Обработка ошибок
    }
}