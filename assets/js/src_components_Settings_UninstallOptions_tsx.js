"use strict";
(globalThis["webpackChunkproductbay"] = globalThis["webpackChunkproductbay"] || []).push([["src_components_Settings_UninstallOptions_tsx"],{

/***/ "./src/components/Settings/UninstallOptions.tsx"
/*!******************************************************!*\
  !*** ./src/components/Settings/UninstallOptions.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_ui_Toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ui/Toggle */ "./src/components/ui/Toggle.tsx");
/* harmony import */ var _components_ui_Skeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/ui/Skeleton */ "./src/components/ui/Skeleton.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const UninstallOptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(({
  settings,
  setSettings,
  loading
}) => {
  var _settings$delete_on_u;
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "p-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "h-7 w-40 bg-gray-200 rounded animate-pulse mb-6"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "flex items-center justify-between p-4 border border-gray-100 rounded-lg",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "h-5 w-48 bg-gray-200 rounded animate-pulse"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "h-4 w-64 bg-gray-200 rounded animate-pulse"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_Skeleton__WEBPACK_IMPORTED_MODULE_2__.Skeleton, {
          className: "h-6 w-11 rounded-full"
        })]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "p-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
      className: "text-lg font-semibold text-red-600 mt-0 mb-4",
      children: "Uninstall Options"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "font-medium text-gray-800",
          children: "Delete Data on Uninstall"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "text-sm text-gray-600 mt-1",
          children: "Enable this to wipe all tables and settings when deleting the plugin."
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ui_Toggle__WEBPACK_IMPORTED_MODULE_1__.Toggle, {
        checked: (_settings$delete_on_u = settings.delete_on_uninstall) !== null && _settings$delete_on_u !== void 0 ? _settings$delete_on_u : true,
        onChange: e => setSettings({
          ...settings,
          delete_on_uninstall: e.target.checked
        }),
        disabled: loading,
        className: "flex-shrink-0 border-gray-200"
      })]
    })]
  });
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UninstallOptions);

/***/ },

/***/ "./src/components/ui/Toggle.tsx"
/*!**************************************!*\
  !*** ./src/components/ui/Toggle.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Toggle: () => (/* binding */ Toggle),
/* harmony export */   toggleContainerVariants: () => (/* binding */ toggleContainerVariants)
/* harmony export */ });
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! class-variance-authority */ "./node_modules/class-variance-authority/dist/index.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_cn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/utils/cn */ "./src/utils/cn.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * Variants for the toggle container (label) wrapper.
 * Handles the sizing and basic layout of the toggle.
 */

const toggleContainerVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_0__.cva)('relative inline-flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', {
  variants: {
    size: {
      default: 'h-6',
      lg: 'h-7',
      sm: 'h-5',
      xs: 'h-4'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

/**
 * Variants for the toggle switch (the moving circle and background).
 * Handles the visual appearance of the switch in different states (checked, focused).
 */
const toggleSwitchVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_0__.cva)('bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-blue-600', {
  variants: {
    size: {
      default: 'w-11 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5',
      lg: 'w-14 h-7 after:top-[2px] after:left-[2px] after:h-6 after:w-6',
      sm: 'w-9 h-5 after:top-[2px] after:left-[2px] after:h-4 after:w-4',
      xs: 'w-7 h-4 after:top-[2px] after:left-[2px] after:h-3 after:w-3'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

/**
 * Props for the Toggle component.
 * Extends standard HTML input attributes (excluding 'size' to avoid conflict)
 * and includes variant props from class-variance-authority.
 */

/**
 * A specialized checkbox component that looks like a toggle switch.
 * Supports different sizes and an optional label.
 */
const Toggle = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({
  className,
  size,
  label,
  ...props
}, ref) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
    className: (0,_utils_cn__WEBPACK_IMPORTED_MODULE_2__.cn)(toggleContainerVariants({
      size
    }), className),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
      type: "checkbox",
      className: "sr-only peer",
      ref: ref,
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: (0,_utils_cn__WEBPACK_IMPORTED_MODULE_2__.cn)(toggleSwitchVariants({
        size
      }))
    }), label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "ml-3 text-sm font-medium text-gray-900",
      children: label
    })]
  });
});
Toggle.displayName = 'Toggle';


/***/ }

}]);
//# sourceMappingURL=src_components_Settings_UninstallOptions_tsx.js.map?ver=dfd9ed18d5ed0f6f3fdc