// ==UserScript==
// @name         Artifact Downloader
// @version     2.0
// @description Downloads GitHub action artifacts without login using nightly.link
// @license     MIT
// @author      rushiranpise
// @namespace   https://github.com/rushiranpise
// @match        https://github.com/*/*/actions/*
// @run-at      document-idle
// @grant       GM_addStyle
// @connect     github.com
// @connect     githubusercontent.com
// @require     https://greasyfork.org/scripts/398877-utils-js/code/utilsjs.js?version=1079637
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=1108163
// ==/UserScript==

(() => {
    "use strict";
  
    const logoStyle = `style="
      height: 1.1em;
      width: 1.1em;
      vertical-align: text-bottom;
      align: center;
    "`;
  
    const nightly = `
      <?xml version="1.0" encoding="UTF-8"?>
      <svg width="200" height="200" version="1.1" viewBox="0 0 16.933 16.933" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:xlink="http://www.w3.org/1999/xlink" ${logoStyle}>
      <defs>
      <linearGradient id="a" x2="16.933" y2="16.933" gradientTransform="matrix(.99095 0 0 .99095 .076581 .076581)" gradientUnits="userSpaceOnUse">
      <stop offset="0"/>
      <stop stop-color="#800080" offset="1"/>
      </linearGradient>
      </defs>
      <metadata>
      <rdf:RDF>
      <cc:Work rdf:about="">
      <dc:format>image/svg+xml</dc:format>
      <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
      <dc:title/>
      </cc:Work>
      </rdf:RDF>
      </metadata>
      <circle cx="8.4667" cy="8.4667" r="8.3901" fill="url(#a)" stroke-width="0"/>
      <g transform="matrix(.99095 0 0 .99095 -.06265 .29134)" fill="#fff" shape-rendering="auto" stroke="#fffffe" stroke-linecap="round" stroke-width=".11084">
      <path d="m3.8065 9.5646c-0.9645 0.9645-0.96494 2.5377-4.389e-4 3.5022 0.9645 0.9645 2.5537 0.97812 3.5044 0l2.0649-2.1245c-0.44239 0.09499-0.86495 0.10338-1.3024-2e-3l-1.44 1.4508c-0.60136 0.60136-1.5477 0.60179-2.1491 4.4e-4 -0.60136-0.60136-0.60136-1.5481 0-2.1495l2.6651-2.6965c0.48328-0.39493 0.95991-0.40541 1.1485-0.40541 0.60998 0 1.3021 0.44663 1.5148 1.0379l0.60227-0.63209c-0.33713-0.85002-1.3475-1.3871-2.1908-1.3994-0.015894 0-0.031754 0.00187-0.047637 0.00223-0.62383 0.018243-1.2472 0.26733-1.7303 0.75044l-0.00132-0.00132z" color="#000000" color-rendering="auto" dominant-baseline="auto" image-rendering="auto" solid-color="#000000" stop-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;font-variation-settings:normal;inline-size:0;isolation:auto;mix-blend-mode:normal;shape-margin:0;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
      <path d="m13.408 6.9353c0.9645-0.9645 0.96494-2.5377 4.4e-4 -3.5022-0.9645-0.9645-2.5537-0.97812-3.5044 0l-2.0649 2.1245c0.44239-0.094985 0.86495-0.10338 1.3024 2e-3l1.44-1.4508c0.60136-0.60136 1.5477-0.60179 2.1491-4.4e-4 0.60136 0.60136 0.60136 1.5481 0 2.1495l-2.6651 2.6965c-0.48328 0.39493-0.95991 0.40541-1.1485 0.40541-0.60998 0-1.3021-0.44663-1.5148-1.0379l-0.60227 0.63209c0.33713 0.85002 1.3475 1.3871 2.1908 1.3994 0.015894 0 0.031754-0.0019 0.047637-0.0022 0.62383-0.01824 1.2472-0.26733 1.7303-0.75044l0.0013 0.00133z" color="#000000" color-rendering="auto" dominant-baseline="auto" image-rendering="auto" solid-color="#000000" stop-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;font-variation-settings:normal;inline-size:0;isolation:auto;mix-blend-mode:normal;shape-margin:0;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
      </g>
      </svg>
    `;
  
    function addNightlyButton() {
      const goToFile = $("#artifacts > div > div > div");
      if (!goToFile || $(".nightly-link")) {
        return;
      }
  
      const margin = goToFile.classList.contains("mr-2") ? "mr-2" : "ml-2";
      const link = make({
        el: "a",
        id: "nightly",
        className: `nightly btn ${margin} tooltipped tooltipped-n`,
        attrs: {
          href: `https://nightly.link${window.location.pathname}`,
          "aria-label": "Download these artifacts with nightly.link",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        html: `${nightly} Download`,
      });
      goToFile.after(link);
      GM_addStyle(`
        @media print {
            #nightly {
                display: none;
            }
        }
  
        .btn {
            margin-top: 10px;
        }
      `);
    }
  
    function init() {
      addNightlyButton();
    }
  
    on(document, "ghmo:container pjax:end", init);
    init();
  })();
  