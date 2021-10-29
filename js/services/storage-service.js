'use strict'

function saveToStorage(key, val) {
    const json = JSON.stringify(val);
    localStorage.setItem(key, json);
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return JSON.parse(val)
}

