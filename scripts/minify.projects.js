"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var minify_1 = require("minify");
var Project_1 = require("@/services/Project");
var fs_1 = require("fs");
var project = new Project_1.Project();
var getProjectsFiles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var projects;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.default.promises.readdir(project.getProjectsPath(''))];
            case 1:
                projects = _a.sent();
                return [2 /*return*/, {
                        projects: projects.filter(function (name) { return !name.includes('.'); }),
                        files: projects.filter(function (name) { return name.includes('.'); }),
                    }];
        }
    });
}); };
var minifyFiles = function (files, slug, dir, type) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, files_1, file, filePath, minFilePath, minContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, files_1 = files;
                _a.label = 1;
            case 1:
                if (!(_i < files_1.length)) return [3 /*break*/, 6];
                file = files_1[_i];
                filePath = project.getProjectsPath("".concat(slug, "/").concat(dir, "/").concat(file));
                minFilePath = filePath.replace(".".concat(type), ".min.".concat(type));
                return [4 /*yield*/, (0, minify_1.minify)(filePath).catch(console.error)];
            case 2:
                minContent = _a.sent();
                if (!minContent) return [3 /*break*/, 4];
                return [4 /*yield*/, fs_1.default.promises.writeFile(minFilePath, minContent)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4: throw Error("Error occurred during minify ".concat(slug, ":").concat(file));
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
var minifyProject = function (slug) { return __awaiter(void 0, void 0, void 0, function () {
    var jsFiles, cssFiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // eslint-disable-next-line no-console
                console.info("Start minify ".concat(slug, " project"));
                return [4 /*yield*/, project.getProjectJsFiles(slug, false)];
            case 1:
                jsFiles = _a.sent();
                return [4 /*yield*/, project.getProjectCssFiles(slug, false)];
            case 2:
                cssFiles = _a.sent();
                return [4 /*yield*/, minifyFiles(jsFiles, slug, 'js', 'js')];
            case 3:
                _a.sent();
                return [4 /*yield*/, minifyFiles(cssFiles, slug, 'css', 'css')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, projects, files, _i, projects_1, project_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getProjectsFiles()];
            case 1:
                _a = _b.sent(), projects = _a.projects, files = _a.files;
                return [4 /*yield*/, minifyFiles(project.filterAssetFile(files, false, 'js'), '', '', 'js')];
            case 2:
                _b.sent();
                return [4 /*yield*/, minifyFiles(project.filterAssetFile(files, false, 'css'), '', '', 'css')];
            case 3:
                _b.sent();
                _i = 0, projects_1 = projects;
                _b.label = 4;
            case 4:
                if (!(_i < projects_1.length)) return [3 /*break*/, 7];
                project_1 = projects_1[_i];
                return [4 /*yield*/, minifyProject(project_1)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.default = run;
