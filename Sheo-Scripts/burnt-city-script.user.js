// ==UserScript==
// @name         Burnt City
// @namespace    http://tampermonkey.net/
// @version      1.8
// @downloadURL https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Burnt-City.user.js
// @updateURL  https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/Burnt-City.user.js
// @description  Replace town map and building-list images
// @match        *://*.illyriad.co.uk/*
// @match        *://elgea.illyriad.co.uk/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const BUILDING_SIZE = 50;
    const BUILDING_OFFSET = (75 - BUILDING_SIZE) / 2;
    const BURNT = 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/Burnt%20Building.png';
    const CASTLE = 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/recolored%20broken%20castle.png';

    let mapOn = GM_getValue('mapOn', true);
    let buildingsOn = GM_getValue('buildingsOn', true);

    // Ground, walls, trees, castle, and plots outside the walls.
    const MAP_ONLY = {
        'back.jpg':            'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/destroyed%20back.jpg',
        '03-roads.png':        'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/cracked%20roads.png',
        '03-squarebushes.png': 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/burnt%20square.png',
        '03-fountain.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/empty%20fountain.png',
        '03-wall_upper.png':   'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/collapsed%20upper%20wall.png',
        '03-wall_lower.png':   'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/collapsed%20lower%20wall.png',
        'lumberwood.png':      'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/burnt%20lumber%20black.png',
        '03-castle_off.png':   CASTLE,
        '03-lumberjack_off.png': 'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/burned%20lumbermill.png',
        '03-claypit_off.png':    'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/destroyed%20clay%20pit.png',
        '03-ironmine_right_off.png': '',
        '03-ironmine_left_off.png':  '',
        '03-quarry_right_off.png':   '',
        '03-quarry_left_off.png':    '',
        '03-farm_1_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%201.png',
        '03-farm_2_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%202.png',
        '03-farm_3_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%203.png',
        '03-farm_4_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%204.png',
        '03-farm_5_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%205.png',
        '03-farm_6_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm6.png',
        '03-farm_7_off.png':     'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%207.png',
        '03-farm_5_c_off.png':   'https://raw.githubusercontent.com/Sheogorath-Kvatch/Sheo-Script/refs/heads/main/destroyed%20city/farm%205%20(no%20wall).png',
        'build.gif':                        'https://usagif.com/wp-content/uploads/gifs/fire-65.gif',
    };

    // Buildings inside the walls.
    const BUILDINGS = {

        '03-barracks_off.png':              BURNT,
        '03-warehouse_off.png':             BURNT,
        '03-flourmill_off.png':             BURNT,
        '03-library_off.png':               BURNT,
        '03-storehouse_off.png':            BURNT,
        '03-marketplace_off.png':           BURNT,
        '03-paddock_off.png':               BURNT,
        '03-magetower_off.png':             BURNT,
        '03-commonground_off.png':          BURNT,
        '03-saddlemaker_off.png':           BURNT,
        '03-consulate_off.png':             BURNT,
        '03-fletcher_off.png':              BURNT,
        '03-blacksmith_off.png':            BURNT,
        '03-forge_off.png':                 BURNT,
        '03-spearmaker_off.png':            BURNT,
        '03-tanner_off.png':                BURNT,
        '03-farmyard_off.png':              BURNT,
        '03-skinnersguild_off.png':         BURNT,
        '03-archersfield_off.png':          BURNT,
        '03-architectsoffice_off.png':      BURNT,
        '03-arcticwarfarecollege_off.png':  BURNT,
        '03-assassinsabode_off.png':        BURNT,
        '03-bookbinder_off.png':            BURNT,
        '03-bowyer_off.png':                BURNT,
        '03-brewery_off.png':               BURNT,
        '03-carpenter_off.png':             BURNT,
        '03-cavalryparadeground_off.png':   BURNT,
        '03-chainsmith_off.png':            BURNT,
        '03-chanceryofestates_off.png':     BURNT,
        '03-cottage_off.png':               BURNT,
        '03-desertwarfarecollege_off.png':  BURNT,
        '03-emptytownplotbuildlist_off.png':'',
        '03-foreignoffice_off.png':         BURNT,
        '03-foundry_off.png':               BURNT,
        '03-geomancersretreat_off.png':     BURNT,
        '03-herbalist_off.png':             BURNT,
        '03-horsetrainer2_off.png':         BURNT,
        '03-infantryquarters_off.png':      BURNT,
        '03-junglewarfarecollege_off.png':  BURNT,
        '03-kiln_off.png':                  BURNT,
        '03-leathersmith_off.png':          BURNT,
        '03-merchantsguild_off.png':        BURNT,
        '03-miner_off.png':                 BURNT,
        '03-platesmith_off.png':            BURNT,
        '03-runmastersgrounding_off.png':   BURNT,
        '03-saboteurssanctuary_off.png':    BURNT,
        '03-scoutslookout_off.png':         BURNT,
        '03-siegeworkshop_off.png':         BURNT,
        '03-spearmensbillets_off.png':      BURNT,
        '03-spearsmith_off.png':            BURNT,
        '03-spieshidout_off.png':           BURNT,
        '03-stonemason_off.png':            BURNT,
        '03-swordsmith_off.png':            BURNT,
        '03-taverna_off.png':               BURNT,
        '03-thievesden_off.png':            BURNT,
        '03-tradeoffice_off.png':           BURNT,
        '03-trapper_off.png':               BURNT,
        '03-vault_off.png':                 BURNT
    };

    const mapPairs = Object.entries(MAP_ONLY).filter(([, url]) => url);
    const buildingPairs = Object.entries(BUILDINGS).filter(([, url]) => url);

    function shrinkBuilding(img, needle) {
        if (!needle.includes('_off.png')) return;
        if (needle.includes('wall_') || needle.includes('castle') || needle.includes('farm_')) return;
        img.style.width = BUILDING_SIZE + 'px';
        img.style.height = BUILDING_SIZE + 'px';
        img.style.objectFit = 'contain';
        img.style.marginLeft = BUILDING_OFFSET + 'px';
        img.style.marginTop = BUILDING_OFFSET + 'px';
    }

    function clearShrink(img) {
        img.style.width = '';
        img.style.height = '';
        img.style.objectFit = '';
        img.style.marginLeft = '';
        img.style.marginTop = '';
    }

    function restore(img, tag) {
        if (img.dataset.skinTag !== tag) return;
        if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
        delete img.dataset.skinned;
        delete img.dataset.skinTag;
        delete img.dataset.originalSrc;
        clearShrink(img);
    }

    function swap(img, pairs, tag, allowShrink) {
        if (img.dataset.skinned && img.dataset.skinTag === tag) return;
        const src = img.dataset.originalSrc || img.getAttribute('src') || '';
        if (!src) return;
        for (const [needle, url] of pairs) {
            if (src.includes(needle)) {
                if (!img.dataset.originalSrc) img.dataset.originalSrc = img.getAttribute('src') || src;
                img.src = url;
                img.dataset.skinned = '1';
                img.dataset.skinTag = tag;
                if (allowShrink) shrinkBuilding(img, needle);
                return;
            }
        }
    }

    function capKeepCastle() {
        if (!mapOn) return;
        document.querySelectorAll('img').forEach(img => {
            if (img.closest('#townMap')) return;
            const src = img.dataset.originalSrc || img.getAttribute('src') || img.src || '';
            if (!src.includes('03-castle_off.png') && !src.includes('recolored')) return;
            if (img.dataset.skinTag !== 'map') {
                img.dataset.originalSrc = img.getAttribute('src') || src;
                img.src = CASTLE;
                img.dataset.skinned = '1';
                img.dataset.skinTag = 'map';
            }
            img.style.setProperty('width', '251px', 'important');
            img.style.setProperty('height', '169px', 'important');
            img.style.setProperty('max-width', '251px', 'important');
            img.style.setProperty('max-height', '169px', 'important');
            img.style.objectFit = 'contain';
        });
    }

    function apply() {
        document.querySelectorAll('img').forEach(img => {
            if (!mapOn && img.dataset.skinTag === 'map') restore(img, 'map');
            if (!buildingsOn && img.dataset.skinTag === 'building') restore(img, 'building');
        });
        if (mapOn) {
            document.querySelectorAll('#townMap img, img').forEach(img => swap(img, mapPairs, 'map', false));
            capKeepCastle();
        }
        if (buildingsOn) {
            document.querySelectorAll('img').forEach(img => swap(img, buildingPairs, 'building', true));
        }
    }

    function registerMenus() {
        GM_registerMenuCommand((mapOn ? 'City skin: ON' : 'City skin: OFF') + ' — click to toggle', () => {
            mapOn = !mapOn;
            GM_setValue('mapOn', mapOn);
            apply();
            location.reload();
        });
        GM_registerMenuCommand((buildingsOn ? 'Buildings: ON' : 'Buildings: OFF') + ' — click to toggle', () => {
            buildingsOn = !buildingsOn;
            GM_setValue('buildingsOn', buildingsOn);
            apply();
            location.reload();
        });
    }

    registerMenus();
    apply();
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    console.log('Illyriad town skin loaded. Map:', mapOn, 'Buildings:', buildingsOn);
})();