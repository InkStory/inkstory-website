"use strict";
const fs = require("fs");
const upath = require("upath");
const sh = require("shelljs");

module.exports = function renderAssets() {
    const sourcePath = upath.resolve(
        upath.dirname(__filename),
        "../src/assets"
    );
    const destPath = upath.resolve(upath.dirname(__filename), "../dist/.");

    sh.cp(
        "-R",
        upath.resolve(upath.dirname(__filename), "../src/robots.txt"),
        upath.resolve(upath.dirname(__filename), "../dist/.")
    );
    sh.cp(
        "-R",
        upath.resolve(upath.dirname(__filename), "../src/sitemap.xml"),
        upath.resolve(upath.dirname(__filename), "../dist/.")
    );

    sh.cp("-R", sourcePath, destPath);
};
