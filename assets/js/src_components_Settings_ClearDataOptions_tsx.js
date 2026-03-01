"use strict";
(globalThis["webpackChunkproductbay"] = globalThis["webpackChunkproductbay"] || []).push([["src_components_Settings_ClearDataOptions_tsx"],{

/***/ "./src/components/Settings/ClearDataOptions.tsx"
/*!******************************************************!*\
  !*** ./src/components/Settings/ClearDataOptions.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/rotate-ccw.js");
/* harmony import */ var _components_ui_Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/Modal */ "./src/components/ui/Modal.tsx");
/* harmony import */ var _components_ui_Input__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ui/Input */ "./src/components/ui/Input.tsx");
/* harmony import */ var _components_ui_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/components/ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _context_ToastContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/context/ToastContext */ "./src/context/ToastContext.tsx");
/* harmony import */ var _components_ui_Skeleton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/components/ui/Skeleton */ "./src/components/ui/Skeleton.tsx");
/* harmony import */ var _store_settingsStore__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/store/settingsStore */ "./src/store/settingsStore.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










/**
 * ClearDataOptions Component
 *
 * Settings section for completely resetting plugin data to default state.
 */
const ClearDataOptions = (0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(({
  loading
}) => {
  const [showConfirmModal, setShowConfirmModal] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [confirmText, setConfirmText] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const {
    resetSettings,
    saving
  } = (0,_store_settingsStore__WEBPACK_IMPORTED_MODULE_8__.useSettingsStore)();
  const {
    toast
  } = (0,_context_ToastContext__WEBPACK_IMPORTED_MODULE_6__.useToast)();
  const handleReset = async () => {
    try {
      var _result$deleted_table;
      const result = await resetSettings();
      const deletedCount = (_result$deleted_table = result?.deleted_tables) !== null && _result$deleted_table !== void 0 ? _result$deleted_table : 0;
      toast({
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Factory Reset Complete', 'productbay'),
        description: deletedCount > 0 ? `${deletedCount} ${deletedCount === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('table', 'productbay') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('tables', 'productbay')} ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('deleted. All data has been reset to factory defaults. Reloading...', 'productbay')}` : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All data has been reset to factory defaults. Reloading...', 'productbay'),
        type: 'success'
      });
      setShowConfirmModal(false);
      setConfirmText('');

      // Reload after a brief delay so the user can see the toast
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Failed', 'productbay'),
        description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Failed to reset plugin data. Please try again.', 'productbay'),
        type: 'error'
      });
    }
  };

  // Loading state
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "p-6",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "h-7 w-40 bg-gray-200 rounded animate-pulse mb-6"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "flex items-center justify-between p-4 border border-gray-100 rounded-lg",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "h-5 w-48 bg-gray-200 rounded animate-pulse"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "h-4 w-64 bg-gray-200 rounded animate-pulse"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_ui_Skeleton__WEBPACK_IMPORTED_MODULE_7__.Skeleton, {
          className: "h-10 w-32 rounded"
        })]
      })]
    });
  }

  // Render the clear data options
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "p-6",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("h3", {
      className: "text-lg font-semibold text-red-600 mt-0 mb-4",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear Data', 'productbay')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "font-medium text-red-800",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset to Factory Defaults', 'productbay')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          className: "text-sm text-red-600 mt-1",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This will permanently delete all saved tables, settings, styles, and configurations — restoring the plugin to its freshly installed state.', 'productbay')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_components_ui_Button__WEBPACK_IMPORTED_MODULE_5__.Button, {
        variant: "destructive",
        onClick: () => setShowConfirmModal(true),
        disabled: saving,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset all data of ProductBay', 'productbay'),
        className: "flex-shrink-0 cursor-pointer",
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Data', 'productbay'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
          className: "w-4 h-4 ml-2"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_ui_Modal__WEBPACK_IMPORTED_MODULE_3__.Modal, {
      isOpen: showConfirmModal,
      onClose: () => {
        setShowConfirmModal(false);
        setConfirmText('');
      },
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset All Plugin Data?', 'productbay'),
      maxWidth: "sm",
      closeOnBackdropClick: true,
      primaryButton: {
        text: saving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Resetting...', 'productbay') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yes, Reset Everything', 'productbay'),
        onClick: handleReset,
        variant: 'danger',
        icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
          className: "w-4 h-4"
        }),
        disabled: saving || confirmText !== 'RESET'
      },
      secondaryButton: {
        text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', 'productbay'),
        onClick: () => {
          setShowConfirmModal(false);
          setConfirmText('');
        },
        variant: 'secondary',
        disabled: saving
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "space-y-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          className: "text-gray-800 font-medium m-0",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This action is irreversible.', 'productbay')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          className: "text-gray-600 m-0 text-sm",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This will delete all your saved tables and reset every setting to factory defaults. The plugin will return to its freshly installed state. This cannot be undone.', 'productbay')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "pt-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Type "RESET" to confirm:', 'productbay')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_ui_Input__WEBPACK_IMPORTED_MODULE_4__.Input, {
            type: "text",
            value: confirmText,
            onChange: e => setConfirmText(e.target.value),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('RESET', 'productbay'),
            className: "w-full"
          })]
        })]
      })
    })]
  });
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClearDataOptions);

/***/ }

}]);
//# sourceMappingURL=src_components_Settings_ClearDataOptions_tsx.js.map?ver=73c21b3b6e9a3f01205b