// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');

    // Check for saved username and set it as the input's value if present
    chrome.storage.local.get(['username'], function(result) {
        if (result.username) {
            usernameInput.value = result.username;
        }
    });
    
    document.querySelector('button').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        chrome.storage.local.set({username: username}, function() {
            console.log('Username saved:', username);
        });
    });
});
