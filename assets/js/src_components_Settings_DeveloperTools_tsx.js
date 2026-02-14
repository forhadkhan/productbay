"use strict";
(globalThis["webpackChunkproductbay"] = globalThis["webpackChunkproductbay"] || []).push([["src_components_Settings_DeveloperTools_tsx"],{

/***/ "./src/components/Settings/DeveloperTools.tsx"
/*!****************************************************!*\
  !*** ./src/components/Settings/DeveloperTools.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _context_ToastContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../context/ToastContext */ "./src/context/ToastContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const DeveloperTools = () => {
  const {
    toast
  } = (0,_context_ToastContext__WEBPACK_IMPORTED_MODULE_0__.useToast)();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
      className: "text-lg font-medium text-gray-900 mb-4",
      children: "Developer Tools"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "p-4 bg-gray-50 rounded-lg border border-gray-200",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h4", {
        className: "text-sm font-medium text-gray-900 mb-2",
        children: "Toast Notifications"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        className: "text-sm text-gray-500 mb-4",
        children: "Test different toast notification types."
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "flex flex-wrap gap-3",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          onClick: () => toast({
            title: 'Success!',
            description: 'This is a success toast message.',
            type: 'success'
          }),
          className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors",
          children: "Success"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          onClick: () => toast({
            title: 'Error!',
            description: 'This is an error toast message.',
            type: 'error'
          }),
          className: "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors",
          children: "Error"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          onClick: () => toast({
            title: 'Info',
            description: 'This is an info toast message.',
            type: 'info'
          }),
          className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors",
          children: "Info"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          onClick: () => toast({
            title: 'Warning!',
            description: 'This is a warning toast message.',
            type: 'warning'
          }),
          className: "px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors",
          children: "Warning"
        })]
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeveloperTools);

/***/ }

}]);
//# sourceMappingURL=src_components_Settings_DeveloperTools_tsx.js.map?ver=230f3e5c218957b62934