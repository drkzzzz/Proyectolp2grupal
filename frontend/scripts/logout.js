// logout.js - clear auth data and redirect to login
(function(){
    window.logoutUser = function(){
        try {
            // Clear known keys
            const keys = ['tapstyle_user','tapstyle_role','user_permissions','tapstyle_token','tapstyle_cart','tapstyle_favoritos'];
            keys.forEach(k => localStorage.removeItem(k));
        } catch(e){}

        // Determine redirect path depending on current location
        try {
            const p = window.location.pathname;
            if (p.includes('/pages/')) {
                // pages are under .../pages/cliente/pages/
                window.location.href = '../login.html';
            } else if (p.includes('/cliente/')) {
                window.location.href = 'login.html';
            } else {
                window.location.href = '../pages/cliente/login.html';
            }
        } catch(e){
            window.location.href = '../login.html';
        }
    };
})();
