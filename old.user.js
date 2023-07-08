// ==UserScript==
// @name         Artifact Downloader
// @namespace    rushiranpise
// @version      1.0
// @description  Downloads GitHub action artifacts without login using nightly.link
// @author       rushiranpise
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the URL redirection
    function redirectGitHubUrl(url) {
        // Extract the username, repo, and run ID from the URL
        const matchResult = url.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/actions\/runs\/([^/]+)/);
        if (matchResult) {
            const [, username, repo, runId] = matchResult;

            // Build the new URL
            const newUrl = `https://nightly.link/${username}/${repo}/actions/runs/${runId}`;

            // Redirect to the new URL
            window.location.replace(newUrl);
        }
    }

    // Event listener for click events on run links
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A') {
            const url = target.href;

            // Check if the clicked link is a run link
            if (url.includes('/actions/runs/')) {
                // Prevent default link navigation
                event.preventDefault();

                // Perform the redirection
                redirectGitHubUrl(url);
            }
        }
    });

    // Call the redirection function on initial page load
    redirectGitHubUrl(window.location.href);
})();
