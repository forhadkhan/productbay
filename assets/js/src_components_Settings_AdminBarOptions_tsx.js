"use strict";
(globalThis["webpackChunkproductbay"] = globalThis["webpackChunkproductbay"] || []).push([["src_components_Settings_AdminBarOptions_tsx"],{

/***/ "./src/components/Settings/AdminBarOptions.tsx"
/*!*****************************************************!*\
  !*** ./src/components/Settings/AdminBarOptions.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_ui_Toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/Toggle */ "./src/components/ui/Toggle.tsx");
/* harmony import */ var _components_ui_Skeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/Skeleton */ "./src/components/ui/Skeleton.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * AdminBarOptions Component
 *
 * Settings section for controlling the display of ProductBay in the WordPress admin bar.
 * When enabled, the plugin will show a quick-access menu in the top admin bar.
 */
const AdminBarOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({
  settings,
  setSettings,
  loading
}) => {
  var _settings$show_admin_;
  // Show skeleton loading state while settings are being fetched
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "p-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "h-7 w-40 bg-gray-200 rounded animate-pulse mb-6"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "flex items-center justify-between p-4 border border-gray-100 rounded-lg",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "h-5 w-48 bg-gray-200 rounded animate-pulse"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "h-4 w-64 bg-gray-200 rounded animate-pulse"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_ui_Skeleton__WEBPACK_IMPORTED_MODULE_3__.Skeleton, {
          className: "h-6 w-11 rounded-full"
        })]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "p-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
      className: "text-lg font-semibold text-gray-800 mt-0 mb-4",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Admin Bar', 'productbay')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-lg",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
          className: "font-medium text-gray-800",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show in Admin Bar', 'productbay')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "text-sm text-gray-600 mt-1",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display ProductBay menu in the WordPress admin bar at the top of the page for quick access.', 'productbay')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_ui_Toggle__WEBPACK_IMPORTED_MODULE_2__.Toggle, {
        checked: (_settings$show_admin_ = settings.show_admin_bar) !== null && _settings$show_admin_ !== void 0 ? _settings$show_admin_ : true,
        onChange: e => setSettings({
          ...settings,
          show_admin_bar: e.target.checked
        }),
        disabled: loading,
        className: "flex-shrink-0 border-gray-200"
      })]
    })]
  });
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AdminBarOptions);

/***/ }

}]);
//# sourceMappingURL=src_components_Settings_AdminBarOptions_tsx.js.map?ver=ef1ea655dd3d59aa0ba3